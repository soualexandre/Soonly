import { config } from 'dotenv'
config()

import { buildApp } from '../app' 

const PORT = Number(process.env.PORT) || 3000

const app = buildApp()

app.listen({ port: PORT, host: '0.0.0.0' }) 
  .then(async () => {
    await app.ready()
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })
