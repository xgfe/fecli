define(['app'], function (app) {
    app.factory('uniqueTemplateService', uniqueTemplateService);

    uniqueTemplateService.$inject = ['$http'];

    function uniqueTemplateService($http) {
        uniqueTemplateService.$http = $http;
        return {
            searchPageList
        };
    }

    /**
     * 查询列表页
     * @param params
     * @returns {*}
     */
    function searchPageList(params) {
        return uniqueTemplateService.$http({
            method: 'get',
            url: basePath + '',
            params: params
        });
    }
});