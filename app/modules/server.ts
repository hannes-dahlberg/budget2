//Importing node modules
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';

//Config interface
export interface Configs {
    port: number
}

//Importing middlewares
import * as middlewares from '../http/middlewares';

//Importing controllers
import {Controllers} from '../http/controllers/index';

class Server {
    //Helpers for initiating a singleton of the class
    private static instance: Server;
    private constructor() { }
    static getInstance() { return Server.instance || (Server.instance = new Server()); }

    //Holds server configs
    configs: Configs = <Configs>{};

    /**
     * Start the web server
     * @param configs Provide configs for the server. See Config interface for
     * properties
     */
     start(configs: Configs = <Configs>{ port: 9090 }): Promise<void> {
         return new Promise((resolve, reject) => {
             //Setting configs
             this.configs = Object.assign(this.configs, configs);

             //Creating the express app
             var app = express();

             //Attaching body parser
             app.use(bodyParser.json());

             //Register static route
             app.use(express.static(path.join(__dirname, '../../dist')));

             //Register fallback route to index.html
             app.get('/*', (request, result) => result.sendFile(path.join(__dirname, '../../dist/index.html')))

             app.listen(this.configs.port, () => {
                 console.log('Listening on http://localhost:' + this.configs.port + '!');
                 resolve();
             });
         });
     }
}

export let server = Server.getInstance();