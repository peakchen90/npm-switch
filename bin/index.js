#!/usr/bin/env node

var argv = require('yargs')
  .option('o', {
    alias: 'official',
    describe: '切换到NPM官方镜像',
    boolean: true
  })
  .option('t', {
    alias: 'taobao',
    describe: '切换到淘宝镜像',
    boolean: true
  })
  .option('v', {
    alias: 'version',
    describe: '查看版本信息',
    boolean: true
  })
  .help('h')
  .alias('h', 'help')
  .example('npm-switch #choose with keyboard\nnpm-switch -o\nnpm-switch --taobao')
  .argv

var shell = require('shelljs')
var chalk = require('chalk')
var inquirer = require('inquirer')

// 仓库地址
var registryMap = {
  npm: {
    official: 'https://registry.npmjs.org',
    taobao: 'https://registry.npmmirror.com'
  },
  yarn: {
    official: 'https://registry.yarnpkg.com',
    taobao: 'https://registry.npmmirror.com'
  }
}

// show version
if(argv.version) {
  console.log(require('../package.json').version);
  process.exit(0);
}

// check if installed yarn
var isInstalledYarn = !!shell.which('yarn');

if (argv.official) {
  changeRegistry('official')
} else if (argv.taobao) {
  changeRegistry('taobao')
} else {
  var choices = ['✔ Taobao (' + registryMap.npm.taobao + ')']
  if (isInstalledYarn) {
    choices.push('✔ Official (' + registryMap.npm.official + ' | ' + registryMap.yarn.official + ')')
  } else {
    choices.push('✔ Official (' + registryMap.npm.official + ')')
  }

  inquirer.prompt({
    type: 'list',
    name: 'registry',
    message: 'please choose a registry',
    choices: choices,
    suffix: ' ✍ '
  }).then(answer => {
    var registry = answer.registry
    registry = registry.split(' ')[1] || ''
    console.log(chalk.yellow('please wait...'))
    changeRegistry(registry.toLowerCase())
  })
}

/**
 * 切换npm镜像
 * @param {String} registry
 */
function changeRegistry(registry) {
  if (!registry) {
    console.log(chalk.bgRed.black(' FAILURE ') + chalk.red('unknown registry'))
    return
  }

  var ret = shell.exec('npm config set registry ' + registryMap.npm[registry])
  if (ret.code === 0) {
    console.log(chalk.bgGreen.black(' SUCCESS ') + chalk.green(getRegistry('npm')))
  } else {
    console.log(chalk.bgRed.black(' FAILURE ') + chalk.red('set npm registry failure'))
  }

  // change yarn registry
  if (isInstalledYarn) {
    changeYarnRegistry(registry);
  }
  process.exit(0);
}

/**
 * 切换yarn镜像
 * @param {String} registry
 */
function changeYarnRegistry(registry) {
  console.log(chalk.yellow('Yarn registry changing...'))
  if (!registry) {
    console.log(chalk.bgRed.black(' FAILURE ') + chalk.red('unknown registry'))
    return
  }

  var ret = shell.exec('yarn config set registry ' + registryMap.yarn[registry])
  if (ret.code === 0) {
    console.log(chalk.bgGreen.black(' SUCCESS ') + chalk.green(getRegistry('yarn')))
  } else {
    console.log(chalk.bgRed.black(' FAILURE ') + chalk.red('set yarn registry failure'))
  }
}

/**
 * 获取仓库镜像
 */
function getRegistry(type) {
  if (type === 'npm') {
    var s = shell.exec('npm config get registry')
    if (s.code === 0) {
      return ' npm registry: ' + s.stdout
    }
  } else if (type === 'yarn') {
    var s = shell.exec('yarn config get registry')
    if (s.code === 0) {
      return ' yarn registry: ' + s.stdout
    }
  }
  return '';
}
