import { Request, Response, NextFunction } from 'express';

export class Logger {
    private static formatTime(): string {
        return new Date().toISOString();
    }

    static info(message: string, context: string = 'General') {
        console.log(`[${this.formatTime()}] [INFO] [${context}] ${message}`);
    }

    static error(message: string, context: string = 'General') {
        console.error(`[${this.formatTime()}] [ERROR] [${context}] ${message}`);
    }

    static debug(message: any, context: string = 'General') {
        if (process.env.DEBUG === 'true') {
            console.log(`[${this.formatTime()}] [DEBUG] [${context}]`, message);
        }
    }

    static middleware(req: Request, res: Response, next: NextFunction) {
        const start = Date.now();
        const { method, url, body } = req;

        // Log request
        this.info(`${method} ${url}`, 'INBOUND');
        if (body && Object.keys(body).length) {
            this.debug(body, 'REQ-BODY');
        }

        // Wrap res.send to log response
        const oldSend = res.send;
        res.send = function (data) {
            const duration = Date.now() - start;
            Logger.info(`${method} ${url} - ${res.statusCode} (${duration}ms)`, 'OUTBOUND');
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    Logger.debug(parsed, 'RES-BODY');
                } catch (e) {
                    Logger.debug(data, 'RES-BODY');
                }
            }
            return oldSend.apply(res, arguments as any);
        };

        next();
    }
}
