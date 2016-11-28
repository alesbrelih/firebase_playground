
// ---- MODULE FOR DIRECTIVE THAT CHECKS IF PWD AND PWD CONFIRM MATCH --- ///

function abPwdMatchModule(app){

    //directive that checks if password and password confirm matches
    app.directive("abPwdMatch",function(){
        return {
            restrict:"A",
            require:"ngModel",
            scope: {
                abPwdMatch:"="
            },
            link: function(scope,el,attr,ngCtrl){

                //validators
                ngCtrl.$validators.passwordMatch = function(modelValue,viewValue){
                    const value = modelValue || viewValue;

                    //validator is true when they match
                    if(value === scope.abPwdMatch){
                        return true;
                    }
                    return false;

                };

                //watch password if it changes, need to revalidate
                scope.$watch("abPwdMatch",function(){
                    ngCtrl.$validate();
                });
            }
        };
    });

}
module.exports = abPwdMatchModule;