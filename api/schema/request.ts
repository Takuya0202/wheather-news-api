import { z } from "@hono/zod-openapi"

export const WheatherParamSchema = z.object({
  lat: z.coerce.number()
    .min(-90)
    .max(90)
    .openapi({
      param: {
        name: 'lat',
        in: 'query',
        description: '緯度',
        example: '35.136',
        required: true
      },
      description: 'ターゲットの緯度。必須のパラメーター'
    }),
  lon: z.coerce.number()
    .min(-180)
    .max(180)
    .openapi({
      param: {
        name: 'lon',
        in: 'query',
        description: '経度',
        example: '139.763',
        required: true
      },
      description: 'ターゲットの経度。必須のパラメーター'
    }),
})

export const SearchParamSchema = z.object({
  place: z.string()
    .openapi({
      param: {
        name: 'place',
        in: 'query',
        description: '検索する場所',
        example: '名古屋市',
        required: true
      },
      description: '検索する場所。必須項目'
    })
})