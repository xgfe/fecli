define(['app'], function (app) {
    app.factory('templateService', templateService);

    templateService.$inject = ['$http'];

    function templateService($http) {
        templateService.$http = $http;
        return {};
    }
});