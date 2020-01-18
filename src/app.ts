import express from 'express'
import bodyParser from 'body-parser'

import webhookRouter from './routes/webhook'
import messageRouter from './routes/message'

const app = express() // creates express http server
const port = process.env.PORT || 3000

app.use(bodyParser.json())

// routes
app.use('/webhook', webhookRouter)
app.use('/messages', messageRouter)

// run server
app.listen(port, () => console.log('Webhook is listening on port ' + port))
