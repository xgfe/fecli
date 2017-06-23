define([
    'app'
], function (app) {
    app.controller('uniqueTemplateCtrl', uniqueTemplateCtrl);

    uniqueTemplateCtrl.$inject = ['$uixNotify'];

    function uniqueTemplateCtrl($uixNotify) {
        var vm = this;
        vm.$uixNotify = $uixNotify;
    }

    return {
        _tpl: __inline('./uniqueTemplate.html')
    }
});