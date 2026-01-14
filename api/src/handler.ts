import { RouteHandler } from "@hono/zod-openapi";
import { searchRoute } from "./route";
import { Bindings } from ".";

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
    const data = await res.json()
    console.log(data)
  } catch (error) {
    
  }
  return c.json({ places : [] })
}