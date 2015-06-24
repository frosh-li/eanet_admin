// 主载入js
storeApp.config(['$routeProvider', function($routeProvider) {

    var domain = "/modules/point/";
	var datePickerDomain="/static/jquery-ui/";

    // 当前用户信息
    storeApp.userInfo = JSON.parse(localStorage.getItem('uinfo'));

    // 动态加载js文件
    storeApp.asyncjs = function() {
        return ["$q", "$route", "$rootScope", function($q, $route, $rootScope) {
            var deferred = $q.defer();
            $script(domain + 'js/controllers.js', function() {
                $script(domain + 'js/services.js', function() {
                    $script(domain + 'js/directives.js', function() {
                        $script(domain + 'js/filters.js', function() {
                            $script(datePickerDomain+"ui/core.js", function () {
                                $script(datePickerDomain+"ui/widget.js", function () {
                                    $script(datePickerDomain+"ui/datepicker.js", function () {
                                        $script(datePickerDomain+"ui/datepicker-zh-TW.js", function () {
                                            $rootScope.$apply(function() {
                                                deferred.resolve();
                                            });
                                        })
                                    })
                                })

                            })

                        });
                    });
                });
            });
            return deferred.promise;
        }];
    };

    // 注册路由
    $routeProvider
        .when('/point/account', {
            templateUrl: domain + '/views/account.html',
            controller: 'account',
            resolve: {
                load: storeApp.asyncjs()
            }
        })
        .when('/point/accountDrawCash', {
            templateUrl: domain + '/views/drawcash.html',
            controller: 'drawcash',
            resolve: {
                load: storeApp.asyncjs()
            }
        })
        .when('/point/accountDetail', {
            templateUrl: domain + '/views/transactions.html',
            controller: 'transactions',
            resolve: {
                load: storeApp.asyncjs()
            }
        })
        .when('/point/accountMonthReport', {
            templateUrl: domain + '/views/monthly_report.html',
            controller: 'monthlyreport',
            resolve: {
                load: storeApp.asyncjs()
            }
        })
        .when('/point/accountRepayRecord', {
            templateUrl: domain + '/views/repayment.html',
            controller: 'repayment',
            resolve: {
                load: storeApp.asyncjs()
            }
        })
        .when('/point/accountCashRecord', {
            templateUrl: domain + '/views/cash_record.html',
            controller: 'cashrecord',
            resolve: {
                load: storeApp.asyncjs()
            }
        })
        .when('/point/monthReportDetails/:period/:pointTotal', {
            templateUrl: domain + '/views/monthreportdetails.html',
            controller: 'monthreportdetails',
            resolve: {
                load: storeApp.asyncjs()
            }
        })
        .when('/point/account/pay/:orderno',{
            templateUrl:domain+'/views/pointrecharge.html',
            controller:'rechargeconfirm',
            resolve:{
                load:storeApp.asyncjs()
            }
        });

}]);
