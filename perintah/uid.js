module.exports = {
  config: { nama: "uid" }, 
  Alya: async function(api, event) {
    api.sendMessage(event.senderID, event.threadID, event.messageID)
  }
};