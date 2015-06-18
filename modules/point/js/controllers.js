'use strict'

//账户总览
storeApp.register.controller('account', ['$scope', 'accountService',
    function($scope, accountService) {
        // 获取商户ID
        var merchantInfo = JSON.parse(localStorage.getItem('uinfo'));
        var merchantId = 0;
        if (typeof merchantInfo !== "undefined") {
            merchantId = merchantInfo.merchantID;
        }

        $scope.currentPage = 1;
        $scope.totalPage = 1;
        $scope.pageSize = 10;
        $scope.pages = [];
        $scope.endPage = 1;

        $scope.load = function() {
            $scope.accountInfo = accountService.query({
                    merchantId: merchantId,
                    offset: $scope.currentPage,
                    limit: $scope.pageSize
                },
                function() {
                    // 数据返回成功
                    $scope.totalCount = $scope.accountInfo.data.totalCount;
                    $scope.totalPage = Math.ceil($scope.totalCount / $scope.pageSize);
                    $scope.endPage = $scope.totalPage;
                    //生成数字链接
                    if ($scope.currentPage > 1 && $scope.currentPage < $scope.totalPage) {
                        $scope.pages = [
                            $scope.currentPage - 1,
                            $scope.currentPage,
                            $scope.currentPage + 1
                        ];
                    } else if ($scope.currentPage == 1 && $scope.totalPage > 1) {
                        $scope.pages = [
                            $scope.currentPage,
                            $scope.currentPage + 1
                        ];
                    } else if ($scope.currentPage == $scope.totalPage && $scope.totalPage > 1) {
                        $scope.pages = [
                            $scope.currentPage - 1,
                            $scope.currentPage
                        ];
                    }
                    console.log($scope);
                },
                function() {
                    // 数据返回失败
                    console.log("response failed!");
                }
            );
        };

        $scope.load();

        $scope.next = function() {
            if ($scope.currentPage < $scope.totalPage) {
                $scope.currentPage++;
                $scope.load();
            }
        };

        $scope.prev = function() {
            if ($scope.currentPage > 1) {
                $scope.currentPage--;
                $scope.load();
            }
        };

        $scope.loadPage = function(page) {
            $scope.currentPage = page;
            $scope.load();
        };

        $scope.changeLimit = function() {
            $scope.currentPage = 1;
            $scope.load();
        };
    }
]);

//交易明细
storeApp.register.controller('transactions', ['$scope',
    function($scope) {

    }
])


//积分月报
storeApp.register.controller('monthlyreport', ['$scope', 'monthReportService',
    function($scope, monthReportService) {
        $scope.monthReportInfo = monthReportService.query();
    }
])


//充值还款记录
storeApp.register.controller('repayment', ['$scope',
    function($scope) {

    }
])

//提现记录
storeApp.register.controller('cashrecord', ['$scope',
    function($scope) {

    }
])

//月报明细
storeApp.register.controller('monthreportdetails', ['$scope', '$routeParams',
    function($scope, $routeParams) {

    }
])
