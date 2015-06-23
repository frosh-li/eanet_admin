'use strict';

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
        // 充值
        $scope.rechargeInfo = {
            rechargePoint: "",
            rechargePointMin: 2000,
            onoff: "",
            payChannel: "OFFLINE_CASH",
            feeRate: 0,
            fee: 0,
            rechargePointWatch: function() {
                var point = Number(this.rechargePoint);
                if (this.rechargePoint != "") {
                    if (isNaN(point)) {
                        this.rechargePoint = this.rechargePoint.substring(0, this.rechargePoint.length - 1);
                    } else {
                        this.fee = (point * (1 + this.feeRate * 0.01)).toFixed(2);
                    }
                }
            },
            radioChange: function() {
                this.rechargePoint = "";
                this.feeRate = this.onoff == "ONLINE" ? 1.2 : 0;
                this.fee = 0;
            },
            // 确定充值
            confirmRecharge: function() {
                if (Number(this.rechargePoint) < this.rechargePointMin) {
                    alert('每次充值额最少' + this.rechargePointMin + '积分');
                }
                else{

                }
            }
        }
    }
]);

//账户提现
storeApp.register.controller('drawcash', ['$scope', 'drawcashService',
    function($scope, drawcashService) {
        // 积分
        $scope.point = '';
        $scope.pointMin = 5000;

        $scope.withdraw = function() {
            if ($scope.point == '' || isNaN(Number($scope.point)) || Number($scope.point) < $scope.pointMin) {
                alert('提现金额不能小于' + $scope.pointMin);
                return;
            }
            $scope.drawResult = drawcashService.save({
                merchantId: storeApp.userInfo.merchantID,
                point: $scope.point,
                operaterId: storeApp.userInfo.uid
            }, function() {
                // 操作成功
                if ($scope.drawResult.status == 200) {
                    alert("积分提现成功");
                } else {
                    alert($scope.drawResult.message);
                }
            }, function() {
                alert("网络异常，请稍后重试");
            });
        }
    }
]);





//交易明细
storeApp.register.controller('transactions', ['$scope', 'transactionService','$filter','calculateService',
  function ($scope, transactionService,$filter,calculateService) {
    //初始化日历
    $('.datepicker').datepicker($.datepicker.regional["zh-TW"]);

    //日期
    $scope.today = new Date();
    $scope.earlyDay = function (dayCount) {
      var day = new Date();
      day.setDate(day.getDate() + dayCount);
      $scope.startTime=$filter("date")(day,"yyyy-MM-dd");
    };
    $scope.earlyMonth= function (monthCount) {
      var day=new Date();
      day.setMonth(day.getMonth() + monthCount);
      if(monthCount===0){
        day.setDate(1);
      }
      $scope.startTime=$filter("date")(day,"yyyy-MM-dd");
    };
    //input
    $scope.earlyDay(-7);
    $scope.endTime=$filter("date")($scope.today,"yyyy-MM-dd");


    //查询
    $scope.queryTransactionInfo= function () {
      $scope.transactionInfo = transactionService.query(
          {
            startTime:$scope.startTime,
            endTime:$scope.endTime
          },
          function () {
            $scope.transactionData=$scope.transactionInfo.data;
            console.log($scope.transactionData);
            $scope.transactionData.result= {
              pointAdd:$scope.transactionData.pointAdd||0.00,
              pointReduce:$scope.transactionData.pointReduce||0.00,
              recharge:$scope.transactionData.recharge||0.00,
              withdraw:$scope.transactionData.withdraw||0.00,
              pointBalance:function () {
                return calculateService.sub(this.pointAdd,this.pointReduce);
              },
              pointTotal: function () {
                var point1=this.pointBalance();
                var point2=calculateService.sub(this.recharge,this.withdraw);
                return calculateService.add(point1,point2)
              }
            }
          });
    };
    $scope.queryTransactionInfo();




    //点击查询
    $scope.query = function () {
      $scope.queryTransactionInfo();
    }

  }
]);


//积分月报
storeApp.register.controller('monthlyreport', ['$scope', 'monthReportService','calculateService',
  function ($scope, monthReportService,calculateService) {
    $scope.monthReportInfo = monthReportService.query({}, function () {

      //总月报
      $scope.monthReportDataT=$scope.monthReportInfo.data.total;
      //月报list
      $scope.monthReportDataL=$scope.monthReportInfo.data.detailList;

      $scope.monthReportDataTotal={
        pointAdd:$scope.monthReportDataT.pointAdd||0.00,
        pointReduce:$scope.monthReportDataT.pointReduce||0.00,
        recharge:$scope.monthReportDataT.recharge||0.00,
        withdraw:$scope.monthReportDataT.withdraw||0.00,
        pointBalance:function () {
          return calculateService.sub(this.pointAdd,this.pointReduce);
        },
        pointTotal: function () {
          var point1=this.pointBalance();
          var point2=calculateService.sub(this.recharge,this.withdraw);
          return calculateService.add(point1,point2)
        }
      };

      $scope.monthReportDataL.pointBalance= function (index) {
        return calculateService.sub($scope.monthReportDataL[index].pointAdd,$scope.monthReportDataL[index].pointReduce);
      };
      $scope.monthReportDataL.pointTotal= function (index) {
        var point1=$scope.monthReportDataL.pointBalance(index);
        var point2=calculateService.sub($scope.monthReportDataL[index].recharge,$scope.monthReportDataL[index].withdraw);
        return calculateService.add(point1,point2)
      }

    });

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
storeApp.register.controller('monthreportdetails', ['$scope', '$routeParams', 'monthDetailService',
  function ($scope, $routeParams, monthDetailService) {
    $scope.month = $routeParams.period.replace("-", "年");

    //$scope.monthDetailInfo = monthDetailService.query();

    //按月份查找
    $scope.monthDetailInfo=monthDetailService.get(
        {
          merchandId:storeApp.userInfo.merchantID,
          period: $routeParams.period
        },
        function () {
          //success
          $scope.pointData=$scope.monthDetailInfo.data;

          $scope.pointAddTotal=$scope.pointData.pointAddTotal<=0;
          $scope.pointReduceTotal=$scope.pointData.pointReduceTotal<=0;
          $scope.rwList=$scope.pointData.rwList.length<=0;
        },
        function () {
          //error
        }
    );
  }
]);