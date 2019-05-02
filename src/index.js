'use strict'
const util = require('./util')
const { dlive } = require('./dlive')
const { dliveUtil } = require('./dliveUtil')
const STREAM_RULES = ['THIS_STREAM', 'THIS_MONTH', 'ALL_TIME']
class Dliver extends dlive {
  constructor (channel, authKey) {
    super()
    this.init(channel, authKey)
    this.util = new dliveUtil(authKey)
  }

  async init (channel, authKey) {
    let _this = this
    _this.setAuthkey = authKey
    let blockchain = await util.channelToBlockchain(authKey, channel)
    if (blockchain instanceof Error) {
      return console.log(new Error('Invalid API KEY or CHANNEL'))
    } else {
      this.setBlockChainUsername = blockchain
    }
    _this.setChannel = channel
    _this.client.on('connectFailed', function (error) {
      return new Error(`Connect error: ${error.toString()}`)
    })

    _this.client.on('connect', async function (connection) {
      console.log(`Joined ${_this.getChannel}`)
      connection.sendUTF(
        JSON.stringify({
          type: 'connection_init',
          payload: {}
        })
      )
      await connection.sendUTF(
        JSON.stringify({
          id: '1',
          type: 'start',
          payload: {
            variables: {
              streamer: _this.blockChainUsername
            },
            extensions: {},
            operationName: 'StreamMessageSubscription',
            query: 'subscription StreamMessageSubscription($streamer: String!) {\n  streamMessageReceived(streamer: $streamer) {\n    type\n    ... on ChatGift {\n      id\n      gift\n      amount\n      recentCount\n      expireDuration\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatHost {\n      id\n      viewer\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatSubscription {\n      id\n      month\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatChangeMode {\n      mode\n    }\n    ... on ChatText {\n      id\n      content\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatFollow {\n      id\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatDelete {\n      ids\n    }\n    ... on ChatBan {\n      id\n      ...VStreamChatSenderInfoFrag\n    }\n    ... on ChatModerator {\n      id\n      ...VStreamChatSenderInfoFrag\n      add\n    }\n    ... on ChatEmoteAdd {\n      id\n      ...VStreamChatSenderInfoFrag\n      emote\n    }\n  }\n}\n\nfragment VStreamChatSenderInfoFrag on SenderInfo {\n  subscribing\n  role\n  roomRole\n  sender {\n    id\n    username\n    displayname\n    avatar\n    partnerStatus\n  }\n}\n'
          }
        })
      )

      connection.on('error', function (error) {
        return new Error(`Connection error: ${error.toString()}`)
      })
      connection.on('close', function () {
        return new Error('Connection closed')
      })
      connection.on('message', function (message) {
        if (message && message.type === 'utf8') {
          message = JSON.parse(message.utf8Data)
          if (message.payload !== undefined) {
            let remMessage = message.payload.data.streamMessageReceived['0']
            _this.emit(remMessage.__typename, remMessage)
          }
        }
      })
    })
    _this.client.connect('wss://graphigostream.prd.dlive.tv', 'graphql-ws')
  }

  followUserChannel (channel = this.getBlockChainUsername) {
    return new Promise(async (resolve, reject) => {
      if (!channel) {
        reject(new TypeError('You need to initalize or specify a channel'))
      } else if (channel !== this.getBlockChainUsername) {
        channel = await util.channelToBlockchain(this.getAuthkey, channel)
        if (!(channel instanceof Error)) {
          util.followChannel(this.getAuthkey, channel).then(res => {
            resolve(res)
          }).catch(reject)
        } else {
          reject(channel)
        }
      } else {
        util.followChannel(this.getAuthkey, channel).then(res => {
          resolve(res)
        }).catch(reject)
      }
    })
  }

  unfollowUserChannel (channel = this.getBlockChainUsername) {
    return new Promise(async (resolve, reject) => {
      if (!channel) {
        reject(new TypeError('You need to initalize or specify a channel'))
      } else if (channel !== this.getBlockChainUsername) {
        channel = await util.channelToBlockchain(this.getAuthkey, channel)
        if (!(channel instanceof Error)) {
          util.unfollowChannel(this.getAuthkey, channel).then(res => {
            resolve(res)
          }).catch(reject)
        } else {
          reject(channel)
        }
      } else {
        util.unfollowChannel(this.getAuthkey, channel).then(res => {
          resolve(res)
        }).catch(reject)
      }
    })
  }

  sendMessage (msg) {
    return new Promise((resolve, reject) => {
      if (!this.getBlockChainUsername) {
        reject(new TypeError('You need to initalize a channel'))
      }
      util.sendChatMessage(this.getAuthkey, this.getBlockChainUsername, msg).then(res => {
        resolve(res)
      }).catch(reject)
    })
  }

  sendMessageToChannel (msg, channel = this.getBlockChainUsername) {
    return new Promise((resolve, reject) => {
      if (!channel) {
        reject(new TypeError('You need to initalize or specify a channel'))
      }

      util.sendChatMessage(this.getAuthkey, channel, msg).then(res => {
        resolve(res)
      }).catch(reject)
    })
  }

  getChannelInformation (displayName = this.getChannel) {
    return new Promise((resolve, reject) => {
      if (!displayName) {
        reject(new TypeError('You need to initalize or specify a channel'))
      }
      util.getChannelInformation(this.getAuthkey, displayName).then(res => {
        resolve(res)
      }).catch(reject)
    })
  }

  getChannelTopContributors (displayName = this.getChannel, amountToShow = 5, rule = 'THIS_STREAM') {
    return new Promise((resolve, reject) => {
      if (!displayName) {
        reject(new TypeError('You need to initalize or specify a channel'))
      }
      if (!STREAM_RULES.includes(rule)) {
        rule = 'THIS_STREAM'
        console.log('Invalid Stream rule, Using default rule: THIS_STREAM')
      }
      util.getTopContributors(this.getAuthkey, displayName, amountToShow, rule).then((result) => {
        resolve(result)
      }).catch(reject)
    })
  }

  getChannelViewers (displayName = this.getChannel) {
    return new Promise((resolve, reject) => {
      if (!displayName) {
        reject(new TypeError('You need to initalize or specify a channel'))
      }
      util.getChannelViewers(this.getAuthkey, displayName).then((result) => {
        resolve(result)
      }).catch(reject)
    })
  }

  getChannelFollowers (displayName = this.getChannel, limit = 20) {
    return new Promise((resolve, reject) => {
      if (!displayName) {
        reject(new TypeError('You need to initalize or specify a channel'))
      }
      util.getChannelFollowers(this.getAuthkey, displayName, limit).then((result) => {
        resolve(result)
      }).catch(reject)
    })
  }

  getChannelReplays (displayName = this.getChannel, limit = 5) {
    return new Promise((resolve, reject) => {
      if (!displayName) {
        reject(new TypeError('You need to initalize or specify a channel'))
      }
      util.getChannelReplays(this.getAuthkey, displayName, limit).then((result) => {
        resolve(result)
      }).catch(reject)
    })
  }

  getChannelWallet (displayName = this.getChannel, limit = 5) {
    return new Promise((resolve, reject) => {
      if (!displayName) {
        reject(new TypeError('You need to initalize or specify a channel'))
      }
      util.getChannelWallet(this.getAuthkey, displayName, limit).then((result) => {
        resolve(result)
      }).catch(reject)
    })
  }
}

module.exports = {
  Dlive: Dliver,
  DliveUtil: dliveUtil
}
