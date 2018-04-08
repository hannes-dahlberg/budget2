import {server,Configs} from './modules/server';
import { server, Configs } from './modules/server';
import { storage } from './modules/storage';

//Global error handling
process.on('uncaughtException', function(error) {
    console.error(error);
});
process.on('unhandledRejection', function(reason, p){
     console.error(reason, p);
});

//Initiate DB and then start server
storage.init().then(() => {
    server.start();
});