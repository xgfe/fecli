#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var path = require('path');
var fecli = require('./fecli');

program
    .version('0.1.0')
    .option('-m, --module <value>', '创建新的模块', create)
    .parse(process.argv);

function create(value) {
    var projectPath = process.cwd();
    var basePath = path.resolve(projectPath, 'src/app/Modules');
    if (value.indexOf('/') >= 0) {
        // 二级模块
        var firstLevel = value.split('/')[0];
        var secondLevel = value.split('/')[1];
        var firstPath = basePath + '/' + firstLevel;
        var secondPath = firstPath + '/' + secondLevel;
        fecli.createModule(firstPath, secondPath);
    } else {
        // 一级模块
        var firstPath = basePath + '/' + value;
        fecli.createModule(firstPath);
    }
}










