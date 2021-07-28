const express = require('express');
const routes = require('./routes');
const log = require('../utils/logger')();
const bodyParser = require('body-parser')

const initWeb = (botClient) => {
    const app = express();
    app.use(bodyParser.json());
    Object.entries(routes).forEach(([key, clz]) => {
        const routeInstance = new clz(botClient);
        routeInstance.createRoute(app);
    });
    app.listen(8080, () => {
        log.info('Server listening on port 8080');
    })
    return app;
}

module.exports = initWeb;