
// ---- MODULE THAT REGISTERS ALL DIRECTIVES ---- //

function registerAllDirectives(app){

    //register attribute directives
    const attrDirectives = require("./attributes/app.attributes.directives");
    attrDirectives(app);

}

module.exports = registerAllDirectives;