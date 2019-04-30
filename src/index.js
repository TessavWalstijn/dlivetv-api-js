'use strict'

const {
  dliveInit
} = require('./dliveInit')

class Dliver extends dliveInit {
  // eslint-disable-next-line no-useless-constructor
  constructor (channel, authKey) {
    super(channel, authKey)
  }
  followChannel (channel = this.blockChainUsername) {
    return new Promise((resolve, reject) => {
      if (!channel) {
        reject(new TypeError('You need to initalize or specify a channel'))
      } else if (channel !== this.blockChainUsername) {
        channel = this.channelNameToBlockchain(channel)
        if (channel) {
          this.followUserChannel(channel).then((result) => {
            resolve(result)
          }).catch(reject)
        } else {
          reject(new TypeError('Channel was not found'))
        }
      } else {
        this.followUserChannel(channel).then(result => {
          resolve(result)
        }).catch(reject)
      }
    })
  }

  unfollowChannel (channel = this.getBlockChainUsername) {
    return new Promise((resolve, reject) => {
      if (!channel) {
        reject(new TypeError('You need to initalize or specify a channel'))
      } else if (channel !== this.blockChainUsername) {
        channel = this.channelNameToBlockchain(channel)
        if (channel) {
          this.unfollowUserChannel(channel).then((result) => {
            resolve(result)
          }).catch(reject)
        } else {
          reject(new TypeError('Channel was not found'))
        }
      } else {
        this.unfollowUserChannel(channel).then(result => {
          resolve(result)
        }).catch(reject)
      }
    })
  }
  sendMessage (message) {
    return new Promise((resolve, reject) => {
      if (!this.getChannel) {
        reject(new Error('You need to initalize a channel first'))
      }
      this.sendChatMessage(message).then((result) => {
        resolve(result)
      }).catch(reject)
    })
  }
  sendMessageToChannel (channel = this.getBlockChainUsername, message) {
    return new Promise((resolve, reject) => {
      if (!channel) {
        reject(new TypeError('You need to initalize or specify a channel'))
      } else if (channel !== this.getBlockChainUsername) {
        channel = this.channelNameToBlockchain(channel)
        if (channel) {
          this.sendMessageToChannelChat(channel, message).then((result) => {
            resolve(result)
          }).catch(reject)
        } else {
          reject(new TypeError('Channel was not found'))
        }
      }
    })
  }

  getChannelInformation (displayName = this.getChannel) {
    return new Promise((resolve, reject) => {
      if (!displayName) {
        reject(new TypeError('You need to initalize or specify a channel'))
      }
      this.getChannelInformationByDisplayName(displayName).then((result) => {
        resolve(result)
      }).catch(reject)
    })
  }

  getChannelTopContributors (displayName = this.getChannel, amountToShow = 5, rule = 'THIS_STREAM') {
    return new Promise((resolve, reject) => {
      if (!displayName) {
        reject(new TypeError('You need to initalize or specify a channel'))
      }
      this.getChannelTopContributorsByDisplayName(displayName, amountToShow, rule).then((result) => {
        resolve(result)
      }).catch(reject)
    })
  }

  getGlobalInformation () {
    return new Promise((resolve, reject) => {
      if (!this.authkey) {
        return new Error('You need to initalize a authorization API token')
      }
      this.getDliveGlobalInformation().then((result) => {
        resolve(result)
      }).catch(reject)
    })
  }

  getChannelViewers (displayName = this.getChannel) {
    return new Promise((resolve, reject) => {
      if (!displayName) {
        reject(new TypeError('You need to initalize or specify a channel'))
      }
      this.getChannelViewersByDisplayName(displayName).then((result) => {
        resolve(result)
      }).catch(reject)
    })
  }

  getChannelFollowers (displayName = this.getChannel, limit = 20) {
    return new Promise((resolve, reject) => {
      if (!displayName) {
        reject(new TypeError('You need to initalize or specify a channel'))
      }
      this.getChannelFollowersByDisplayName(displayName, limit).then((result) => {
        resolve(result)
      }).catch(reject)
    })
  }
}

module.exports = {
  Dlive: Dliver
}
