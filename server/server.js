"use strict";
// ---- NEEDED MODULES ---- //
const express = require("express");
const app = express();
const queue = require("firebase-queue");

const admin = require("firebase-admin");

const serviceAcc = require("./firebase_sdk_config/scakapo.service.config.json");

admin.initializeApp({
    databaseURL:"https://scakapo-2f1c6.firebaseio.com",
    credential:admin.credential.cert(serviceAcc)
});


//ref to connected and add to queue when removed
admin.database().ref("/connected").on("child_removed",function(snap){

    const task = admin.database().ref("/chat/logout/tasks").push(snap.val());

});

const queueRef = admin.database().ref("/chat/logout");

//firebase queue for dc
var queueFnc = new queue(queueRef, function(data, progress, resolve, reject) {

    console.log("queue started");

    //check if data
    if(!data || !data.uid){
        reject();
    }

    //get current user rooms
    admin.database().ref("/user-rooms").child(data.uid).on("child_added",function(snap){
        //every room in which user is remove user ref ( aka user left )

        admin.database().ref("/room-users").child(snap.key).child(data.uid).remove();
    });



    //task resolved
    resolve();

});


app.listen(8008,function(){
    console.log("Server runing at 8008");
});