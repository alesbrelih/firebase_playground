///////////////////////////////////////////
// ---- REGISTER ALL SERVICES MODULE ----//
//////////////////////////////////////////


function registerAllServicesModule(app){


    //register Auth service
    const authService = require("./auth/auth.service");
    authService(app);
}

module.exports = registerAllServicesModule;