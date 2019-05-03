"use strict";
const util = require("./util");
const { webRequest } = require("./webrequest");

class dliveMod {
    constructor (authKey, channel, blockchain) {
        this.authKey = authKey;
        this.channel = channel;
        if (blockchain) {
            this.blockchain = blockchain;
        }
    }

    deleteMessage (messageID, streamer = this.blockchain) {
        return new Promise(async (resolve, reject) => {
            if (!messageID) {
                reject(new TypeError("Message ID was not specified"));
            } else if (!streamer && !this.blockchain) {
                reject(new TypeError("Streamer was not provided"));
            } else if (!this.blockchain) {
                streamer = await util.channelToBlockchain(streamer);
            }
            const postData = util.generatePostData("DeleteChat",
                {
                    streamer: streamer,
                    id: messageID
                });
            webRequest(postData, this.authKey).then((result) => {
                result.errors !== undefined ? reject(new Error(result.errors["0"].message)) : resolve(true);
            });
        });
    }

    getModerators (displayName = this.channel, amountToShow = 10, search = "") {
        return new Promise((resolve, reject) => {
            if (!displayName && this.channel) {
                reject(new TypeError("Streamer was not provided"));
            }
            const postData = util.generatePostData("StreamChatModerators",
                {
                    displayname: displayName,
                    first: amountToShow,
                    search: search
                });
            webRequest(this.authKey, postData).then((result) => {
                console.log(result.data.userByDisplayName.chatModerators);
                result.errors !== undefined
                    ? reject(new Error(result.errors["0"].message))
                    : resolve(result.data.userByDisplayName.chatModerators.list);
            });
        });
    }

    getBannedUsers (displayName = this.channel, amountToShow = 10, search = "") {
        return new Promise((resolve, reject) => {
            if (!displayName && this.channel) {
                reject(new TypeError("Streamer was not provided"));
            }
            const postData = util.generatePostData("StreamChatBannedUsers",
                {
                    displayname: displayName,
                    first: amountToShow,
                    search: search
                });
            webRequest(this.authKey, postData).then((result) => {
                console.log(result.data.userByDisplayName.chatModerators);
                result.errors !== undefined
                    ? reject(new Error(result.errors["0"].message))
                    : resolve(result.data.userByDisplayName.chatModerators.list);
            });
        });
    }

    banUser (username, streamer = this.blockchain) {
        return new Promise((resolve, reject) => {
            this.processBan("BanStreamChatUser", username, streamer).then((result) => {
                resolve(result);
            }).catch(reject);
        });
    }

    unbanUser (username, streamer = this.blockchain) {
        return new Promise((resolve, reject) => {
            this.processBan("UnbanStreamChatUser", username, streamer).then((result) => {
                resolve(result);
            }).catch(reject);
        });
    }

    processBan (type, username, streamer) {
        return new Promise(async (resolve, reject) => {
            if (!this.authKey) {
                reject(new TypeError("Acess token was not provided"));
            }
            if (!username) {
                reject(new TypeError("Username was not provided"));
            } else if (!streamer && !this.blockchain) {
                reject(new TypeError("Streamer was not provided"));
            } else if (!this.blockchain) {
                streamer = await util.channelToBlockchain(streamer);
            }
            if (streamer instanceof Error) {
                reject(new TypeError("Invalid streamer"));
            }
            const postData = util.generatePostData(type,
                {
                    streamer: streamer,
                    username: username
                });
            webRequest(this.authKey, postData).then((result) => {
                result.errors !== undefined
                    ? reject(new Error(result.errors["0"].message))
                    : result.data[type].err !== null
                    ? reject(result.data[type].err)
                    : resolve(true);
            }).catch(reject);
        });
    }
}

module.exports = {
    dliveMod: dliveMod
};