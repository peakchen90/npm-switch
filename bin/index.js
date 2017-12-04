#!/usr/bin/env node
var argv = require('yargs')
  .option('n', {
    alias: 'npm',
    describe: '切换到 npm.org 镜像',
    boolean: true
  })
  .option('t', {
    alias: 'taobao',
    describe: '切换到 npm.taobao.org 镜像',
    boolean: true
  })
  .help('h')
  .alias('h', 'help')
  .example('npm-switch -n\nnpm-switch --taobao')
  .argv

var npm = argv.npm
var taobao = argv.taobao
var shell = require('shelljs')
var chalk = require('chalk')
var inquirer = require('inquirer')

if (npm) {
  changeRegistry('npm')
} else if (taobao) {
  changeRegistry('taobao')
} else {
  inquirer.prompt({
    type: 'list',
    name: 'registry',
    message: 'please choose a registry',
    choices: ['✔ Taobao (https://registry.npm.taobao.org)', '✔ Npm (https://registry.npmjs.org)'],
    suffix: ' ✍ '
  }).then(answer => {
    var registry = answer.registry
    registry = registry.split(' ')[1] || ''
    console.log(chalk.yellow('please wait...'))
    changeRegistry(registry.toLowerCase())
  })
}

/**
 * 切换镜像
 */
function changeRegistry(registry) {
  var ret
  if (registry === 'taobao') {
    ret = shell.exec('npm config set registry https://registry.npm.taobao.org')
  } else if (registry === 'npm') {
    ret = shell.exec('npm config set registry https://registry.npmjs.org')
  }
  if (!ret) {
    console.log(chalk.bgRed.black(' FAILURE ') + chalk.red('unknown registry'))
  }
  if (ret.code === 0) {
    console.log(chalk.bgGreen.black(' SUCCESS ') + chalk.green(getRegistry()))
  } else {
    console.log(chalk.bgRed.black(' FAILURE ') + chalk.red('set npm registry failure'))
  }
}

/**
 * 获取仓库镜像
 */
function getRegistry() {
  var s = shell.exec('npm config get registry')
  if (s.code === 0) {
    return ' npm registry: ' + s.stdout
  }
}
