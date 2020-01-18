import admin from '../firebase-connect'
import * as status from '../../config/http-status'

const db = admin.database()

// Adds message to database
export function addMessage(user_id: string, message: string) {
    let ref: any = db.ref('users/' + user_id + '/messages/')

    ref.push(message)
}

// Gets message of a user by user id and message id
export function getUserMessageById(user_id: string, message_id: string) {
    let ref: any = db.ref('users/' + user_id + '/messages/' + message_id)

    return ref.once('value').then(function (snapshot: any) {
        return snapshot.val()
    }, function (error: any) {
        console.error(error)
        return status.INTERNAL_SERVER_ERROR
    })
}

// Gets all messages with its user
export function getAllMessages() {
    let ref: any = db.ref('users/')

    return ref.once('value').then(function (snapshot: any) {
        return snapshot.val()
    }, function (error: any) {
        console.error(error)
        return status.INTERNAL_SERVER_ERROR
    })
}

// Delete one message of a user by user id and message id
export function deleteUserMessageById(user_id: string, message_id: string) {
    let ref: any = db.ref('users/' + user_id + '/messages/' + message_id)

    ref.remove()
        .then(function () {
            return status.OK
        })
        .catch(function (error: any) {
            console.error(error)
            return error
        })
}
