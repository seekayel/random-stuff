const jose = require('jose')

describe('suite 1', () => {
  test('gen keys', async () => {

    // const { publicKey, privateKey } = await jose.generateKeyPair('PS256')
    const { publicKey, privateKey } = await jose.generateKeyPair('RS256')

    console.log(publicKey)
    console.log(privateKey)

    // const privatePem = await jose.exportPKCS8(privateKey)
    // const publicPem = await jose.exportSPKI(publicKey)

    // const privateJwk = await jose.exportJWK(privateKey)
    // const publicJwk = await jose.exportJWK(publicKey)

    const [publicPem, privatePem, publicJWK, privateJWK] = await Promise.all([
      jose.exportSPKI(publicKey),
      jose.exportPKCS8(privateKey),
      jose.exportJWK(publicKey),
      jose.exportJWK(privateKey)
    ])


    console.log(privatePem)
    console.log(publicPem)

    console.log(privateJWK)
    console.log(publicJWK)

    expect(true).toBe(true)
  })
})
