import {server,Configs} from './modules/server';

//Global error handling
process.on('uncaughtException', function(error) {
    console.error(error);
});
process.on('unhandledRejection', function(reason, p){
     console.error(reason, p);
});

server.start();
