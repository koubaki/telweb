export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (url.pathname === '/ns') {
      const response = await env.ASSETS.fetch(request)

      return new Response(response.body, {
        ...response,
        headers: {
          ...Object.fromEntries(response.headers),
          'Content-Type': 'application/ld+json',
        },
      })
    }

    return await env.ASSETS.fetch(request)
  },
}
