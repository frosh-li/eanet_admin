'use strict';

/* Services */

// storeApp.register.factory('pointsService', ['$resource',
//   function($resource){
//     return $resource(globalConfig.api + 'order/order/index/:id', {id:'@id',search:'@search'}, {
//       query: {method:'GET', params:{}, isArray:false},
//       //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
//       getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
//       save: {method:'POST', isArray:false},
//       update:{method:"PUT", isArray:false}
//     });
//   }]);

storeApp.register.factory('accountService', ['$resource',
    function($resource) {
        return $resource('modules/point/temp/:accountId.json', {}, {
            query: {
                method: 'GET',
                params: {
                    accountId: 'account'
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
