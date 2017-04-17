#!/usr/bin/env node
const argv = require('yargs')
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
  .choices('i',['a','b','c'])
  .help('h')
  .alias('h', 'help')
  .usage('npm-switch [option]')
  .argv

const { npm, taobao } = argv
const shell = require('shelljs')
const chalk = require('chalk')

if (npm) {
  let s = shell.exec('npm config set registry https://registry.npmjs.org')
  if (s.code === 0) {
    console.log(chalk.bgGreen.black(' SUCCESS ') + chalk.green(getRegistry()))
  } else {
    console.log(chalk.bgRed.black(' FAILURE ') + chalk.red('set npm registry failure'))
  }
} else {
  let s = shell.exec('npm config set registry https://registry.npm.taobao.org')
  if (s.code === 0) {
    console.log(chalk.bgGreen.black(' SUCCESS ') + chalk.green(getRegistry()))
  } else {
    console.log(chalk.bgRed.black(' FAILURE ') + chalk.red('set npm registry failure'))
  }
}

/**
 * 获取仓库镜像
 */
function getRegistry() {
  let s = shell.exec('npm config get registry')
  if (s.code === 0) {
    return ' npm registry: ' + s.stdout
  }
}
