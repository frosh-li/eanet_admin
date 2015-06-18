'use strict'

//账户总览
storeApp.register.controller('account', ['$scope', 'accountService',
    function($scope, accountService) {
        
        $scope.currentPage = 1;
        $scope.totalPage = 1;
        $scope.pageSize = 10;
        $scope.pages = [];
        $scope.endPage = 1;

        $scope.load = function() {
            $scope.accountInfo = accountService.query({
                    merchantId: storeApp.userInfo.merchantID,
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

//账户提现
storeApp.register.controller('drawcash', ['$scope', 'drawcashService',
    function($scope, drawcashService) {
        // 积分
        $scope.point = '';
        $scope.withdraw = function() {
            $scope.drawResult = drawcashService.save({
                merchantId: storeApp.userInfo.merchantID,
                point: $scope.point,
                operaterId: storeApp.userInfo.uid
            }, function() {
                // 操作成功

            }, function() {});
        }
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
