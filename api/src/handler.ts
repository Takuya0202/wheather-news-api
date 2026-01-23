import { RouteHandler } from "@hono/zod-openapi";
import { searchRoute, wheatherRoute } from "./route";
import { Bindings } from ".";
import type { FeatureCollection, Point } from 'geojson'
import { WeatherApiResponse } from "../schema/response";
import { exchangeWheatherCode, getWeatherIconUrl, exchangeWindDirection } from "../domain/exchangeWheatherInfo";
import { createMessageFromHumidity } from "../domain/createMessageFromHumidity";
import { createMessageFromWind } from "../domain/createMessageFromWind";
import { createMessageFromCurrentRain } from "../domain/createMessageFromRain";
import { createLaundryStatus } from "../domain/createLaundryStatus";
import { createAtmosStatus } from "../domain/createAtmosStatus";
import { createHairMessage } from "../domain/createHairMessage";
import { createFeelTempMessage } from "../domain/createFeelTempMessage";

export const searchHandler: RouteHandler<typeof searchRoute, { Bindings: Bindings }> = async (c) => {
  const { place } = c.req.valid('query');
  const mapboxApiKey = c.env.MAPBOX_API_KEY;

  if (!mapboxApiKey) {
    return c.json({
      message: '検索に失敗しました。',
      error_details: 'MAPBOX_API_KEYが設定されていません。'
    }, 400)
  }

  try {
    const res = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${place}&language=ja&access_token=${mapboxApiKey}`)
    const data: FeatureCollection<Point> = await res.json()
    const places = data.features.map(f => ({
      name: f.properties?.full_address ?? '',
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0]
    }))
    return c.json({
      places,
      is_empty: places.length === 0
    }, 200)
  } catch (error) {
    return c.json({
      message: '検索に失敗しました。',
      error_details: "MAPBOXAPIの取得で失敗しました。"
    }, 400)
  }
}

export const wheatherHandler: RouteHandler<typeof wheatherRoute, { Bindings: Bindings }> = async (c) => {
  const { lat, lon } = c.req.valid('query');
  const weatherApiKey = c.env.WHATHER_NEWS_API_KEY;

  if (!weatherApiKey) {
    return c.json({
      message: '天気情報の取得に失敗しました。',
      error_details: 'WHATHER_NEWS_API_KEYが設定されていません。'
    }, 400)
  }

  try {
    const res = await fetch(`https://wxtech.weathernews.com/api/v1/ss1wx?lat=${lat}&lon=${lon}`, {
      headers: {
        'X-Api-Key': weatherApiKey
      }
    })
    const data: WeatherApiResponse = await res.json()

    // 気象データを取得
    const wxdata = data.wxdata[0]
    const currentSrf = wxdata.srf[0] // 現在の短期予報データ

    // 気温の最高・最低を計算（24時間分）
    const next24Hours = wxdata.srf.slice(0, 24)
    const validTemps = next24Hours.filter(d => d.temp !== -9999).map(d => d.temp)
    const maxTemp = validTemps.length > 0 ? Math.max(...validTemps) : 0
    const minTemp = validTemps.length > 0 ? Math.min(...validTemps) : 0

    // 各関数を呼び出してレスポンスを生成
    const laundryStatus = createLaundryStatus(wxdata, 12)
    const atmosStatus = createAtmosStatus(wxdata, 12)
    const hairStatus = createHairMessage(wxdata, 12)

    const response = {
      temperature: {
        max_temp: maxTemp,
        min_temp: minTemp,
        current_temp: currentSrf.temp,
        wheather: exchangeWheatherCode(currentSrf.wx),
        icon_url: getWeatherIconUrl(currentSrf.wx)
      },
      feel_temperature: {
        temp: currentSrf.feeltmp,
        message: createFeelTempMessage(currentSrf.feelidx),
        status: currentSrf.feelidx
      },
      humidity: {
        current_h: currentSrf.rhum,
        message: createMessageFromHumidity(wxdata, 12)
      },
      wind: {
        current_w: currentSrf.wndspd,
        message: createMessageFromWind(wxdata, 12),
        direction: exchangeWindDirection(currentSrf.wnddir)
      },
      rain: {
        current_r: currentSrf.prec,
        message: createMessageFromCurrentRain(currentSrf.prec)
      },
      laundry: {
        status: laundryStatus.status,
        message: laundryStatus.message
      },
      atomos: {
        current_a: atmosStatus.current_a,
        status: atmosStatus.status,
        message: atmosStatus.message
      },
      hair: {
        message: hairStatus.message
      }
    }

    return c.json(response, 200)
  } catch (error) {
    return c.json({
      message: '天気情報の取得に失敗しました。',
      error_details: 'ウェザーニュースAPIの取得で失敗しました。'
    }, 400)
  }
}