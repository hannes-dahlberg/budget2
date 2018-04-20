import { server, Configs } from './modules/server';
import { storage } from './modules/storage';

/*import User from './models/user';
User.create('user@test.com', 'test').then(() => {
    console.log('USER CREATED')
});*/

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