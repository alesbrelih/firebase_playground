// ----- MODULE THAT REGISTERS ALL ATTRIBUTE DIRECTIVES ---- //

function registerAllAttributeDirectives(app){

    // ab pwd match attribute directive
    const abPwdMatch = require("./ab.pwd.match.directive");
    abPwdMatch(app);


}

module.exports = registerAllAttributeDirectives;