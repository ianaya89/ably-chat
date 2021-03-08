const express = require('express')
const app = express()

const Ably = require('ably')
const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY })

function getClientId() {
  return 'id-' + Math.random().toString(36).substr(2, 16)
}

app.get('/', (req, res) => res.send('OK'))

app.get('/auth', (req, res) => {
  const tokenParams = { clientId: getClientId() }
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

const listener = app.listen(process.env.PORT || 3001, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

module.exports = app
