import { RouteHandler } from "@hono/zod-openapi";
import { searchRoute } from "./route";
import { Bindings } from ".";
import type { FeatureCollection, Feature, Point } from 'geojson'

export const searchHandler : RouteHandler<typeof searchRoute , { Bindings: Bindings }> = async (c) => {
  const { place } = c.req.valid('query');
  const mapboxApiKey = c.env.MAPBOX_API_KEY;

  if (!mapboxApiKey) {
    return c.json({
      message : '検索に失敗しました。',
      error_details : 'MAPBOX_API_KEYが設定されていません。'
    } , 400)
  }

  try {
    const res = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${place}&language=ja&access_token=${mapboxApiKey}`)
    const data : FeatureCollection<Point>= await res.json()
    const places = data.features.map(f => ({
      name : f.properties?.full_address ?? '' ,
      lat : f.geometry.coordinates[1],
      lon : f.geometry.coordinates[0]
    }))
    return c.json({
      places , 
      is_empty : places.length === 0
    } , 200)
  } catch (error) {
    return c.json({
      message : '検索に失敗しました。',
      error_details : "MAPBOXAPIの取得で失敗しました。"
    } , 400)
  }
  return c.json({ places : [] , is_empty : true } , 200)
}