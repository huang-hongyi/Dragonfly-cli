import { program } from 'commander';
import packageJson from '../package.json';
import { dragonflyInit } from './dragonfly-init';
import { dragonflyBuild } from './dragonfly-build';
import { dragonflyStart } from './dragonfly-start';

program.version(`Dragonfly-cli ${packageJson.version}`).usage('<命令名称> [参数]');

program
  .command('init')
  .arguments('[dirName]')
  .usage('<项目名称>')
  .option('--template <template>', '初始化模板', false)
  .option('--directory <directory>', '存储文件夹', false)
  .action((dirName, options) => {
    dragonflyInit(dirName, options);
  });

 program
  .command('build')
  .option('--ignore', '忽略build文件强校验')
  .action(({ignore}) => {
    dragonflyBuild(ignore);
  });

program
  .command('start')
  .action(() => {
    dragonflyStart();
  });

(function exec() {
  program.parse(process.argv);
})();
