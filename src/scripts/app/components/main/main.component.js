// ---- MAIN COMPONENT - WRAPPER -- MODULE ----- //
function mainComponentModule(app){

    function mainComponentController(){

    }


    //register component
    app.component("main",{
        controller:mainComponentController,
        controllerAs:"vm",
        templateUrl:"/scripts/templates/main/main.component.html"
    });

}

module.exports = mainComponentModule;