import admin from '../firebase-connect'
import * as status from '../../config/http-status'

const db = admin.database()

// Gets user stage
export function getStage(user_id: string) {
    let ref: any = db.ref('users/' + user_id + '/stage/')

    return ref.once('value').then(function (snapshot: any) {
        return snapshot.val()
    }, function (error: any) {
        console.error(error)
        return status.INTERNAL_SERVER_ERROR
    })
}

// Updates user stage
export function updateStage(user_id: string, new_stage: number) {
    let ref: any = db.ref('users/' + user_id + '/stage/')

    ref.set(new_stage)
}

// Sets user's birth date
export function setBirthDate(user_id: string, birth_date: string) {
    let ref: any = db.ref('users/' + user_id + '/birth_date/')

    ref.set(birth_date)
}

// Gets user's birth date
export function getBirthDate(user_id: string) {
    let ref: any = db.ref('users/' + user_id + '/birth_date/')

    return ref.once('value').then(function (snapshot: any) {
        return snapshot.val()
    }, function (error: any) {
        console.error(error)
        return status.INTERNAL_SERVER_ERROR
    })
}
