import chalk from 'chalk';
import shell from 'shelljs';
import path from 'path';
import fs from 'fs-extra';

export async function dragonflyBuild(ignore: boolean) {
  console.log(chalk.cyan('Dragonfly工程生产构建中...'));
  shell.env.NODE_ENV = 'production';
  const command = ignore? 'npx vite build' : 'npx vue-tsc --noEmit && npx vite build';
  shell.exec(
    command,
    async function (error) {
      await postBuild(error)
    }
  )

}

async function postBuild(err: any) {
  try {
    if (err) {
      console.error(err);
      throw new Error(err);
    }
    await loadScript();
    console.warn(chalk.cyan('生产包构建完毕，所有资源在dist目录下'));
  } catch (e) {
    console.error(chalk.red('构建失败，请查看日志分析原因。', e));
    shell.exit(1);
  }
}

async function loadScript() {
  console.warn('### 加载用户自定义脚本 ###');
  const scriptPath = path.resolve('scripts/postBuild.js');
  if (fs.existsSync(scriptPath)) {
    const userScript = require(scriptPath);
    userScript();
    console.warn('### 用户自定义脚本执行结束 ###')
  }
}