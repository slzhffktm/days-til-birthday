import admin from '../firebase-connect'
import * as status from '../../config/http-status'

const db = admin.database()

// Adds message to database
export function addMessage(user_id: string, message: string) {
    let ref: any = db.ref('users/' + user_id + '/messages/')

    ref.push(message)
}
