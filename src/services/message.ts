import * as messageModel from '../db/models/message'
import * as userModel from '../db/models/user'
import * as words from '../config/words'

// gives response to received message
export async function resolveMessage(user_id: string, message: string) {

    const stage0 = { text: "Hi! What's your first name?" }
    const stage1 = { text: `Hi ${message}! When is your birth date? Please insert with format: YYYY-MM-DD` }
    const stage2_fail = { text: `Sorry, I think it is an invalid date. Could you please try again?` }
    const stage2 = {
        text: "Do you wanna know how many days left to your next birthday?",
        quick_replies: [
            {
                content_type: "text",
                title: "Yes",
                payload: "STAGE2YES"
            },
            {
                content_type: "text",
                title: "No",
                payload: "STAGE2NO"
            }
        ]
    }
    const stage3_no = { text: "Goodbye 👋" }
    const stage3_fail = {
        text: "Sorry, I don't understand you. Could you please answer with yes or no?",
        quick_replies: [
            {
                content_type: "text",
                title: "Yes",
                payload: "STAGE2YES"
            },
            {
                content_type: "text",
                title: "No",
                payload: "STAGE2NO"
            }
        ]
    }

    messageModel.addMessage(user_id, message)

    let current_stage = await userModel.getStage(user_id)

    switch (current_stage) {
        case null: // new user
            userModel.updateStage(user_id, 1)
            return stage0
        case 1:
            userModel.updateStage(user_id, 2)
            return stage1
        case 2:
            if (message.match(`^\\d{4}\\-(0[1-9]|1[012])\\-(0[1-9]|[12][0-9]|3[01])$`)) {
                userModel.setBirthDate(user_id, message)
                userModel.updateStage(user_id, 3)
                return stage2
            } else {
                return stage2_fail
            }
        case 3:
            if (words.yes.includes(message.toLowerCase())) {
                let n_days = await countDaysUntilBirthday(user_id)
                return { text: `Great! Your birthday will be on ${n_days} days from now.` }
            } else if (words.no.includes(message.toLowerCase())) {
                return stage3_no
            } else {
                return stage3_fail
            }
        default:
            return stage0
    }
}

// Counts user's days until birthday
async function countDaysUntilBirthday(user_id: string) {
    let now = new Date()
    now.setHours(0, 0, 0, 0)

    let birth_date = await userModel.getBirthDate(user_id)
    birth_date = new Date(birth_date)

    birth_date.setFullYear(now.getFullYear())
    if (birth_date.getTime() < now.getTime()) {
        birth_date.setFullYear(now.getFullYear() + 1)
    }

    let n_days = (birth_date.getTime() - now.getTime()) / (1000 * 3600 * 24)

    return Math.ceil(n_days)
}
