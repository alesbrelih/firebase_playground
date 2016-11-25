// ---- AUTH MAIN COMPONENT MODULE --- //
function authMainComponentModule(app){

    //register component, dont need any controller
    app.component("authMain",{
        templateUrl: "/scripts/templates/auth/auth.main.component.html"
    });

}

module.exports = authMainComponentModule;