module.exports = class BotRoute {
    constructor(botClient) {
        this.botClient = botClient;
    }
    
    route = (req, res, next) => {
        throw new Error("Not implemented here");
    }
}