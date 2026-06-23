export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers') || 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      })
    }

    const response = await env.ASSETS.fetch(request)
    
    if (response.ok) {
      const bodyText = await response.text()

      const newResponse = new Response(bodyText, response)
      newResponse.headers.set('Access-Control-Allow-Origin', '*')
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')

      newResponse.headers.delete('Content-Encoding')

      return newResponse
    }

    return response
  }
}