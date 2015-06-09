// 主载入js
storeApp.config(['$routeProvider', function($routeProvider) {

    var domain = "/modules/point/";

    storeApp.asyncjs = function() {
        return ["$q", "$route", "$rootScope", function($q, $route, $rootScope) {
            var deferred = $q.defer();
            $script(domain + 'js/controllers.js', function() {
                $script(domain + 'js/services.js', function() {
                    $script(domain + 'js/directives.js', function() {
                        $script(domain + 'js/factories.js', function() {
                            $script(domain + 'js/filters.js', function() {
                                $rootScope.$apply(function() {
                                    deferred.resolve();
                                });
                            });
                        });
                    });
                });
            });
            return deferred.promise;
        }];
    }

    $routeProvider
        .when('/point/account', {
            templateUrl: domain + '/views/account.html',
            controller: 'account',
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
        .when('/point/monthReportDetails', {
            templateUrl: domain + '/views/monthreportdetails.html',
            controller: 'monthreportdetails',
            resolve: {
                load: storeApp.asyncjs()
            }
        });

}]);
