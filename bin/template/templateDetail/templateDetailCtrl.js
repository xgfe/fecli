define(['./templateDetailService'], function () {
    const template = __inline('./templateDetail.html');

    class uniqueTemplateDetailCtrl {
        static  $inject = ['uniqueTemplateDetailService', '$uixModalInstance'];

        constructor(uniqueTemplateDetailService, $uixModalInstance) {
            this.uniqueTemplateDetailService = uniqueTemplateDetailService;
            this.$uixModalInstance = $uixModalInstance;

            this.getDetail();
        }

        // 获取详情
        getDetail(id) {
            this.uniqueTemplateDetailService.getDetail(id).then(({data: {status, message, data}}) => {
                if (status) {
                    this.detail = data;
                }
            });
        }

        cancel() {
            this.$uixModalInstance.dismiss('cancel');
        }
    }

    return {
        template,
        controllerAs: 'vm',
        controller: uniqueTemplateDetailCtrl
    };
});
