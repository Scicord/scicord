module.exports = class BotRoute {
    constructor(botClient) {
        this.botClient = botClient;
    }
    
    createRoutes = (app) => {
        throw new Error("Not implemented here");
    }
}