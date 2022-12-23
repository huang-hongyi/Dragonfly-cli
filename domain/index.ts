import { program } from 'commander';
import chalk from 'chalk';
import packageJson from '../package.json';
import { dragonflyInit } from './dragonfly-init';
import { dragonflyBuild } from './dragonfly-build';
import { dragonflyStart } from './dragonfly-start';

program.version(`Dragonfly-cli ${packageJson.version}`).usage('<命令名称> [参数]');

program
  .command('init')
  .description(chalk.green('创建新项目'))
  .arguments('[dirName]')
  .usage('<项目名称>')
  .option('--template <template>', '初始化模板', false)
  .option('--directory <directory>', '存储文件夹', false)
  .action((dirName, options) => {
    dragonflyInit(dirName, options);
  });

program
  .command('start')
  .description(chalk.green('本地开发调试'))
  .action(() => {
    dragonflyStart();
  });

 program
  .command('build')
  .description(chalk.green('生产构建'))
  .option('--ignore', '忽略build文件强校验')
  .action(({ignore}) => {
    dragonflyBuild(ignore);
  });



(function() {
  program.parse(process.argv);
})();
