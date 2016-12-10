// ---- REGISTER ALL FILTERS ---- //
function registerAllFiltersModule(app){

    // register null filter
    const nullFilter = require("./null/null.filter");
    nullFilter(app);

}

//export module
module.exports = registerAllFiltersModule;