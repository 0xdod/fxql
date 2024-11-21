import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

export default (): winston.LoggerOptions => {
  const transports: winston.transport[] = [];

  if (process.env.NODE_ENV !== 'production') {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike('FXQL', {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
    );
  }

  return {
    level: 'info',
    format: winston.format.json(),
    transports,
  };
};
