import { CommandModule } from 'yargs';
import { Log, logger } from '../log';
import fs from 'fs';
import path from 'path';

function main(argv) {
    function rename(s) {
        if (s == null || s.trim() === '') return;

        const newName = argv.rename ?? '';
        if (argv.multi) return s.replace(new RegExp(argv.match, 'g'), newName);
        return argv.regex ? s.replace(new RegExp(argv.match), newName) : s.replace(argv.match, newName);
    }

    const logs = logger(argv);
    console.log(`Scanning dir ${argv.dir}`);
    const files = fs.readdirSync(argv.dir);

    if (files.length <= 0) {
        console.log(`No match file in ${argv.dir}`);
        process.exit(0);
    }

    const log: Log[] = [];
    try {
        for (const name of files) {
            if (name === logs.path()) continue;

            const newName = rename(name);
            if (newName === name) continue;

            const file = path.resolve(argv.dir, name);
            const newFile = path.resolve(argv.dir, newName);
            fs.renameSync(file, newFile);
            log.push({ file, newFile, time: new Date().toISOString() });
            console.log(`Match ${name} => ${newName}`);
        }
    } finally {
        logs.push(log);
        logs.flush();
    }
    console.log(`Batch rename completed ${argv.dir}`);
}

const command: CommandModule = {
    command: ['rename', '$0'],
    describe: 'Batch rename files',
    handler: main,
    builder: (yargs) => yargs
        .option('dir', {
            alias: 'd',
            describe: 'The target directory',
            default: '.',
            requiresArg: true,
            normalize: true,
        })
        .option('match', {
            alias: 'm',
            describe: 'The string to match in filename',
            demandOption: true,
            requiresArg: true,
        })
        .option('rename', {
            alias: 'r',
            describe: 'The string to rename to in filename',
            demandOption: true,
            type: 'string',
        })
        .option('regex', {
            describe: 'Use regex for matching string',
            boolean: true,
            default: false,
        })
        .option('multi', {
            describe: 'Use regex for matching string, and replace all match',
            boolean: true,
            default: false,
        }),
};

export default command;
