import pino from "pino";

const isDebug = process.env.APP_DEBUG === "true" || process.env.APP_DEBUG === "1";

export const logger = pino({
    level: isDebug ? "debug" : "info",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:standard",
            singleLine: true,
            ignore: "pid,hostname",
            errorProps: "type,message,stack,name,status,code",
        },
    },
});
