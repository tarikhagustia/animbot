const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const axios = require('axios')

// To Parsing a Json
app.use(bodyParser.json())

app.post('/', (req, res) => {
    // Read incoming message from webhook
    const msg = req.body.message

    // if message come with following format ' !anime naruto ', then reply with list of anime with name naruto
    if(msg.startsWith('!anime')) {

        // Get anime name
        const animeName = msg.split(' ')[1]
        
        // Request to API
        axios.get(`https://api.jikan.moe/v3/search/anime?q=${animeName}&limit=5`)
        .then(response => {
           
            let reply = ""
            /**
             * We will reply this message wil following format
             * Anime : Naruto
             * Score : 9.0
             * Members : 1000
             * -------------------------------
             */
            response.data.results.forEach((item, key) => {
                reply += `Anime: ${item.title}\n`
                reply += `Score: ${item.score}\n`
                reply += `Members: ${item.members}\n`
                reply += `-----------------------------------\n`
            })

            // Fire response to JSON
            res.send({
                type: 'chat',
                body: reply,
                simulation: true
            })

        }).catch(error => {

            // Send error response
            res.send({
                type: 'chat',
                body: "Error when fetching from API"
            })
        })
    }
    else if(msg.startsWith('Invoice Confirmation')) {
        const invoice = msg.split(' ')[2]
        reply = `*JAWAB OTOMATIS*\nHi, Terimakasih telah melakukan Konfirmasi untuk pembayaran dengan nomor invoice *${invoice}*. Kami akan memperosesnya segera dalam 10 menit.!\nPastikan anda melakukan pembayaran sesuai nominal pada invoice :)`
        // 
        res.send({
            type: 'chat',
            body: reply,
            simulation: true
        })
    }else if(msg.startsWith('help')) {
        let reply = ""
        reply += `Hi, Selamat datang dilayanan chatbot, kami menyediakan layanan bot diantaranya:\n`
        reply += `- !anime nama anime : Untuk mencari list anime dan ratingnya\n`
        res.send({
            type: 'chat',
            body: reply,
            simulation: true
        })
    }else{
        // if not using !anime, return empty json
        let reply = ""
        reply += `Hi, This is B0T Service sorry we don't understand your message, for contacting support, please text to following number:\n`
        reply += `https://wa.me/6285159664534\n`
        res.send({
            type: 'chat',
            body: reply,
            simulation: true
        })
    }

    // Cool thats it!

    
})

app.listen(port, () => console.log(`app listening on port ${port}!`))