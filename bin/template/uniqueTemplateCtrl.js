define([
    'app',
    './uniqueTemplateDetail/uniqueTemplateDetailCtrl',
    './uniqueTemplateService'
], function (app, uniqueTemplateDetailCtrl) {
    class uniqueTemplateCtrl {
        static $inject = ['Page', 'uniqueTemplateService', 'cacheParams', '$uixModal'];

        constructor(...args) {
            let [Page, uniqueTemplateService, cacheParams, $uixModal] = args;

            Page.setTitle('');
            this.uniqueTemplateService = uniqueTemplateService;
            this.$uixModal = $uixModal;

            this.getInitOriginParams();

            this.pages = cacheParams.getPages() || {
                pageNo: 1,
                pageSize: 20
            };

            this.params = cacheParams.getParams() || this.getInitParams();

            uniqueTemplateDetailCtrl.controller.prototype.parentVM = this;
        }

        // 获取发送请求的参数
        getSendParams() {
            let params = {};
            this.sendParams = params;
            return params;
        }

        // 初始化加载请求
        searchHandler() {
            this.pages.pageNo = 1;
            const params = this.getSendParams();
            this.sendRequest(params);
        }

        // 发送请求
        sendRequest(params) {
            this.tableLoader = 1;
            this.uniqueTemplateService.searchPageList(params).then(({data: {data, status}}) => {
                if (status) {
                    this.itemList = data.pageContent;
                    if(this.itemList && this.itemList.length) {
                        this.tableLoader = 0;
                        this.pages.pageNo = data.page.currentPageNo;
                        this.pages.pageSize = data.page.pageSize;
                        this.pages.totalCount = data.page.totalCount;
                    } else {
                        this.tableLoader = 2;
                    }
                } else {
                    this.tableLoader = -1;
                }
            }, () => this.tableLoader = -1);
        }

        // 新增
        addHandler() {
            this.$uixModal.open({
                ...uniqueTemplateDetailCtrl
            });
        }

        // 初始化参数
        getInitParams() {
            return {};
        }

        // 初始化集合类参数
        getInitOriginParams() {
            this.tableLoader = 0;

            this.dateFormat = {
                ymd: 'yyyy-MM-dd',
                ymdhms: 'yyyy-MM-dd HH:mm:ss'
            };
        }

        // 重置
        resetHandler() {
            this.params = this.getInitParams();
        }

        // 分页
        pageChanged() {
            this.sendParams.pageNo = this.pages.pageNo;
            this.sendRequest(this.sendParams);
        }
    }

    app.controller('uniqueTemplateCtrl', uniqueTemplateCtrl);

    return {
        _tpl: __inline('./uniqueTemplate.html')
    };
});