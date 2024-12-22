        const express = require('express');
	const app = express();
	const axios = require('axios');
	const login = require("./hady-zen/alya-fca");
	const { warna, font, logo } = require("./hady-zen/log.js");
	const fs = require("fs");
	const path = require("path");
	const akun = fs.readFileSync('akun.txt', 'utf8');
	const { awalan, nama, admin } = require('./config.json');
        const { kuldown } = require('./hady-zen/kuldown');

console.log(warna.biru + `▄▀█ █░ █▄█ ▄▀█  █▄▀ █░█ ░█ █▀█ █░█\n█▀█ █▄ ░█░ █▀█  █░█ █▄█ ▄█ █▄█ █▄█\n`);
const proxy = {
  host: '103.179.217.242', 
  port: 8080, 
};
console.log(logo.info + "Chatbot messenger by hady and saveng.");
	if (!akun || akun.trim() === '') {
    console.log(logo.error + 'Harap masukkan cookie terlebih dahulu di akun.txt.');
    process.exit(1);
	}


login({appState: JSON.parse(fs.readFileSync('akun.txt', 'utf8'), proxy)}, (err, api) => {
		if(err) return console.log(logo.error + `terjadi kesalahan saat login: ${err}`);
	api.setOptions({listenEvents: true});
	const maskAdmin = admin.map(id => id.slice(0, 3) + '***');
	console.log(`ADMIN LIST ID: ${maskAdmin.join(', ')}`);
	console.log(logo.login + 'Mulai menerima pesan dari pengguna.');
	  
		api.listenMqtt((err, event) => {
            const body = event.body;
	    if (!body) return;
            if (body.toLowerCase() == "prefix") return api.sendMessage(`✨ Awalan ${nama} adalah: [ ${awalan} ]`, event.threadID, event.messageID);
            if (!body.startsWith(awalan) || body == " ") return console.log(logo.pesan + `${event.senderID} > ${body}`);
                const saveng = body.slice(awalan.length).trim().split(/ +/g);
                const cmd = saveng.shift().toLowerCase();
            async function hady_cmd(cmd, api, event) {
		const pipi = body?.replace(`${awalan}${cmd}`, "")?.trim().toLowerCase();
                const args = pipi?.split(' ');
                const folder = path.join(__dirname, '/perintah');

                try {
                const files = fs.readdirSync(folder);
		const adminGC = await api.getThreadInfo(event.threadID);
		const isGroupAdmin = adminGC.adminIDs.some(admin => admin.id === event.senderID) ? 1 : 0;
		const isGlobalAdmin = admin.includes(event.senderID) ? 2 : 0;
		const isUser = isGlobalAdmin || isGroupAdmin || 0;

                    for (const file of files) {
             if (file.endsWith('.js')) {
                 const anime = path.join(folder, file);
                 const { config, Alya } = require(anime);
		     
		if (config && config.peran === 2 && isUser !== 2) return api.sendMessage('❌ Anda tidak memiliki izin untuk menggunakan perintah ini.', event.threadID, event.messageID);

              if (config && config.nama === cmd && typeof Alya === 'function') {
                 console.log(logo.cmds + `Berhasil menjalankan perintah ${config.nama}.`);
	     if (kuldown(event.senderID, config.nama, config.kuldown) == 'hadi') { 
                 await Alya(api, event, args);
                 return;
                      } else {
		     api.sendMessage('⚠️ Pelan-pelan ya, jangan spam perintah!', event.threadID, event.messageID);
	              } 
                     }
                    }
		   }
                } catch (error) {
                    console.log(logo.error + 'Perintah error: ' + error.message);
                }
            }

            hady_cmd(cmd, api, event);
		
});
app.listen(3001, () => { });
});

app.get('/', (req, res) => { 
 res.sendFile(path.join(__dirname, 'hady-zen', 'hadi.html'));
});

process.on('unhandledRejection', (reason) => {
	console.log(logo.error + 'unhandled promise rejection:', reason);
});

process.on('uncaughtException', (err) => {
	console.log(logo.error + 'uncaught exception:', err);
	console.error(err.stack);
    	process.exit(1);
});
