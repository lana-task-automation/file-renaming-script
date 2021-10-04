'use strict';

const fs = require('fs');
const path = require('path');

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv))
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
    .argv;

function rename(s) {
    if (s == null || s.trim() === '') return;
    if (argv.multi) return s.replace(new RegExp(argv.match, 'g'), argv.rename);
    return argv.regex ? s.replace(new RegExp(argv.match), argv.rename) : s.replace(argv.match, argv.rename);
}

console.log(`Scanning dir ${argv.dir}`);
const files = fs.readdirSync(argv.dir);
files.forEach(name => {
    const newName = rename(name);
    if (newName === name) return;

    const file = path.resolve(argv.dir, name);
    const newFile = path.resolve(argv.dir, newName);
    fs.renameSync(file, newFile);
    console.log(`Match ${name} => ${newName}`);
});
console.log(`Batch rename completed ${argv.dir}`);
