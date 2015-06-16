'use strict'

//账户总览
storeApp.register.controller('account', ['$scope', 'accountService',
    function($scope, accountService) {
        $scope.accountInfo = accountService.query();
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
