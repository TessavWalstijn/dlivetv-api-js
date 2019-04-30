
<p align="center">
    <a href="#"><img src="https://i.imgur.com/XXdD3AH.png" /></a>
    <br />
    <br />
    <a href="https://discord.gg/hRWra7r"><img alt="Discord" src="https://img.shields.io/discord/567034368002883594.svg?label=Discord&style=for-the-badge"></a>
    <a href="https://github.com/timedotcc/dlivetv-unofficial-api/blob/master/LICENSE"><img alt="GitHub" src="https://img.shields.io/badge/License-Modified%20MIT-green.svg?style=for-the-badge"></a>
    <a href="https://nodei.co/npm/dlivetv-unofficial-api/"><img alt="npm" src="https://img.shields.io/npm/v/dlivetv-unofficial-api.svg?style=for-the-badge"></a>
    <a href="https://beerpay.io/timedotcc/dlivetv-unofficial-api"><img alt="Beerpay" src="https://img.shields.io/beerpay/timedotcc/dlivetv-unofficial-api.svg?label=Donate&style=for-the-badge"></a>
	<a href="#"><img alt="Travis" src="https://img.shields.io/travis/com/timedotcc/dlivetv-unofficial-api.svg?style=for-the-badge"</a>
    <br />
    <br />
    <a href="https://nodei.co/npm/dlivetv-unofficial-api/"><img src="https://nodei.co/npm/dlivetv-unofficial-api.png?mini=true"></a>
</p>

## Example
```js
const  { Dlive } = require('dlivetv-unofficial-api')

const displayName = 'displayName' // Our streamer displayname (https://dlive.tv/displayName)
const accessKey = 'YOUR KEY' // Our access key (https://github.com/unofficial-dlive-tv-api/dlivetv-unofficial-api-js/wiki/Get-my-access-key)

// Chat cooldown
const coolDown = 3000 // 3 seconds

// Parameter 1: displayName
// Parameter 2: Your access key for sending messages
let example = new Dlive(displayName, accessKey)

example.on('ChatText', (message) => {
  console.log(`Messages in Channel ${example.getChannel}: ${message.content}`)

  if (message.content === '!song') {
    example.sendMessage('Currently no track available...').then((result) => {
      console.log('Message sended!')
      console.log(result)
    }).catch((error) => {
      console.log(`Error while sending message! ${error}`)
      // Now we can use our function to try to resend, at this point you would directly use our own function. Please do not use this example in productive use, because it is ...
      sendMessage('Currently no track available...')
    })
  }
})

example.on('ChatFollow', (message) => {
  // Say thanks to this user for his follow!
  sendMessage(`Thanks for the follow, @${message.sender.displayname}`)
})

example.on('ChatGift', (message) => {
  // Say thanks to this user for his gift!
  sendMessage(`Thanks for ${message.amount}x ${message.gift}, @${message.sender.displayname}`)
})

// Get our channel informations
example.getChannelInformationByDisplayName('pewdiepie' /* enter a displayname */).then((result) => {
  console.log(result)
}).catch((error) => {
  console.log(error)
})

function sendMessage (message) {
  example.sendMessage(message).catch((error) => {
    console.log(`Oh no.. error! ${error} - Retry in ${coolDown / 1000} seconds!`)
    setTimeout(sendMessage, coolDown, message)
  })
}
```
	 
More [examples](https://github.com/timedotcc/dlivetv-unofficial-api/wiki/Examples) and [functions](https://github.com/timedotcc/dlivetv-unofficial-api/wiki/Functions) can you find in our [wiki](https://github.com/timedotcc/dlivetv-unofficial-api/wiki).
