import express from 'express'
import bodyParser from 'body-parser'

import webhookRouter from './routes/webhook'
import {resolveMessage} from "./services/message";

const app = express() // creates express http server
const port = process.env.PORT || 3000

// resolveMessage("user1", "no").then(function (response) {
//     console.log(response)
// }, function (error) {
//     console.error(error)
// })

app.use(bodyParser.json())

// routes
app.use('/webhook', webhookRouter)

// run server
app.listen(port, () => console.log('Webhook is listening on port ' + port))
