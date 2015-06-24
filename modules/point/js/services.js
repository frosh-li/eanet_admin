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

//账户充值
storeApp.register.factory('rechargeService', ['$resource',
    function($resource) {
        return $resource(globalConfig.api + 'point/pf/v1/recharges', {}, {
            save: {
                method: "POST",
                params: {},
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
        params: {},
        isArray: false
      }
    });
  }
]);

//积分提现记录
storeApp.register.factory('cashRecordService', ['$resource',
    function($resource) {
        return $resource(globalConfig + 'point/pv/v1/withdraws', {}, {
            query: {
                method: "GET",
                params: {
                  merchantId:"@merchantId"
                },
                isArray: false
            }
        });
    }
]);



//积分交易明细
storeApp.register.factory('transactionService',['$resource',
    function ($resource) {
      return $resource(
          globalConfig.api+"point/pf/v1/accounts/:merchandId/points/details",
          {
            merchandId:storeApp.userInfo.merchantID,
            startTime:"@startTime",
            endTime:"@endTime"
          },
          {
            query:{
              method:"GET",
              params: {},
              isArray: false
            }
          }
      )
    }]
);

//积分月报
storeApp.register.factory('monthReportService', ['$resource',
  function ($resource) {
    return $resource(
          globalConfig.api + 'point/pf/v1/reports/:periodType/:showType',
          {
            periodType: "month", showType: "pm"
          },
          {
            query: {
              method: 'GET',
              params: {
                merchantId:storeApp.userInfo.merchantID,
              },
              isArray: false
          }
        })
  }
]);

//月报明细
storeApp.register.factory('monthDetailService', ['$resource',
  function ($resource) {
    return $resource(
        globalConfig.api + 'point/pf/v1/accounts/:merchandId/reports/month/details',
        {

        },
        {
        query: {
          method: 'GET',
          params: {

          },
          isArray: false
        }
    })
  }
]);

//计算
storeApp.register.factory('calculateService',[
    function () {
      return {
        //精确计算减法
        sub : function (arg1, arg2) {
        var arg1 = Number(arg1);
        var arg2 = Number(arg2);
        var r1, r2, m, n;
        try {
          r1 = arg1.toString().split(".")[1].length
        } catch (e) {
          r1 = 0
        }
        try {
          r2 = arg2.toString().split(".")[1].length
        } catch (e) {
          r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2));
        //动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
      },
        //精确计算加法
        add : function (arg1, arg2) {
          var arg1 = Number(arg1);
          var arg2 = Number(arg2);
          var r1, r2, m;
          try {
            r1 = arg1.toString().split(".")[1].length
          } catch (e) {
            r1 = 0
          }
          try {
            r2 = arg2.toString().split(".")[1].length
          } catch (e) {
            r2 = 0
          }
          m = Math.pow(10, Math.max(r1, r2));
          return (arg1 * m + arg2 * m) / m;
        }
      }


}]);
