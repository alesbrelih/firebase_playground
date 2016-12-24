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
//queue for logout code
const queueRefLogout = admin.database().ref("/chat/logout");

//firebase queue for dc
var queueLogoutFnc = new queue(queueRefLogout, function(data, progress, resolve, reject) {

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

    //quit private rooms
    admin.database().ref("/user-privates").child(data.uid).on("child_added",function(snap){

        //every private user room remove user id from room users
        admin.database().ref("/private-room-users").child(snap.key).child(data.uid).remove();
    });



    //task resolved
    resolve();

});


//queue to join private chat
const privateChatJoinQueue = admin.database().ref("/join-private-room");

const queuePrivateJoinFnc = new queue(privateChatJoinQueue,function(data, progress, resolve, reject){

    //check that ids do not match
    if(data.first === data.second){
        //reject if ids are same
        reject("Start and end point are the same");
    }
    progress(5);

    //check if room exists first
    const firstCheck = admin.database().ref("/private-rooms").child(`${data.first}${data.second}`).once("value");
    const secondCheck = admin.database().ref("/private-rooms").child(`${data.second}${data.first}`).once("value");
    Promise.all([firstCheck,secondCheck]).then(success=>{

        //check if any of those options exist
        let result = false;
        if(success[0].exists()){
            result = success[0];
        }
        if(success[1].exists()){
            result = success[1];
        }

        //get both users
        const firstUser = admin.database().ref("/profiles").child(data.first).once("value");
        const secondUser = admin.database().ref("/profiles").child(data.second).once("value");

        //get user data
        Promise.all([firstUser,secondUser]).then(success=>{
            //mark progress
            progress(20);

            //both user info
            const resolvedFirst = success[0];
            const resolvedSecond = success[1];

            //dont exist
            if(!result){
                //create private room ref
                const roomKey = `${data.first}${data.second}`;

                //create room
                const privateRoom = admin.database().ref("/private-rooms").child(roomKey);
                const roomInfo = {};
                roomInfo[resolvedFirst.key] = resolvedFirst.val();
                roomInfo[resolvedSecond.key] = resolvedSecond.val();
                privateRoom.set(roomInfo);
                progress(30);

                //push to user Rooms for first
                const firstUserPrivate = admin.database().ref("/user-privates").child(data.first).child(roomKey);
                const firstPrivateInfo = {
                    roomId:roomKey,
                    name:resolvedSecond.val().username
                };
                firstUserPrivate.set(firstPrivateInfo);

                //push to user Rooms for first
                const secondUserPrivate = admin.database().ref("/user-privates").child(data.second).child(roomKey);
                const secondPrivateInfo = {
                    roomId: roomKey,
                    name:resolvedFirst.val().username
                };
                secondUserPrivate.set(secondPrivateInfo);

                //set progress
                progress(100);

                resolve();


            }
            else{
                //private room already existed
                const roomKey = result.key;

                //push to user Rooms for first
                const firstUserPrivate = admin.database().ref("/user-privates").child(data.first).child(roomKey);
                const firstPrivateInfo = {
                    roomId:roomKey,
                    name:resolvedSecond.val().username
                };

                firstUserPrivate.set(firstPrivateInfo);

                //set progress
                progress(30);

                //check if other user has it opened
                admin.database("user-privates").child(data.second).child(roomKey).once("value")
                    .then(snap=>{
                        //set progress
                        progress(40);
                        //check if snap exists
                        if(!snap.exists()){
                            //push to user Rooms for second
                            const secondUserPrivate = admin.database().ref("/user-privates").child(data.second).child(roomKey);
                            const secondPrivateInfo = {

                                roomId: roomKey,
                                name:resolvedFirst.val().username

                            };
                            secondUserPrivate.set(secondPrivateInfo);
                        }
                        progress(100);
                        resolve();
                    });
            }
        });


    }).catch(err=>{
        console.log(err);
    });

    progress(50);
    //do for the other use aswell

    progress(100);
    resolve();
});


app.listen(8008,function(){
    console.log("Server runing at 8008");
});