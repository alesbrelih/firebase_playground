// ---- NEEDED MODULES ---- //
const express = require("express");
const app = express();

app.listen(8000,function(){
    console.log("Server runing at 8000");
});

const admin = require("firebase-admin");

const serviceAcc = require("./firebase_sdk_config/scakapo.service.config.json");

admin.initializeApp({
    databaseURL:"https://scakapo-2f1c6.firebaseio.com",
    credential:admin.credential.cert(serviceAcc)
});