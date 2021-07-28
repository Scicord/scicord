const BotRoute = require("./botRoute");
const token = require('../token');

module.exports = class CreateUserToken extends BotRoute {
    constructor(botClient) {
        super(botClient);
    }

    createRoute = (app) => {
        app.post('/api/v1/createUserToken', this.route);
    }

    route = (req, res) => {
        // OK! First let's check the parameters
        const {guild, user, otp} = req.body;
        const guildObject = this.botClient.client.guilds.cache.get(guild);
        if(!guildObject)
        {
            res.status(404).json({error: `Unknown guild ${guild}`});
            return;            
        }

        const member = guildObject.members.cache.get(user);
        if(!member)
        {
            res.status(404).json({error: `Unknown member ${user}`});
            return;
        }

        // If the member isn't authorized to request this, stop.
        if(!member.hasPermission('BAN_MEMBERS'))
        {
            res.status(403).json({error: `Permission denied`});
            return;
        }

        this.botClient.authTable().getValidToken(guild, user).then(tokens => {
            let r = tokens.filter(tok => tok.otp === otp);
            if(r.length == 0) {
                res.status(403).json({error: `Invalid OTP`});
                return;
            }

            // Otherwise, generate the token...
            const webToken = token.generateAPIToken(guild, user, otp);
            this.botClient.authTable().updateToken(guild, user, otp, webToken);
            res.json({token: webToken});
        })
    }
}