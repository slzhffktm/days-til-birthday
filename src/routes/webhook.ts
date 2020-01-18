import express from 'express'
import request from 'request'
import {ACCESS_TOKEN, VERIFY_TOKEN} from '../config/tokens'
import {resolveMessage} from "../services/message";

const router = express.Router()

// Verifies webhook
router.get('/', function(req, res) {
    
    // Parse the query params
    let mode = req.query['hub.mode']
    let token = req.query['hub.verify_token']
    let challenge = req.query['hub.challenge']
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED')
            res.status(200).send(challenge)
        
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403)    
        }
    }
})

// Receives message
router.post('/', function(req, res) {

    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry: any) {

            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
            
            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message).catch(function (error) {
                    console.log(error)
                })
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
})

// Handles messages events
async function handleMessage(sender_psid: string, received_message: any) {
    
    let response;

    // Check if the message contains text
    if (received_message.text) {

        console.log('Received message: ' + received_message.text)
  
        // Create the payload for a basic text message
        response = await resolveMessage(sender_psid, received_message.text)
    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid: string, response: any) {

    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "messaging_type": "RESPONSE",
        "message": response
    }

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
    }, (err: any, res: any, body: any) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err)
        }
    })
}

export default router
