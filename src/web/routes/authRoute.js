const BotRoute = require('./botRoute');
const Token = require('../token')

module.exports = class AuthRoute extends BotRoute {
    constructor(botClient) {
        super(botClient);
    }

    authenticateToken = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if(token == null)
        {
            return res.sendStatus(401);
        }

        const payload = Token.verify(token);
        this.botClient.authTable().isTokenValid(token).then(isValid => {
            if(!isValid)
                return res.sendStatus(403);
            else 
            {
                res.locals.tokenPayload = payload;
                next();
            }
        }).catch(err => {
            return res.sendStatus(500);
        });
    }
}