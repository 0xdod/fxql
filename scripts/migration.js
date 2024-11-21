const { exec } = require('child_process');

const argv = process.argv.slice(2);
const subcommand = argv[0];
const migrationName = argv[1];

if (!migrationName) {
  console.error('Please provide a migration name');
  process.exit(1);
}

const migrationsDir = 'src/migrations';
const dataSource = 'src/common/config/data_source.ts';

const subcommandsMap = {
  'migration:generate': `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ${migrationsDir}/${migrationName} -d ${dataSource}`,
  'migration:create': `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create ${migrationsDir}/${migrationName}`,
};

const command = subcommandsMap[subcommand];

if (!command) {
  console.error('Invalid subcommand');
  process.exit(1);
}

process.env.FORCE_COLOR = 1;

const child = exec(command);
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

child.on('exit', (code) => process.exit(code));
