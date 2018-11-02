/**
 * @file 用于直接创建项目模块目录的命令,
 *       包括controller,service,html已经对应的router
 * @date 2018-3-21
 * @author zhouxiong03 (zhouxiong03@meituan.com)
 * @name  fecli
 * @example fecli create stockIn/purchaseStorage
 * 表示在入库管理下创建一个采购入库模块
 */

var fs = require('fs');
var path = require('path');

var fecli = {};

/**
 * 创建目录
 */
fecli.createModule = function () {
    if (arguments.length == 2) {
        var firstPath = arguments[0];
        var secondPath = arguments[1];
        fs.exists(firstPath, function (exists) {
            if (!exists) {
                fs.mkdir(firstPath, function (error) {
                    if (error) {
                        throw error;
                    }
                    fs.exists(secondPath, function (innerExists) {
                        if (!innerExists) {
                            fs.mkdir(secondPath, function (err) {
                                if (err) {
                                    throw err;
                                }
                                // 模板文件移动至新增模块下
                                fecli.moveToModule(secondPath);
                                // 改变路由
                                var firstArr = firstPath.split('/');
                                var secondArr = secondPath.split('/');
                                var firstModule = firstArr[firstArr.length - 1];
                                var secondModule = secondArr[secondArr.length - 1];
                                fecli.changeRouter(firstModule, secondModule);
                            });
                        }
                    });
                });
            } else {
                fs.exists(secondPath, function (innerExists) {
                    if (!innerExists) {
                        fs.mkdir(secondPath, function (err) {
                            if (err) {
                                throw err;
                            }
                            // 模板文件移动至新增模块下
                            fecli.moveToModule(secondPath);
                            // 改变路由
                            var firstArr = firstPath.split('/');
                            var secondArr = secondPath.split('/');
                            var firstModule = firstArr[firstArr.length - 1];
                            var secondModule = secondArr[secondArr.length - 1];
                            fecli.changeRouter(firstModule, secondModule);
                        });
                    }
                });
            }
        });
    } else {
        var firstPath = arguments[0];
        fs.exists(firstPath, function (exists) {
            if (!exists) {
                fs.mkdir(firstPath, function (err) {
                    if (err) {
                        throw err;
                    }
                });
            }
        });
    }
};

/**
 * 将模板文件复制指定的目录下
 * @param targetPath 目标目录
 */
fecli.moveToModule = function (targetPath) {
    var tempPath = path.resolve(__dirname, './template');
    fs.access(targetPath, function (err) {
        if (err) {
            fs.mkdirSync(targetPath);
        }
        fs.readdir(tempPath, function (err, paths) {
            if (err) {
                throw err;
            } else {
                var moduleArr = targetPath.split('/');
                var moduleName = moduleArr[moduleArr.length - 1];
                paths.forEach(function (path) {
                    var _src = tempPath + '/' + path;
                    path = path.replace('template', moduleName);
                    var _dist = targetPath + '/' + path;
                    fecli.copyFile(_src, _dist, moduleName, false);
                });
            }
        });
    });
};

/**
 * 文件复制,根据flag判断是否更改文件内容
 * @param src 源文件路径
 * @param dist 目标文件路径
 * @param moduleName 模块名称
 * @parma flag 标志位
 */
fecli.copyFile = function (src, dist, firstModule, secondModule, flag) {
    fs.stat(src, function (err, stat) {
        var readable, result;
        if (err) {
            throw err;
        } else {
            if (stat.isFile()) {
                var chunks = [];
                readable = fs.createReadStream(src);
                readable.on('data', function (chunk) {
                    chunks.push(chunk);
                });

                readable.on('end', function () {
                    result = chunks.toString('utf-8');
                    if(flag){
                        var appendArr = [];
                        appendArr.push('.state(\'app.' + firstModule + '.' + secondModule + '\', {');
                        appendArr.push('    url: \'/' + secondModule + '\',');
                        appendArr.push('    templateProvider: tplProvider(\'' + firstModule + '/' + secondModule + '/' + secondModule + 'Ctrl' + '\')');
                        appendArr.push('})');

                        var index = result.indexOf('});');
                        var preStr = result.substring(0, index + 2);
                        var afterStr = result.substring(index + 2);

                        result = preStr + '\n' + appendArr.join('\n') + afterStr;
                    }
                    result = result.replace(/uniqueTemplate/g, firstModule);
                    fs.writeFileSync(dist, result);
                });
            }
        }
    });
};

/**
 * 改变对应的路由信息
 * 如果一二级模块都是新增的,则需要修改路由入口文件routers.js,然后修改模块路由文件
 * 如果是新增二级模块,则只需要修改模块路由文件
 * @param firstModule 一级模块名称
 * @param secondModule 二级模块名称
 */
fecli.changeRouter = function (firstModule, secondModule) {
    // 1.遍历所有路由文件
    var projectPath = process.cwd();
    var routerPath = path.resolve(projectPath, 'src/app/Router');
    fs.readdir(routerPath, function (err, paths) {
        if (err) {
            throw err;
        } else {
            var flag = false;
            paths.forEach(function (path) {
                if (path.indexOf(firstModule) >= 0) {
                    flag = true;
                }
            });
            var baseRouter = routerPath + '/routers.js';
            var modifyRouterPath = routerPath + '/' + firstModule + '.js';
            // 新增一级模块,则修改router.js并创建新的路由文件
            if (!flag) {
                // 修改主路由文件
                fecli.modifyBaseRouter(baseRouter, firstModule);
                // 创建模块路由文件
                fecli.createRouter(routerPath, firstModule, secondModule);
            } else {
                // 新增二级模块,则修改原有的路由文件
                fecli.modifyModuleRouter(modifyRouterPath, firstModule, secondModule);
            }
        }
    });
};

/**
 * 修改主路由文件
 * @param baseRouter 主路由文件
 * @param firstModule 一级模块名称
 */
fecli.modifyBaseRouter = function (baseRouter, firstModule) {
    var routerBuffer = fs.readFileSync(baseRouter);
    var routerStr = routerBuffer.toString('utf-8');
    var begin = routerStr.indexOf('[');
    var end = routerStr.indexOf(']');
    var preStr = routerStr.substring(0, begin + 1);
    var midStr = routerStr.substring(begin + 1, end);
    var afterStr = routerStr.substring(end);
    var dealArr = midStr.split('\n');
    var lastItem = dealArr[dealArr.length - 1];
    if (!lastItem || !lastItem.length) {
        dealArr[dealArr.length - 2] = dealArr[dealArr.length - 2] + ',';
    } else {
        lastItem = lastItem + ',';
    }
    var insertStr = '    \'.\/' + firstModule + '\'';
    dealArr.splice(dealArr.length - 1, 0, insertStr);
    midStr = dealArr.join('\n');
    var resultStr = preStr + midStr + afterStr;
    fs.writeFileSync(baseRouter, resultStr);
};

/**
 * 创建新的路由文件
 * @param routerPath 路由文件目录
 * @param firstModule 模块名称
 */
fecli.createRouter = function (routerPath, firstModule, secondModule) {
    var templateRouter = path.resolve(__dirname, './router/template.js');
    var targetPath = routerPath + '/' + firstModule + '.js';
    fecli.copyFile(templateRouter, targetPath, firstModule, secondModule, true);
};

/**
 * 修改已有的路由文件
 * @param routerPath 模块路由文件
 * @param secondModule 二级模块名称
 */
fecli.modifyModuleRouter = function (routerPath, firstModule, secondModule) {
    fecli.copyFile(routerPath, routerPath, firstModule, secondModule, true);
};


module.exports = fecli;