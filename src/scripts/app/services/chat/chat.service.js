// --- chat service module --- //

function chatServiceModule(app){

    //chat service controller
    function chatServiceController($firebaseObject,$firebaseArray,$firebaseRef,Auth){
        //returned factory
        const chatFactory = {};

        //room types "enum"
        const roomTypes = require("../../constant/room.types");

        // --- privates --- //
        const rooms = [];
        let currentRoom = null;
        let currentPrivate = null;
        let p_uid = null;
        let currentUserDb = null;

        //functions

        // ----- previous rooms functions ----- //

        function joinPreviousRooms(){
            //joins previous rooms
            $firebaseArray($firebaseRef.userRooms.child(p_uid)).$loaded()
                .then(user_rooms=>{
                    //once resolved

                    //if no ex user rooms
                    if(user_rooms.length == 0){
                        //join default
                        previousRoom();
                    }
                    else{ //else
                        //join every room
                        for(let room of user_rooms){
                            previousRoom(room.$id);
                        }
                    }

                }).catch(err=>{
                    console.log(err);
                });


        }

        //joins previous room
        function previousRoom(exRoomId){
            // TODO: JOIN ROOM ON DB

            const room = {
                type:roomTypes.room
            };


            //room def exists
            if(exRoomId){
                //get room users

                let roomUsers = $firebaseArray($firebaseRef.roomUsers.child(exRoomId))
                    .$loaded().then(users=>{
                        roomUsers = users;
                    }).catch(err=>console.log(err));

                //get room messages
                let roomMessages = $firebaseArray($firebaseRef.roomMessages.child(exRoomId))
                    .$loaded().then(messages=>{
                        roomMessages = messages;
                    }).catch(err=>console.log(err));

                //set arrays to object
                room.users = roomUsers;
                room.messages = roomMessages;

                //add to list
                rooms.push(room);

            }
            else{
                //doesnt exist, join default
                joinRoom("default");
            }
        }

        // ---- join new room functions ----- //
        function joinRoom(roomName){

            $firebaseRef.rooms.orderByChild("name").equalTo(roomName).once("value")
                .then(snap=>{

                    if(snap.val() === null)
                    {
                        //creates room
                        const room = $firebaseRef.rooms.push();
                        room.set({
                            name:roomName
                        });
                        $firebaseRef.userRooms.child(p_uid).child(room.key)
                            .set({name:roomName});
                        $firebaseRef.roomUsers.child(room.key).child(p_uid)
                            .set({
                                name:currentUserDb.name,
                                lastname:currentUserDb.lastname,
                                username:currentUserDb.username,
                                photo:currentUserDb.photo
                            });
                    }
                    else{
                        //room already exists
                        const roomId = snap.key;
                        $firebaseRef.userRooms.child(p_uid).child(roomId)
                            .set({name:roomName});
                        $firebaseRef.roomUsers.child(roomId).child(p_uid)
                            .set({
                                name:currentUserDb.name,
                                lastname:currentUserDb.lastname,
                                username:currentUserDb.username,
                                photo:currentUserDb.photo
                            });

                    }

                    //set ref to that room messages / users
                    let newRoomRef = {};

                    let roomUsers = $firebaseArray($firebaseRef.roomUsers.child(exRoomId))
                    .$loaded().then(users=>{
                        roomUsers = users;
                    }).catch(err=>console.log(err));

                    //get room messages
                    let roomMessages = $firebaseArray($firebaseRef.roomMessages.child(exRoomId))
                        .$loaded().then(messages=>{
                            roomMessages = messages;
                        }).catch(err=>console.log(err));

                    //set arrays to object
                    newRoomRef.users = roomUsers;
                    newRoomRef.messages = roomMessages;

                    //add to list
                    rooms.push(newRoomRef);


                }).catch(err=>console.log(err));

        }

        // --- public methods --- //

        //gets user rooms
        chatFactory.JoinChat = ()=>{
            //get user uid
            p_uid = Auth.$getAuth().uid;

            $firebaseRef.profiles.child(p_uid).once("value")
                .then(function(snap){
                    currentUserDb = snap.val();

                    let userConnected = $firebaseRef.connected.push();
                    //set data
                    userConnected.set({
                        uid:p_uid,
                        username:currentUserDb.username
                    });

                    userConnected.onDisconnect().remove();
                });






            //join his rooms
            joinPreviousRooms();


        };

        //leave chat
        chatFactory.LeaveChat = ()=>{

        };

        //return factory
        return chatFactory;
    }

    //inject needed services
    chatServiceController.$inject = ["$firebaseObject","$firebaseArray","$firebaseRef","Auth"];

    //register factory
    app.factory("ChatService",chatServiceController);

}

//export service module
module.exports = chatServiceModule;