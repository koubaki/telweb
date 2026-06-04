export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (url.pathname === '/ns') {
      const response = await env.ASSETS.fetch(request)
      const newHeaders = new Headers(response.headers)
      newHeaders.set('Content-Type', 'application/ld+json')

      return new Response(await response.text(), {
        status: response.status,
        headers: newHeaders,
      })
    }

    return env.ASSETS.fetch(request)
  },
}