///////////////////////////////////////////
// ---- REGISTER ALL SERVICES MODULE ----//
//////////////////////////////////////////


function registerAllServicesModule(app){


    //register Auth service
    const authService = require("./auth/auth.service");
    authService(app);

    //profile service
    const profileService = require("./profile/profile.services");
    profileService(app);
}

module.exports = registerAllServicesModule;