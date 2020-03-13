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
                body: reply
            })

        }).catch(error => {

            // Send error response
            res.send({
                type: 'chat',
                body: "Error when fetching from API"
            })
        })
    }else{
        // if not using !anime, return empty json
        res.send({})
    }

    // Cool thats it!

    
})

app.listen(port, () => console.log(`app listening on port ${port}!`))