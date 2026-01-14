import { OpenAPIHono } from '@hono/zod-openapi'
import { searchHandler } from './handler'
import { searchRoute } from './route'

// envの型定義
export type Bindings = {
  WHATHER_NEWS_API_KEY: string
  MAPBOX_API_KEY : string
}

const app = new OpenAPIHono<{ Bindings: Bindings }>()

app.doc('/docs' , {
  openapi : '3.0.0',
  info : {
    title : 'Weather News API',
    description : 'Weather News API',
    version : '1.0.0'
  }
})

app.openapi(searchRoute , searchHandler)
export default app