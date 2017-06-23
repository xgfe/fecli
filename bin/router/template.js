define(['app'], function (app) {
    app.config(configure);

    configure.$inject = ['$stateProvider'];

    function configure($stateProvider) {

        $stateProvider
            .state('app.uniqueTemplate', {
                abstract: true,
                url: '/uniqueTemplate',
                template: '<div ui-view class="fade-in-down"></div>'
            });
    }
});