const express = require('express')
const app = express()

const Ably = require('ably')
const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY })

const { v4: uuidv4 } = require('uuid')

app.get('/', (req, res) => res.send('OK'))

app.get('/auth', (req, res) => {
  const tokenParams = { clientId: uuidv4() }
  ably.auth.createTokenRequest(tokenParams, (err, tokenRequest) => {
    if (err) {
      return res
        .status(500)
        .send('Error requesting token: ' + JSON.stringify(err))
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send(JSON.stringify(tokenRequest))
  })
})

module.exports = app
