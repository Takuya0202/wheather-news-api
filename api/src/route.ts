import { createRoute } from "@hono/zod-openapi";
import { SearchParamSchema, WheatherParamSchema } from "../schema/request";
import { ErrorResponseSchema, SearchResponseSchema, WeatherResponseSchema } from "../schema/response";

// 天気の場所検索API
export const searchRoute = createRoute({
  path: '/search',
  method: 'get',
  request: {
    query: SearchParamSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SearchResponseSchema
        }
      },
      description: '天気の場所検索API'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      },
      description: "エラーが発生した場合"
    }
  }
})

export const wheatherRoute = createRoute({
  path: '/wheather',
  method: 'get',
  request: {
    query: WheatherParamSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: WeatherResponseSchema
        }
      },
      description: "天気情報API"
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema
        }
      },
      description: "エラーが発生した場合"
    }
  }
})