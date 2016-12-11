// -- back img attr that changes background img -- //
function backImgDirectiveModule(app){

    function backImgDirectiveController(){

        //link fnc
        function linkFnc(scope,el){

            scope.$watch("backImg",function(value){

                if(value == null){
                    el.css({
                        "background-image": "url('/img/empty-profile.jpg')",
                        "background-size" : "cover"
                    });
                }
                else{
                    //change css
                    el.css({
                        "background-image": "url(" + value +")",
                        "background-size" : "cover"
                    });
                }

            });

        }

        return {
            restrict:"A",
            link:linkFnc,
            scope:{
                backImg:"="
            }
        };
    }

    app.directive("backImg",backImgDirectiveController);

}

//export directive
module.exports = backImgDirectiveModule;