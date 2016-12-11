// -- SPINNER COMPONENT MODULE -- //
function spinnerComponentModule(app){


    //register component to app
    app.component("abSpinner",{
        templateUrl:"/scripts/templates/spinner/spinner.component.html"
    });

}

//export module
module.exports = spinnerComponentModule;