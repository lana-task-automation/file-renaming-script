'use strict';

const fs = require('fs');
const path = require('path');

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const logPath = 'renamed.log';
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
                requiresArg: true,
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
            })
            .option('log', {
                describe: 'Log all changes applied',
                boolean: true,
                default: true,
            }),
    })
    .command({
        command: 'revert',
        describe: 'Revert renamed files',
        handler: revert,
    })
    .argv;

function openLogs(argv) {
    if (!argv.log) return [];
    try {
        if (!fs.existsSync(logPath)) fs.writeFileSync(logPath, '[]', 'utf-8');
        const raw = fs.readFileSync(logPath, 'utf-8');
        const logs = JSON.parse(raw);
        if (!Array.isArray(logs)) throw new Error('Invalid logs format');
        return logs;
    } catch {
        console.error('Cannot read log file, please check logs file json format or disable log with --log=false');
        process.exit(1);
    }
}

function revert(argv) {
    argv.log = true;
    const logs = openLogs(argv);
    if (logs.length === 0) {
        console.log('Nothing to revert');
        return;
    }

    const log = logs.pop();
    if (log.length === 0) {
        console.log('Nothing to revert');
        return;
    }

    const errors = [];
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
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2), 'utf-8');
}

function main(argv) {
    function rename(s) {
        if (s == null || s.trim() === '') return;
        if (argv.multi) return s.replace(new RegExp(argv.match, 'g'), argv.rename);
        return argv.regex ? s.replace(new RegExp(argv.match), argv.rename) : s.replace(argv.match, argv.rename);
    }

    const logs = openLogs(argv);
    console.log(`Scanning dir ${argv.dir}`);
    const files = fs.readdirSync(argv.dir);

    if (files.length <= 0) {
        console.log(`No match file in ${argv.dir}`);
        process.exit(0);
    }

    const log = [];
    logs.push(log);
    try {
        for (const name of files) {
            if (name === logPath) continue;

            const newName = rename(name);
            if (newName === name) continue;

            const file = path.resolve(argv.dir, name);
            const newFile = path.resolve(argv.dir, newName);
            fs.renameSync(file, newFile);
            log.push({ file, newFile, time: new Date().toISOString() });
            console.log(`Match ${name} => ${newName}`);
        }
    } finally {
        if (argv.log && log.length > 0) fs.writeFileSync(logPath, JSON.stringify(logs, null, 2), 'utf-8');
    }
    console.log(`Batch rename completed ${argv.dir}`);
}
