import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import rename from './commands/rename';
import revert from './commands/revert';

yargs(hideBin(process.argv))
    .command(rename)
    .command(revert)
    .option('log', {
        describe: 'Log all changes applied, set to false to disable',
        requiresArg: true,
        default: 'renamed.log',
    })
    .argv;





