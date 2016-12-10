(function(){
    //references
    const angular = require("angular");
    const firebase = window.firebase = require("firebase");
    require("angular-ui-router");
    require("angularfire");


    //main angular app
    const app = angular.module("firebaseApp",["ui.router","firebase"]);

    //register services
    const services = require("./services/app.services");
    services(app);

    //configures main app
    const configApp = require("./config/app.config");
    configApp(app,firebase);

    // register components
    const components = require("./components/app.components");
    components(app);

    //register directives
    const directives = require("./directives/app.directives");
    directives(app);

    //register filters
    const filters = require("./filter/null/null.filter");
    filters(app);
    









})();