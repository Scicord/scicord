const AuthRoute = require("./authRoute");
const Configs = require('../../../config/command');

module.exports = class ConfigRoute extends AuthRoute {
    constructor(botClient) {
        super(botClient);
    }    

    createRoute = (app) => {
        app.get('/api/v1/config/:command', this.authenticateToken, this.route);
    }

    route = (req, res) => {
        const { tokenPayload } = res.locals;
        if(!tokenPayload) {
            res.status(403).json({error: 'Not Authorized'});
            return;
        }

        const { command } = req.params;
        const config = Configs[command];
        res.json({config});
    }
}