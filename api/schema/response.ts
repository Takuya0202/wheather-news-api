import { z } from "@hono/zod-openapi";
export const SearchResponseSchema = z.object({
  places : z.array(z.object({
    name : z.string().openapi({
      description : '検索結果の候補地',
      example : '名古屋市緑区'
    }),
    lat : z.number().openapi({
      description : '候補地の緯度',
      example : 35.123456
    }),
    lon : z.number().openapi({
      description : '候補地の経度',
      example : 139.123456
    })
  }))
})

export const ErrorResponseSchema = z.object({
  message : z.string()
    .openapi({
      description : 'エラーメッセージ。クライアントに表示を想定',
      example : "検索に失敗しました。"
    }),
  error_details : z.string()
    .openapi({
      description : "エラーの詳細。開発者向け。",
      example : "MAPBOX_API_KEYが設定されていません。"
    })
})