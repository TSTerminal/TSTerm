/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html

  SPDX-License-Identifier: EPL-2.0

  Copyright Contributors to the Open Mainframe Project's TSTerm Project
*/

const express = require('express');
const path = require('path')

const app = express()
var   port = parseInt(process.argv[2]);

var expressWs = require('@rocketsoftware/express-ws');
var expressWs = expressWs(app);

const termproxy = require('./termproxy');

let demoLogger = (req, res, next) => {
  let current_datetime = new Date().toISOString();
  let method = req.method;
  let url = req.url;
  let status = res.statusCode;
  let log = `[${current_datetime}] ${method}:${url} ${status}`;
  console.log(log);
  next();
};

var run = function(){
    console.log("Run the proxy");
    app.use(demoLogger);
    app.get('/', (req, res) => {
	    res.sendFile('./html/homepage.html', {root: __dirname })
    });

    const repoDirectory = (require('path').basename(path.join(__dirname,'../')));
    app.use('/static', express.static(path.join(__dirname,`../../${repoDirectory}`)));
    
    app.listen(port, () => {
	    console.log(`Example app listening at http://localhost:${port}`)
    });

    app.ws('/echo', function(ws, req) {
	ws.on('message', function(msg) {
	    ws.send(msg);
	});
    });

    expressWs.applyTo(express.Router);
    
    let logger = termproxy.makeDumbLogger();
    // context.plugin.server.config.user.node.https;
    let context = {
        logger: logger,
        plugin: {
            server: {
                config: {
                    user: {
                        node: {}
                    }
                }
            }
        }
    };

    let routerPromise = termproxy.tn3270WebsocketRouter(context);
    console.log("Made termproxy router promise " + routerPromise);
    routerPromise.then(function(router) {
	    console.log("Router promise resolved " + router);
	    app.use("/tn3270", router);

	    let route, routes = [];

	    console.log("Router stack " + JSON.stringify(router.stack));

        app._router.stack.forEach(function(middleware){
            if (middleware.route) { // routes registered directly on the app
                routes.push(middleware.route);
            } else
                if (middleware.name === 'router') { // router middleware 
                    middleware.handle.stack.forEach(function(handler) {
                    route = handler.route;
                    route && routes.push(route);
                });
            }
        });

        console.log("Express dump " + JSON.stringify(routes));       
    }),
    function(x) {
	    console.log("Promise rejected, author dejected");
    }

    console.log("End of main.run()");
    
}

run();
