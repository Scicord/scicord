const filtrex = require('filtrex');

module.exports = class CommandConfig {
    constructor(configProps)
    {
        const { botPermissionsToExecute, userExecuteExpression, ...rest } = configProps;
        this.botPermissionsToExecute = botPermissionsToExecute;
        this.userExecuteExpression = userExecuteExpression
        this.props = rest;
    }

    getExpressionContext = (guildMember) => {
        return {
            hasRole: (roleName) => {
                return guildMember.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase())
            },
            hasPermission: (permissionName) => {
                return guildMember.hasPermission(permissionName);
            },
            hasNitro: () => {
                return guildMember.premiumSince() != null;
            }
        }
    }

    getConfig = () => {
        return this.props;
    }

    getBotPermissionsToExecute = () => {
        return this.botPermissionsToExecute;
    }

    getUserPermissionFn = (guildMember) => {
        return this.permissionFn(this.userExecuteExpression, guildMember);
    }

    permissionFn = (expr, guildMember) => {
        const f = filtrex.compileExpression(expr, {extraFunctions: this.getExpressionContext(guildMember)});
        return () => f();
    }
}