import { promises as dns } from 'node:dns'

export default async name => {
  if (!/^(?!-)[A-Za-z0-9_-]{1,63}(?<!-)\.(?:[A-Za-z0-9_-]{1,63}(?<!-)\.)*[A-Za-z]{2,63}$/.test(name)) {
    return false
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const httpsMethod = await fetch(`https://${name}/.well-known/telweb`, {
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (httpsMethod.status === 200) {
      try {
        const data = await httpsMethod.json()
        if (data && typeof data === 'object') {
          return data
        }
      } catch { }
    }
  } catch { }

  const dnsMethod = await dns.resolveTxt(`_telweb.${name}`).catch(() => null)

  if (dnsMethod) {
    const formattedRecords = dnsMethod.map(chunks => chunks.join(''))
    const txtRecord = formattedRecords.find(record => record.startsWith('tel:'))

    if (txtRecord) {
      const phoneNumber = txtRecord.slice(4)

      if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
        return false
      }

      return { '@context': 'https://scrollr.net', phone: phoneNumber }
    }
  }

  return false
}