import { OpenAPIHono } from '@hono/zod-openapi'
import { searchHandler, wheatherHandler } from './handler'
import { searchRoute, wheatherRoute } from './route'
import { swaggerUI } from '@hono/swagger-ui'

// envの型定義
export type Bindings = {
  WHATHER_NEWS_API_KEY: string
  MAPBOX_API_KEY: string
}

const app = new OpenAPIHono<{ Bindings: Bindings }>().basePath('/api')

app.doc('/docs', {
  openapi: '3.0.0',
  info: {
    title: 'Weather News API',
    description: 'Weather News API',
    version: '1.0.0'
  }
})

app.get('/ui', swaggerUI({ url: '/api/docs' }))
app.openapi(searchRoute, searchHandler)
app.openapi(wheatherRoute, wheatherHandler)

export default app