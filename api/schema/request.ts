import { z } from "@hono/zod-openapi" 

export const ParamSchema = z.object({
    lat : z.number()
        .min(-90)
        .max(90)
        .openapi({
          param : {
            name : 'lat',
            in : 'query',
            description : '経度',
            example : '35.136',
            required : true
          },
          description : 'ターゲットの経度。必須のパラメーター'
        }),
    lon : z.number()
        .min(-180)
        .max(180)
        .openapi({
          param : {
            name : 'lon',
            in : 'query',
            description : '緯度',
            example : '139.763',
            required : true
          },
          description : 'ターゲットの緯度。必須のパラメーター'
        })
  })