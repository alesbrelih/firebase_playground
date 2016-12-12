// --- chat service module --- //

function chatServiceModule(app){

    //chat service controller
    function chatServiceController(){
        //returned factory
        const chatFactory = {};

        //return factory
        return chatFactory;
    }

    //register factory
    app.factory("ChatService",chatServiceController);

}

//export service module
module.exports = chatServiceModule;