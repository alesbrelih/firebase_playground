///////////////////////////////////////////////
// --- Register all components module ------///
//////////////////////////////////////////////

function registerAllComponentsModule(app){

    
    // -----  Auth components ---- //

    // main
    
    const authMain = require("./auth/auth.main.component");
    authMain(app);

    //login
    const authLogin = require("./auth/auth.login.component");
    authLogin(app);


}

module.exports = registerAllComponentsModule;