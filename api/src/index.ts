import { Hono } from 'hono'

// envの型定義
type Bindings = {
  WHATHER_NEWS_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()


app.get('/api/wheather', (c) => {
  
})

export default app
