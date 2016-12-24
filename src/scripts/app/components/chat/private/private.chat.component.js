
// ------ private chat component module ------ //

function privateChatComponentModule(app){

    //component controller
    function privateChatComponentController(){

        //scope
        const vm = this;
    }


    // register component
    app.component("chatPrivate",{
        controller:privateChatComponentController,
        controllerAs:"vm",
        templateUrl:"/scripts/templates/chat/private/private.chat.component.html",
        bindings:{
            currentPrivateRoom : "<"
        }
    });
}

//export component to register
module.exports = privateChatComponentModule;