import { createRoute } from "@hono/zod-openapi";
import { SearchParamSchema } from "../schema/request";
import { ErrorResponseSchema, SearchResponseSchema } from "../schema/response";

// 天気の場所検索API
export const searchRoute = createRoute({
  path : '/search',
  method : 'get',
  request : {
    query : SearchParamSchema
  },
  responses : {
    200 : {
      content : {
        'application/json' : {
          schema : SearchResponseSchema
        }
      },
      description : '天気の場所検索API'
    },
    400 : {
      content : {
        'application/json' : {
          schema : ErrorResponseSchema
        }
      },
      description : "エラーが発生した場合"
    }
  }
})