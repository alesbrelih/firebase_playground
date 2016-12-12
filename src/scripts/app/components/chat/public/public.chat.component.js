
// ---- public chat component module ---- //

function publicChatComponentModule(app){

    // public chat component controller
    function publicChatComponentController(){

        //current scope
        const vm = this;
    }


    //register component
    app.component("chatPublic",{
        controller:publicChatComponentController,
        controllerAs:"vm",
        templateUrl:"/scripts/templates/main/public/public.chat.component.js"
    });
}

module.exports = publicChatComponentModule;