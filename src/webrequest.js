'use strict'

const https = require('https')

function generateOptions (authKey) {
  let options = {
    hostname: 'graphigo.prd.dlive.tv',
    port: 443,
    path: '/',
    method: 'POST',
    headers: {
      accept: '*/*',
      authorization: authKey,
      'content-type': 'application/json',
      Origin: 'https://dlive.tv'
    }
  }
  return options
}

const webRequest = (authKey, postData) => {
  return new Promise((resolve) => {
    let options = generateOptions(authKey)
    let req = https.request(options, (res) => {
      res.setEncoding('utf-8')
      res.on('data', (chunk) => {
        resolve(chunk)
      })
    })
    req.write(postData)
    req.end()
  })
}

module.exports = {
  webRequest
}
