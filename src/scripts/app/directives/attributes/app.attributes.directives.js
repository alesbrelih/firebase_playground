// ----- MODULE THAT REGISTERS ALL ATTRIBUTE DIRECTIVES ---- //

function registerAllAttributeDirectives(app){

    // ab pwd match attribute directive
    const abPwdMatch = require("./ab.pwd.match.directive");
    abPwdMatch(app);

    // file upload attr directive
    const abPhotoUpload = require("./ab.photo.upload.directive");
    abPhotoUpload(app);
}

module.exports = registerAllAttributeDirectives;