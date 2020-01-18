import * as admin from 'firebase-admin'
import * as fs from "fs";

// const serviceAccount = require("../config/firebase-config")

let data = fs.readFileSync('./src/config/firebase-config.json');
let serviceAccount = JSON.parse(data.toString())

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://days-til-birthday.firebaseio.com"
})

export default admin
