function mainChatComponentModule(app){

    //main chat controller
    function mainChatComponentController(){

        //scope
        const vm = this;

        
    }

    //register component
    app.component("chatMain",{
        controller:mainChatComponentController,
        controllerAs:"vm",
        templateUrl:"/scripts/templates/chat/main/main.chat.component.html"
    });


}

module.exports = mainChatComponentModule;