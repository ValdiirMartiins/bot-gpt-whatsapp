require('dotenv').config();

const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', (message) => {
    fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPEN_AI_APIKEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            prompt: message.body,
            max_tokens: 100,
            temperature: 0.5
        })
    })
    .then((response) => response.json())
    .then((json) => {
        client.sendMessage(message.from, json.choices[0].text);
    })
    .catch((error) => console.error("Error:", error));
});

client.initialize();