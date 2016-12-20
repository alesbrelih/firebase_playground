// --- user component module ---- //
function userComponentModule(app){

    //user component controller
    function userComponentController(){
        const vm = this;

    }

    app.component("user",{
        controller: userComponentController,
        controllerAs:"vm",
        templateUrl:"/scripts/templates/user/user.component.html",
        bindings:{
            user:"<"
        }
    });
}

//export module
module.exports = userComponentModule;