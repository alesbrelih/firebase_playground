// ---- null filter module ---- //
function nullFilterModule(app){

    //null filter controller
    function nullFilterController(){
        return function(input) {
            if(input == null){
                return "not set";
            }
            else{
                if(input == ""){
                    return "not set";
                }
            }
        };
    }

    app.filter("nullFilter",nullFilterController);

}

//exports module
module.exports = nullFilterModule;