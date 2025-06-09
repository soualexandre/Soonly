export default defineEventHandler((event) => {
  if (event.req.url?.startsWith('/.well-known/')) {
    return new Response('', { status: 204 }) 
  }
})
