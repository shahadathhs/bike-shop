import express from 'express'

const PORT = 3000

const app = express()
app.disable('x-powered-by')

console.log('Starting development server')
const viteDevServer = await import('vite').then(vite =>
  vite.createServer({
    server: { middlewareMode: true },
  }),
)
app.use(viteDevServer.middlewares)
app.use(async (req, res, next) => {
  try {
    const source = await viteDevServer.ssrLoadModule('./server/app.ts')
    return await source.default(req, res, next)
  } catch (error) {
    if (typeof error === 'object' && error instanceof Error) {
      viteDevServer.ssrFixStacktrace(error)
    }
    next(error)
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
