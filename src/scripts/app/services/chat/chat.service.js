// --- chat service module --- //

function chatServiceModule(app){

    //chat service controller
    function chatServiceController($firebaseObject,$firebaseArray,$firebaseRef,Auth,$q){
        //returned factory
        const chatFactory = {};

        //room types "enum"
        const roomTypes = require("../../constant/room.types");

        // --- privates --- //
        const rooms = [];
        let current = {
            user:null,
            room:null,
            private:null
        };
        let p_uid = null;
        let currentUserDb = null;

        //functions

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
                    console.log("success 2",success[2]);
                    const room = {
                        type:roomTypes.room,
                        users:success[0],
                        messages:success[1],
                        name:success[2].val().name
                    };
                    rooms.push(room);
                    deffered.resolve();

                }).catch(err=>{
                    console.log(err);
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
        function joinRoom(roomName){

            //deffered
            const deffered = $q.defer();


            $firebaseRef.rooms.orderByChild("name").equalTo(roomName).once("value")
                .then(snap=>{
                    let roomId = null;
                    if(snap.val() === null)
                    {
                        //creates room
                        const room = $firebaseRef.rooms.push();
                        room.set({
                            name:roomName
                        });

                        //save room id
                        roomId = room.key;

                        //push user/room to ref in db
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
                        roomId = snap.key;
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

                    $q.all([roomDetailsPromise,roomUsersPromise,roomMessagesPromise]).all(success=>{
                        const room = {
                            type : roomTypes.room,
                            name: success[0].val().name,
                            users: success[1],
                            messages:success[2]
                        };

                        //add to list
                        rooms.push(room);

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
            if(_roomType === roomTypes.room){
                
                const message = {};

                //add message to ref
                current.room.messages.$add({
                    profile:current.user,
                    message:_chatMessage
                });

            }
            else if(_roomType === roomTypes.private){
                //TODO FOR PRIVATES
            }
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