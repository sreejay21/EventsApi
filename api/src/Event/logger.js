const {createLogger,transports,format} = require('winston')

const eventLogger =createLogger({
    transports:[
        new transports.File({
            filename:"events.log",
            level:'info',
            format:format.combine(format.timestamp(),format.json())
        })
    ]

})
const errorLogger = createLogger({
    transports: [
      new transports.File({
        filename: 'events-error.log',
        level: 'error',
        format: format.combine(format.timestamp(), format.json())
      })
    ]
  });

module.exports={eventLogger,errorLogger}