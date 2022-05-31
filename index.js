const express = require('express')
const app = express()
const path = require('path')


const jose = require('jose')
const {v4: uuid} = require('uuid')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
const options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html', 'css', 'js', 'ico', 'jpg', 'jpeg', 'png', 'svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false
}
app.use(express.static('public', options))

app.get('/key/:algo?', async (req,res) => {
  const alg = 'RS256' //'PS256'
  const { publicKey, privateKey } = await jose.generateKeyPair(alg, {extractable: true})
  // console.log(JSON.stringify(publicKey,null,2))
  // console.log(JSON.stringify(privateKey,null,2))

  const [publicPem, privatePem, publicJWK, privateJWK] = await Promise.all([
    jose.exportSPKI(publicKey),
    jose.exportPKCS8(privateKey),
    jose.exportJWK(publicKey),
    jose.exportJWK(privateKey)
  ])

  res.json({
    public: {
      pem: publicPem,
      jwk: {
        ...publicJWK,
        alg
      }
    },
    private: {
      pem: privatePem,
      jwk: {
        ...privateJWK,
        alg
      }
    },
  })
})

app.get('/characters', async (req,res) => {
  const value = Math.random().toString(26).slice(2)
  res.json({type: 'characters', value})
})

app.get('/uuid', async (req,res) => {
  res.json({type: 'uuidv4', value: uuid()})
})

// Catch all handler for all other request.
app.use('*', (req, res) => {
  if (req.headers['content-type'] === 'application/json') {
    res.json({ msg: 'no route handler found', path: req.path, method: req.method }).end()
  } else {
    res.sendFile(path.resolve('public/index.html'))
  }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
