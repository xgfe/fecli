define(['app'], function (app) {
    app.factory('uniqueTemplateDetailService', uniqueTemplateDetailService);

    uniqueTemplateDetailService.$inject = ['$http'];

    function uniqueTemplateDetailService($http) {
        uniqueTemplateDetailService.$http = $http;
        return {
            getDetail
        };
    }

    /**
     * 查询详情
     * @param params
     * @returns {*}
     */
    function getDetail(params) {
        return uniqueTemplateDetailService.$http({
            method: 'get',
            url: basePath + '',
            params: params
        });
    }
});