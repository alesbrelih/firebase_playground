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
        let current = {
            user:null,
            room:null,
            private:null
        };
        let p_uid = null;
        let currentUserDb = null;

        // ------- functions ------- //

        // ----- previous rooms functions ----- //
        function joinPreviousRooms(){

            //clear rooms
            if(rooms.length != 0){
                while(rooms.length != 0){
                    rooms.pop();
                }
            }

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
                }).catch(err=>console.log(err));



            });

        }

        //joins previous room
        function previousRoom(exRoomId){
            // TODO: JOIN ROOM ON DB



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
                            $firebaseRef.userRooms.child(p_uid).child(room.key)
                                .set({
                                    type:roomTypes.room,
                                    name:roomName
                                });
                            $firebaseRef.roomUsers.child(room.key).child(p_uid)
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

            //join his rooms
            joinPreviousRooms();


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
        chatFactory.SendMessage = (_chatMessage, _roomType)=>{
            const deffered = $q.defer();

            if(_roomType === roomTypes.room){


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
            else if(_roomType === roomTypes.private){
                //TODO FOR PRIVATES
            }

            return deffered.promise;
        };

        //joins room public method that connects to private
        chatFactory.JoinRoom = (_roomName, _joinAfterwards) => {
            //join room and return promise
            return joinRoom(_roomName,_joinAfterwards);
        };

        //select room
        chatFactory.SelectRoom = (room) => {
            // select room
            if(room.type == roomTypes.room){
                //select new room
                current.room = room;
            }
            else if(room.type == roomTypes.private){
                //do stuff when private
                current.private = room;
            }
        };

        //leave room
        chatFactory.LeaveRoom = (room) => {

            //remove user entry from room users
            const removeFromRoomUsersPromise = $firebaseRef.roomUsers.child(room.id).child(p_uid).remove();
            //remove room from user rooms
            const removeFromUserRoomsPromise = $firebaseRef.userRooms.child(p_uid).child(room.id).remove();

            //once both resolved succesffuly, remove room from array and select new room
            $q.all([removeFromRoomUsersPromise,removeFromUserRoomsPromise]).then(()=>{

                //get index
                const indexInArray = rooms.indexOf(room);

                //remove from rooms
                rooms.splice(indexInArray,1);

                //if was first item
                if(indexInArray == 0){
                    // no rooms left
                    if(rooms.length == 0){
                        current.room = null;
                    }
                    else{
                        //select next room instead of previous
                        current.room = rooms[0];
                    }
                }
                else{
                    //other edge case
                    if(indexInArray == rooms.length){
                        current.room = rooms[indexInArray-1];
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