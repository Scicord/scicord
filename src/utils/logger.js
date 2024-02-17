const log4js = require('log4js');

log4js.configure({
    appenders: {
        out: {
            type: 'stdout',
            layout: { 
                type: 'pattern',
                pattern: '%d | [%p] %f:%l | %m'
            }            
        }
    },
    categories: {
        default: {
            enableCallStack: true,
            appenders: [ 'out' ],
            level: 'info'
        }
    },
})

module.exports = () => {
    const logger = log4js.getLogger();
    return logger;
};