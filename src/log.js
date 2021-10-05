const fs = require('fs');

function logger(argv) {
    return new FileLogger(argv).open();
}

class FileLogger {
    constructor(argv) {
        this.disabled = !argv.log || argv.log === 'false';
        this.logPath = this.disabled ? '' : argv.log;
        this.logs = [];
    }

    open() {
        if (!this.disabled) return this;

        try {
            if (!fs.existsSync(this.logPath)) fs.writeFileSync(this.logPath, '[]', 'utf-8');
            const raw = fs.readFileSync(this.logPath, 'utf-8');
            const logs = JSON.parse(raw);
            if (!Array.isArray(logs)) throw new Error('Invalid logs format');
            this.logs = logs;
            return this;
        } catch {
            console.error('Cannot read log file, please check logs file json format or disable log with --log=false');
            process.exit(1);
        }
        return this;
    }

    path() {
        return this.logPath;
    }

    flush() {
        if (this.disabled) return;
        fs.writeFileSync(this.logPath, JSON.stringify(this.logs, null, 2), 'utf-8');
    }

    push(log) {
        this.logs.push(log);
    }

    pop() {
        return this.logs.pop();
    }
}

module.exports = {
    logger,
};
