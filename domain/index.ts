import { program } from 'commander';
import packageJson from '../package.json';
import { dragonflyInit } from './dragonfly-init';

console.log('yes');
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

(function() {
  program.parse(process.argv);
})();
