import express from 'express'
import {deleteUserMessageById, getAllMessages, getUserMessageById} from "../services/message";

const router = express.Router()

// Gets all messages
router.get('/', function(req, res) {

    getAllMessages().then(function (messages) {
        res.status(200).send(messages)
    }, function (error) {
        res.status(500).send(error)
    })
})

// Gets one message by user id and message id
router.get('/:user_id/:message_id', function(req, res) {

    getUserMessageById(req.params['user_id'], req.params['message_id']).then(function (message) {
        if (message) {
            res.status(200).send(message)
        } else {
            res.sendStatus(404)
        }
    }, function (error) {
        res.status(500).send(error)
    })
})

// Delete one message by user id and message id
router.delete('/:user_id/:message_id', function(req, res) {

    deleteUserMessageById(req.params['user_id'], req.params['message_id']).then(function () {
        res.status(200).send()
    }, function () {
        res.sendStatus(404)
    })
})

export default router
