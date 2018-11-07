define(['./uniqueTemplateDetailService'], function () {
    const template = __inline('./uniqueTemplateDetail.html');

    class uniqueTemplateDetailCtrl {
        static  $inject = ['uniqueTemplateDetailService', '$uixModalInstance'];

        constructor(uniqueTemplateDetailService, $uixModalInstance) {
            this.uniqueTemplateDetailService = uniqueTemplateDetailService;
            this.$uixModalInstance = $uixModalInstance;

            this.getDetail();
        }

        // 获取详情
        getDetail(id) {
            this.uniqueTemplateDetailService.getDetail(id).then(({data: {status, data}}) => {
                if (status) {
                    this.detail = data;
                }
            });
        }

        // 确定
        ok() {
            this.$uixModalInstance.close();
        }

        // 取消
        cancel() {
            this.$uixModalInstance.close();
        }
    }

    return {
        template,
        controllerAs: 'vm',
        controller: uniqueTemplateDetailCtrl
    };
});