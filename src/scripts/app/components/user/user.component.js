// --- user component module ---- //
function userComponentModule(app){

    //user component controller
    function userComponentController(){

        //current scope
        const vm = this;

        //on init
        vm.$onInit = ()=>{
            //set current user
            vm.currentuser = vm.user.val();

        };

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