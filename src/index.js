'use strict';

const fs = require('fs');
const path = require('path');

const yargs = require('yargs/yargs');
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
        describe: 'Replace all match',
        boolean: true,
        default: true,
    })
    .argv;
