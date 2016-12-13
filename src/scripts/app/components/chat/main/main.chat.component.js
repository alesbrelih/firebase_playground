function mainChatComponentModule(app){

    //main chat controller
    function mainChatComponentController(){

        //scope
        const vm = this;

        //set private props on init
        vm.$onInit = ()=>{
            // 3 options: people, rooms, join
            vm.sidebar = null;
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
        vm.test=()=>{
            console.log(vm);
        };
    }

    //register component
    app.component("chatMain",{
        controller:mainChatComponentController,
        controllerAs:"vm",
        templateUrl:"/scripts/templates/chat/main/main.chat.component.html"
    });


}

module.exports = mainChatComponentModule;