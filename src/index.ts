import { Log, logger } from './log';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
    .command({
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
    })
    .command({
        command: 'revert',
        describe: 'Revert renamed files',
        handler: revert,
    })
    .option('log', {
        describe: 'Log all changes applied, set to false to disable',
        requiresArg: true,
        default: 'renamed.log',
    })
    .argv;


function revert(argv: { log: string }) {
    const logs = logger(argv);
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
