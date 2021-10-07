import { Log, logger } from '../log';
import fs from 'fs';
import { Arguments, CommandModule } from 'yargs';

function main(argv: Arguments & { log?: string }) {
    if (!argv.log) return;

    const logs = logger(argv as { log: string });
    if (logs.isEmpty()) {
        console.log('Nothing to revert');
        return;
    }

    const log = logs.pop();
    if (log.length === 0) {
        console.log('Nothing to revert');
        return;
    }

    const errors: Log[] = [];
    for (const entry of log) {
        try {
            fs.renameSync(entry.newFile, entry.file);
            console.log(`Revert ${entry.newFile} => ${entry.file}`);
        } catch {
            errors.push(entry);
            console.log(`Cannot revert entry ${entry.newFile}`);
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
