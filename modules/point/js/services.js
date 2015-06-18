'use strict';

//账户总览
storeApp.register.factory('accountService', ['$resource',
    function($resource) {
        return $resource(globalConfig.api + 'point/pf/v1/accounts/:merchantId/points', { merchantId: "@merchantId" }, {
            query: {
                method: 'GET',
                params: {
                    offset: "@offset",
                    limit: "@limit"
                },
                isArray: false
            }
        });
    }
]);

//积分提现
storeApp.register.factory('drawcashService', ['$resource',
    function($resource) {
        return $resource(globalConfig.api + 'point/pf/v1/withdraws', {}, {
            save: {
                method: 'POST',
                params: {
                    merchantId: "@merchantId",
                    point: "@point",
                    operaterId: "@operaterId"
                },
                isArray: false
            }
        });
    }
]);

storeApp.register.factory('monthReportService', ['$resource',
    function($resource) {
        return $resource('modules/point/temp/:month.json', {}, {
            query: {
                method: 'GET',
                params: {
                    month: 'monthreport'
                },
                isArray: false
            }
        })
    }
])
