import { DragonfyInitOptions } from '../models/cli';
import { queryNpmPackageUrl } from '../utils/util';
import chalk from 'chalk';
import path from 'path';
import ora from 'ora';
import inquirer  from 'inquirer';
import tar from 'tar';
import shell from 'shelljs';


export async function dragonflyInit(dirName: string, options: DragonfyInitOptions) {
  const spinner = ora('');
  if (!dirName && !options.directory) {
    console.warn(chalk.red('无法获取项目名称，请提供期望的项目名称：dgf init <projectName>'));
    return;
  }
  const projectPath = options.directory || path.resolve(process.cwd(), path.join('.', dirName));
  console.warn(`项目目录是：${projectPath}`);
  const packageUrl = await getDownloadUrl(spinner);
  mkdir(projectPath);
  downloadFile(packageUrl, projectPath)
    .then(() => {
      spinner.succeed(chalk.cyan(`项目已下载至: ${projectPath}`));
      console.warn('进入项目中执行以下命令开启调试： ');
      console.log(chalk.cyan('npm install'));
      console.log(chalk.cyan('npm run start'));
    })
    .catch((e) => {
      spinner.fail(chalk.red('初始化失败： '));
      console.warn(e.message);
    })
}

function mkdir(projectPath: string) {
  shell.mkdir(projectPath);
  shell.chmod('-R', 755, projectPath);
}

function downloadFile(url: string, target: string) {
  return new Promise((resolve, reject) => {
    const request = url.includes('https') ? require('https') : require('http');
    request.get(url, (response: any) => {
      if (response.statusCode === 302) {
        request.get(response.headers.location, (response: any) => {
          unzipReponse(response, target, resolve, reject)
        });
      } else if (response.statusCode === 200) {
        unzipReponse(response, target, resolve, reject)
      } else {
        reject(new Error(`[${response.statusCode}] ${response.statusMessage}`));
      }
    })
  })
}

function unzipReponse(response: any, target: string, resolve: (value: unknown) => void, reject: (value: unknown) => void) {
  response.pipe(
    tar.x({
      strip: 1,
      C: target,
    }),
  )
  .on('error', (e: any) => reject(e))
  .on('end', () => {
    resolve(null);
  });
}

async function getDownloadUrl(spinner: ora.Ora) {
  const { useDefault } = await inquirer.prompt([
    {
      type: 'confirm',
      message: '使用系统预置模板',
      name: 'useDefault'
    }
  ]);
  if (useDefault) {
    return getUrlFromPackageName('@dragonfly-js/seed', spinner);
  } else {
    const { custom } = await inquirer.prompt([
      {
        type: 'input',
        message: '请输入自定义npm包名',
        name: 'custom',
      }
    ]);
    return getUrlFromPackageName(custom, spinner);
  }
}

function getUrlFromPackageName(packageName: string, spinner: ora.Ora): string {
  try {
    let packageUrl = queryNpmPackageUrl(packageName);
    spinner.succeed(chalk.cyan(`查询成功，package地址为${packageUrl}`));
    return packageUrl
  } catch(e) {
    spinner.fail(chalk.red(`查询失败，不存在${packageName} npm包`));
    return '';
  }
}