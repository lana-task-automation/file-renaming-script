import { fileLogger, Log } from '../log';
import fs from 'fs';
import { Arguments, CommandModule } from 'yargs';
import chalk from 'chalk';

function main(argv: Arguments & { log?: string }) {
    if (!argv.log) return;

    const logs = fileLogger(argv as { log: string });
    if (logs.isEmpty()) {
        console.log(chalk.yellow('Nothing to revert'));
        return;
    }

    const log = logs.pop();
    if (log.length === 0) {
        console.log(chalk.yellow('Nothing to revert'));
        return;
    }

    const errors: Log[] = [];
    for (const entry of log) {
        try {
            fs.renameSync(entry.newFile, entry.file);
            console.log(chalk.green(`Revert ${entry.newFile} => ${entry.file}`));
        } catch {
            errors.push(entry);
            console.log(chalk.yellow(`Cannot revert entry ${entry.newFile}`));
        }
    }
    if (errors.length > 0) logs.push(errors);
    logs.flush();
}

const command: CommandModule = {
    command: 'revert',
    describe: 'Revert renamed files',
    handler: main,
};

export default command;
