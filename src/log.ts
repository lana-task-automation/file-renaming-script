import fs from 'fs';

export function fileLogger(argv: { log: string }) {
    return new FileLogger(argv).open();
}

export interface Log {
    time: string;
    file: string;
    newFile: string;
}

class FileLogger {
    private readonly disabled: boolean;
    private readonly logPath: string;
    private readonly logs: Log[][];

    constructor(argv: { log: string }) {
        this.disabled = !argv.log || argv.log === 'false';
        this.logPath = this.disabled ? '' : argv.log;
        this.logs = [];
    }

    open(): this {
        if (this.disabled) return this;

        try {
            if (!fs.existsSync(this.logPath)) fs.writeFileSync(this.logPath, '[]', 'utf-8');
            const raw = fs.readFileSync(this.logPath, 'utf-8');
            const logs = JSON.parse(raw);
            if (!Array.isArray(logs)) throw new Error('Invalid logs format');
            this.logs.push(...logs);
            return this;
        } catch {
            console.error('Cannot read log file, please check logs file json format or disable log with --log=false');
            process.exit(1);
        }
        return this;
    }

    path(): string {
        return this.logPath;
    }

    isEmpty(): boolean {
        return this.logs.length === 0;
    }

    flush() {
        if (this.disabled) return;
        fs.writeFileSync(this.logPath, JSON.stringify(this.logs, null, 2), 'utf-8');
    }

    push(log: Log[]): this {
        this.logs.push(log);
        return this;
    }

    pop(): Log[] {
        return this.logs.pop() ?? [];
    }
}
