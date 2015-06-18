'use strict';

//账户总览
storeApp.register.factory('accountService', ['$resource',
    function($resource) {
        return $resource(globalConfig.api + 'point/pf/v1/accounts/:merchantId/points', { merchantId:"@merchantId" }, {
            query: {
                method: 'GET',
                params: {offset:"@offset",limit:"@limit"},
                isArray: false
            }
        });
    }
]);

// storeApp.register.factory('accountService', ['$resource',
//     function($resource) {
//         return $resource('modules/point/temp/:accountId.json', {}, {
//             query: {
//                 method: 'GET',
//                 params: {
//                     accountId: 'account'
//                 },
//                 isArray: false
//             }
//         });
//     }
// ]);

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
