function mainChatComponentModule(app){

    //main chat controller
    function mainChatComponentController(ChatService){

        //scope
        const vm = this;

        //set private props on init
        vm.$onInit = ()=>{
            // 3 options: people, rooms, join
            vm.sidebar = null;

            //room types
            vm.RoomTypes = require("../../../constant/room.types");

            //set chat
            ChatService.JoinChat();

            //once joins room dont join privates
            vm.currentRoomType = vm.RoomTypes.room;

            //get all chat rooms
            vm.rooms = ChatService.Rooms();

            //set current room ref
            vm.current = ChatService.Current();

            //set text input
            vm.input = "";
        };

        //open sidebar
        vm.openSide = (sidebar)=>{

            //if sidebar is same then close
            if(sidebar == vm.sidebar){
                vm.sidebar = null;
            }
            else{
                //open sidebar
                vm.sidebar = sidebar;
            }

        };

        //sends message using Chatservice send message
        vm.sendMessage = ()=>{
            //sends message to current room
            ChatService.SendMessage(vm.input,vm.currentRoomType)
                .then(()=>{
                    //success
                    //clear input
                    vm.input = "";
                });
        };

        //join room
        vm.joinRoom = ()=>{
            if(vm.roomName != null && vm.roomName != ""){
                //join room
                ChatService.JoinRoom(vm.roomName,true).then(()=>{
                    vm.roomName = "";
                });
            }
        };

        //select room
        vm.selectRoom = (room)=>{
            ChatService.SelectRoom(room);
            if(room.type == vm.RoomTypes.room){
                vm.currentRoomType = vm.RoomTypes.room;
            }
        };

        //leave room method
        vm.leaveRoom = (room) => {
            ChatService.LeaveRoom(room);
        };

    }

    //inject services
    mainChatComponentController.$inject = ["ChatService"];

    //register component
    app.component("chatMain",{
        controller:mainChatComponentController,
        controllerAs:"vm",
        templateUrl:"/scripts/templates/chat/main/main.chat.component.html"
    });


}

module.exports = mainChatComponentModule;