// --- chat service module --- //

function chatServiceModule(app){

    //chat service controller
    function chatServiceController($firebaseObject,$firebaseArray,$firebaseRef,Auth,$q){
        //returned factory
        const chatFactory = {};

        //room types "enum"
        const roomTypes = require("../../constant/room.types");

        // --- privates --- //

        // --- properties --- //
        const rooms = [];

        //object with currently selected data
        let current = {
            user:null,
            room:null,
            private:null,
            type:null
        };

        //user data
        let p_uid = null;
        let currentUserDb = null;

        // ------- functions ------- //

        //clear rooms
        function clearPrevious(){
            //clear rooms
            if(rooms.length != 0){
                while(rooms.length != 0){
                    rooms.pop();
                }
            }
        }

        // ------- public room functions ------ //

        // ----- previous rooms functions ----- //
        function joinPreviousRooms(){


            //joins previous rooms
            $firebaseRef.userRooms.child(p_uid).once("value",user_rooms=>{
                user_rooms = user_rooms.val();

                //join rooms promises
                const joinRoomsPromises = [];

                //if no ex user rooms
                if(user_rooms == null){
                    //join default
                    joinRoomsPromises.push(previousRoom());
                }
                else{ //else
                    //join every room

                    for(let room in user_rooms){

                        joinRoomsPromises.push(previousRoom(room));
                    }
                }


                //current room is first that is public :
                //TODO: think a bit more about how to approach this
                $q.all(joinRoomsPromises).then(()=>{
                    let publicRooms = rooms.filter(item=>{
                        return item.type == roomTypes.room;

                    });
                    current.room = publicRooms[0];
                    current.type = publicRooms[0].type;
                }).catch(err=>console.log(err));



            });

        }

        //joins previous room
        function previousRoom(exRoomId){

            //room def exists
            if(exRoomId){

                const deffered = $q.defer();

                //join room chat
                const userRef = $firebaseRef.roomUsers.child(exRoomId).child(p_uid);
                userRef.set({
                    name:currentUserDb.name,
                    lastname:currentUserDb.lastname,
                    username:currentUserDb.username,
                    photo:currentUserDb.photo
                });

                //promises for message and users
                let roomUsersPromise = $firebaseArray($firebaseRef.roomUsers.child(exRoomId))
                    .$loaded();

                //room name
                let roomMessages = $firebaseArray($firebaseRef.roomMessages.child(exRoomId))
                    .$loaded();

                //room name
                let roomDetails = $firebaseRef.rooms.child(exRoomId).once("value");


                //set new room if both resolve successfully
                $q.all([roomUsersPromise,roomMessages,roomDetails]).then(success=>{

                    const room = {
                        type:roomTypes.room,
                        users:success[0],
                        messages:success[1],
                        name:success[2].val().name,
                        id:success[2].key
                    };
                    rooms.push(room);
                    deffered.resolve();

                }).catch(err=>{

                    deffered.reject();
                });

                return deffered.promise;

            }
            else{
                //doesnt exist, join default and return promise for when its done
                return joinRoom("default");
            }
        }

        // ---- join new room functions ----- //
        // openAfterwards represents if user wants to open it once joined
        function joinRoom(roomName,openAfterwards){

            //deffered
            const deffered = $q.defer();

            //check if room you want to join already he joined to
            const sameRoom = rooms.filter(item=>{
                //conditional statement
                if(item.name.toLowerCase() == roomName.toLowerCase()){
                    return item;
                }
            });

            //same name already exists
            if(sameRoom.length == 1){
                current.room = sameRoom[0];
                deffered.resolve();
            }


            //room with same name isnt opened yet
            if(sameRoom.length == 0){
                //check if this room already exists
                // $firebaseRef.rooms.orderByChild("name").equalTo(roomName).once("value")
                $firebaseRef.rooms.orderByChild("name").startAt(roomName).endAt(roomName).once("value")
                    .then(snap=>{
                        let roomId = null;


                        if(snap.val() === null)
                        {
                            //creates room
                            const room = $firebaseRef.rooms.push();
                            room.set({
                                type:roomTypes.room,
                                name:roomName
                            });

                            //save room id
                            roomId = room.key;

                            //push user/room to ref in db
                            $firebaseRef.userRooms.child(p_uid).child(roomId)
                                .set({
                                    type:roomTypes.room,
                                    name:roomName
                                });
                            $firebaseRef.roomUsers.child(roomId).child(p_uid)
                                .set({
                                    name:currentUserDb.name,
                                    lastname:currentUserDb.lastname,
                                    username:currentUserDb.username,
                                    photo:currentUserDb.photo
                                });


                        }
                        else{
                            //get id from array of rooms, only 1!
                            for(let id in snap.val()){
                                roomId = id;
                            }

                            $firebaseRef.userRooms.child(p_uid).child(roomId)
                                .set({
                                    type:roomTypes.room,
                                    name:roomName
                                });
                            $firebaseRef.roomUsers.child(roomId).child(p_uid)
                                .set({
                                    name:currentUserDb.name,
                                    lastname:currentUserDb.lastname,
                                    username:currentUserDb.username,
                                    photo:currentUserDb.photo
                                });

                        }

                        //room details
                        let roomDetailsPromise = $firebaseRef.rooms.child(roomId).once("value");

                        //room users
                        let roomUsersPromise = $firebaseArray($firebaseRef.roomUsers.child(roomId))
                        .$loaded();
                        // .then(users=>{
                        //     roomUsers = users;
                        // }).catch(err=>console.log(err));

                        //get room messages
                        let roomMessagesPromise = $firebaseArray($firebaseRef.roomMessages.child(roomId))
                            .$loaded();
                            // .then(messages=>{
                            //     roomMessages = messages;
                            // }).catch(err=>console.log(err));

                        $q.all([roomDetailsPromise,roomUsersPromise,roomMessagesPromise]).then(success=>{
                            const room = {
                                type : roomTypes.room,
                                name: success[0].val().name,
                                users: success[1],
                                messages:success[2],
                                id: success[0].key
                            };


                            //add to list
                            rooms.push(room);

                            //if openAfterwards
                            if(openAfterwards == true){
                                //set it as current
                                current.room = room;
                                current.type = roomTypes.room;
                            }

                            //successfull resolve
                            deffered.resolve();
                        }).catch(err=>{
                            console.log(err);
                            deffered.reject();
                        });


                    }).catch(err=>{
                        deffered.reject();
                        console.log(err);
                    });

            }



            //return promise
            return deffered.promise;

        }

        // ----- private rooms functions ----- //

        //joins all previous private rooms
        function joinPreviousPrivates(){

            //join previous rooms
            $firebaseRef.userPrivateRooms.child(p_uid).on("child_added",snap=>{
                if(snap){
                    const userPrivate = snap;

                    //check if snap exists
                    if(userPrivate.exists()){
                        //if private chats exist and opened

                        //joins previous private
                        joinPreviousPrivate(userPrivate.key);

                    }
                }

            });

        }

        //join specific private room
        function joinPreviousPrivate(privateId){

            //create promise
            const deffered = $q.defer();

            //get private room users promise
            const privateRoomUsersPromise = $firebaseArray($firebaseRef.privateRoomUsers.child(privateId))
                .$loaded();

            //get private room messages promise
            const privateRoomMessagesPromise = $firebaseArray($firebaseRef.privateRoomMessages.child(privateId))
                .$loaded();

            //get room info

            const privateRoomDetailsPromise = $firebaseRef.userPrivateRooms.child(p_uid)
                .child(privateId).once("value");

            $q.all([privateRoomUsersPromise,privateRoomMessagesPromise,privateRoomDetailsPromise]).then(success=>{

                const privateRoom = {
                    users:success[0],
                    messages:success[1],
                    roomId:privateId,
                    name:success[2].val().name,
                    type:roomTypes.private
                };

                rooms.push(privateRoom);
                current.private = privateRoom;
                current.type = roomTypes.private;

                const privateChatUserRef = $firebaseRef.privateRoomUsers.child(privateId).child(p_uid);
                privateChatUserRef.set(current.user);

            }).catch(err=>{
                console.log(err);
            });


            return deffered.promise;
        }

        //join private room
        function joinPrivate(userId){

            //create promise
            const deffered = $q.defer();

            //get if room exists

            //get if chat is already opened
            const existing = rooms.filter(item=>{
                if(item.roomId){
                    if(item.roomId == `${p_uid}${userId}`){
                        return item;
                    }
                    if(item.roomId == `${userId}${p_uid}`){
                        return item;
                    }
                }

            });

            //existing exist,
            //change to it
            if(existing.length == 1){
                current.private = existing[0];
                deffered.resolve();
            }

            else{
                $firebaseRef.joinPrivateQueue.push({
                    first:p_uid,
                    second:userId
                },()=>{
                    deffered.resolve();
                });
            }
            //return promise
            return deffered.promise;
        }

        // --- public methods --- //

        //gets user rooms
        chatFactory.JoinChat = ()=>{

            //get user uid
            p_uid = Auth.$getAuth().uid;

            $firebaseRef.profiles.child(p_uid).once("value")
                .then(function(snap){
                    currentUserDb = snap.val();
                    current.user = snap.val();
                    current.user.uid = p_uid;

                    let userConnected = $firebaseRef.connected.push();
                    //set data
                    userConnected.set({
                        uid:p_uid,
                        username:currentUserDb.username
                    });

                    userConnected.onDisconnect().remove();
                });

            clearPrevious();

            //join his rooms
            joinPreviousRooms();

            //join previous privates
            joinPreviousPrivates();


        };

        //leave chat
        chatFactory.LeaveChat = ()=>{

        };

        //returns current object for both private and public
        chatFactory.Current = ()=>{
            return current;
        };

        //return all rooms
        chatFactory.Rooms = ()=>{
            return rooms;
        };

        //send message to current room
        chatFactory.SendMessage = (_chatMessage)=>{
            const deffered = $q.defer();

            if(current.type === roomTypes.room){

                //add message to ref
                current.room.messages.$add({
                    profile:current.user,
                    message:_chatMessage
                }).then(()=>{
                    deffered.resolve();
                }).catch(err=>{
                    console.log(err);
                    deffered.reject();
                });


            }
            else if(current.type === roomTypes.private){

                //add message for privates
                current.private.messages.$add({
                    profile:current.user,
                    message:_chatMessage
                }).then(()=>{
                    deffered.resolve();
                }).catch(err=>{
                    console.log(err);
                    deffered.reject();
                });

            }

            return deffered.promise;
        };

        //joins room public method that connects to private
        chatFactory.JoinRoom = (_roomName, _joinAfterwards) => {
            //join room and return promise
            return joinRoom(_roomName,_joinAfterwards);
        };

        //join private chat
        chatFactory.JoinPrivate = (userId) =>{
            return joinPrivate(userId);
        };

        //select room
        chatFactory.SelectRoom = (room) => {
            // select room
            if(room.type == roomTypes.room){
                //select new room
                current.room = room;
                current.type = roomTypes.room;
            }
            else if(room.type == roomTypes.private){
                //do stuff when private
                current.private = room;
                current.type = roomTypes.private;
            }
        };

        //leave room
        chatFactory.LeaveRoom = (room) => {

            //array containing promises
            const promiseArray = [];

            //if room leaving is public
            if(room.type == roomTypes.room){

                //remove user entry from room users
                const removeFromRoomUsersPromise = $firebaseRef.roomUsers.child(room.id).child(p_uid).remove();

                promiseArray.push(removeFromRoomUsersPromise);

                //remove room from user rooms
                const removeFromUserRoomsPromise = $firebaseRef.userRooms.child(p_uid).child(room.id).remove();

                promiseArray.push(removeFromUserRoomsPromise);

            }

            else if(room.type == roomTypes.private){
                // if private then other queries

                //remove user entry from room users
                const removeFromPrivateUsersPromise = $firebaseRef.privateRoomUsers.child(room.roomId).child(p_uid).remove();
                promiseArray.push(removeFromPrivateUsersPromise);

                //remove room from user rooms
                const removeFromUserPrivatesPromise = $firebaseRef.userPrivateRooms.child(p_uid).child(room.roomId).remove();
                promiseArray.push(removeFromUserPrivatesPromise);
            }

            //once both resolved succesffuly, remove room from array and select new room
            $q.all(promiseArray).then(()=>{

                //get index
                const indexInArray = rooms.indexOf(room);

                //remove from rooms
                rooms.splice(indexInArray,1);

                //if was first item
                if(indexInArray == 0){
                    // no rooms left
                    if(rooms.length == 0){
                        current.room = null;
                        current.type = null;
                    }
                    else{
                        //select next room instead of previous
                        current.room = rooms[0];
                        current.type = room[0].type;
                    }
                }
                else{
                    //other edge case
                    if(indexInArray == rooms.length){
                        current.room = rooms[indexInArray-1];
                        current.type = rooms[indexInArray-1].type;
                    }
                }

            }).catch(err=>console.log(err));



        };



        //return factory
        return chatFactory;
    }

    //inject needed services
    chatServiceController.$inject = ["$firebaseObject","$firebaseArray","$firebaseRef","Auth","$q"];

    //register factory
    app.factory("ChatService",chatServiceController);

}

//export service module
module.exports = chatServiceModule;