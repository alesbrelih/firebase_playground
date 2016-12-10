// ----- FILE UPLOAD DIRECTIVE MODULE ---- //
function photoUploadDirectiveModule(app){

    function photoUploadDirectiveController(){
        function linkFnc(scope,el,attr,ngCtrl){

            let validTypes = ["image/bmp","image/jpeg","image/pjpeg","image/x-windows-bmp","image/png","image/tiff","image/x-tiff"]

            ngCtrl.$viewChangeListeners.push(function(){

                //if form input is valid
                if(ngCtrl.$valid){

                    //set filereader and action if success reading
                    const fileReader = new FileReader();
                    fileReader.addEventListener("load",function(){
                        scope.$apply(function(){

                            //set preview img src
                            scope.abImgPreview = fileReader.result;

                        });

                    });

                    let modelValue = ngCtrl.$modelValue;
                    if(modelValue){
                        //if file exists and passed validation
                        fileReader.readAsDataURL(modelValue);
                    }
                }

            });


            ///////////////////////////////////////
            // ----- validators -------------------
            //////////////////////////////////////


            //supported img type
            ngCtrl.$validators.supportedImage = function(modelValue,viewValue){
                var value = modelValue || viewValue;
                if(!value){
                    return true;
                }
                else{
                    if(validTypes.indexOf(value.type) !== -1){
                        return true;

                    }
                    else{
                        return false;
                    }
                }
            };

            //valid size of img
            ngCtrl.$validators.imageSize = function(modelValue,viewValue){
                var value = modelValue || viewValue;

                if(!value){
                    return true;
                }
                else{
                    if(value.size > 2000000)
                    {
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            };


            //when input[type=file] changes
            el.on("change",fileChanged);

            //unbind when destroyed
            el.on("$destroy",function(){
                el.off("change",fileChanged);
            });

            //function that changes ngmodel of input[type = file]
            function fileChanged(){
                let file = el[0].files[0];
                ngCtrl.$setViewValue(file);
            }




        }

        //directive definition
        return {
            restrict:"A",
            require:"ngModel",
            link:linkFnc,
            scope:{
                abImgPreview: "="
            }
        };
    }

    //register directive
    app.directive("abPhotoUpload",photoUploadDirectiveController);
}

//exports module
module.exports = photoUploadDirectiveModule;