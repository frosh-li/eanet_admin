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
      $('.datepicker').datepicker($.datepicker.regional[ "zh-TW" ]);
      $scope.today=new Date();
      $scope.earlyDay= function (dayCount) {
        var day=new Date();
        day.setDate(day.getDate()+dayCount);
        return day;
      }

    }
]);


//积分月报
storeApp.register.controller('monthlyreport', ['$scope', 'monthReportService',
    function($scope, monthReportService) {
        $scope.monthReportInfo = monthReportService.query({},function(){
          $scope.monthReport=$scope.monthReportInfo.data.total;

          //计算积分增减
          $scope.balance= function (pointAdd,pointReduce) {
            return $scope.sub(pointAdd,pointReduce)
          };

          //计算充值还款
          $scope.accumulate= function (pointAdd,pointReduce,recharge,withdraw) {
            var point1=$scope.sub(pointAdd,pointReduce);
            var point2=$scope.sub(recharge,withdraw);
            return $scope.add(point1,point2)
          }
        });

        //精确计算加法
        $scope.add= function (arg1,arg2) {
          var arg1=Number(arg1);
          var arg2=Number(arg2);
          var r1,r2,m;
          try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
          try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
          m=Math.pow(10,Math.max(r1,r2));
          return (arg1*m+arg2*m)/m;
        };
        //精确计算减法
        $scope.sub= function (arg1,arg2) {
          var arg1=Number(arg1);
          var arg2=Number(arg2);
          var r1,r2,m,n;
          try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
          try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
          m=Math.pow(10,Math.max(r1,r2));
          //动态控制精度长度
          n=(r1>=r2)?r1:r2;
          return ((arg1*m-arg2*m)/m).toFixed(n);
        };





    }
]);



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
