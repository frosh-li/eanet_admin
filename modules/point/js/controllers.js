'use strict';

//账户总览
storeApp.register.controller('account', ['$scope', 'accountService', 'rechargeService',
    function($scope, accountService, rechargeService) {
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
                    return;
                }

                $scope.rechargeResult = rechargeService.save({
                    merchantId: storeApp.userInfo.merchantID,
                    onoff: this.onoff,
                    point: this.rechargePoint,
                    payChannel: this.payChannel
                }, function() {
                    if ($scope.rechargeResult.status == 200) {
                        // 充值成功
                        if ($scope.rechargeInfo.onoff == "OFFLINE") {
                            alert("操作成功");
                            $scope.dialogStyle = {
                                "display": "none"
                            };
                        } else {
                            location.href = "/#/point/account/pay/" + $scope.rechargeResult.data.orderNo;
                        }
                    } else {
                        alert($scope.rechargeResult.message);
                    }
                }, function() {
                    alert("网络异常，请稍后重试");
                });
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

    //分页
    $scope.currentPage = 1;
    $scope.totalPage = 1;
    $scope.pageSize = 10;
    $scope.pages = [];
    $scope.endPage = 1;
    $scope.pageFlag=false;
    //信息
    $scope.transactionData={};//全部信息
    $scope.transactionDataDetail=[];//详细信息-分页部分
    //查询
    $scope.queryTransactionInfo= function () {
      $scope.transactionInfo = transactionService.query(
          {
            startTime:$scope.startTime,
            endTime:$scope.endTime,
            offset: $scope.currentPage,
            limit: $scope.pageSize
          },
          function () {

            $scope.transactionData=$scope.transactionInfo.data;//积分data
            var totalCount=$scope.transactionData.totalCount;

            $scope.transactionDataDetail=totalCount>0?$scope.transactionInfo.data.detailList:[];//详细data


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

            //页数相关
            $scope.totalCount = $scope.transactionInfo.data.totalCount;
            $scope.totalPage = Math.ceil($scope.totalCount / $scope.pageSize);
            $scope.endPage = $scope.totalPage;
            //生成数字链接
            $scope.pageLink();

          });
    };
    
    //分页
    $scope.queryPage= function () {
      $scope.showMe=true;//loading
      $scope.transationPageQuery=transactionService.query(
          {
            startTime:$scope.startTime,
            endTime:$scope.endTime,
            offset: $scope.currentPage,
            limit: $scope.pageSize
          },
          function () {
            $scope.showMe=false;
            if($scope.transationPageQuery.data){
              $scope.transactionDataDetail=$scope.transationPageQuery.data.detailList;//详细data
            }
            //生成数字链接
            $scope.pageLink();
          }
      )
    };

    //数字链接
    $scope.pageLink= function () {
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
    };

    //日期
    $scope.today = new Date();
    $scope.earlyDay = function (dayCount) {
      var day = new Date();
      day.setDate(day.getDate() + dayCount);
      $scope.startTime=$filter("date")(day,"yyyy-MM-dd");
      $scope.endTime=$filter("date")($scope.today,"yyyy-MM-dd");
      $scope.queryTransactionInfo()
    };
    $scope.earlyMonth= function (monthCount) {
      var dayStart=new Date();
      dayStart.setMonth(dayStart.getMonth() + monthCount);
      dayStart.setDate(1);
      $scope.endTime=$filter("date")($scope.today,"yyyy-MM-dd");
      if(monthCount!=0){
        var dayEnd=new Date();
        dayEnd.setMonth(dayEnd.getMonth()+1+monthCount);
        dayEnd.setDate(0);
        $scope.endTime=$filter("date")(dayEnd,"yyyy-MM-dd");
      }
      $scope.startTime=$filter("date")(dayStart,"yyyy-MM-dd");
      $scope.queryTransactionInfo()
    };
    //input
    $scope.earlyDay(-7);

    //点击查询
    $scope.query = function () {
      $scope.queryTransactionInfo();
    };



    $scope.next = function() {
      if ($scope.currentPage < $scope.totalPage) {
        $scope.currentPage++;
        $scope.queryPage();
      }
    };

    $scope.prev = function() {
      if ($scope.currentPage > 1) {
        $scope.currentPage--;
        $scope.queryPage();
      }
    };

    $scope.loadPage = function(page) {
      $scope.currentPage = page;
      $scope.queryPage();
    };

    $scope.changeLimit = function() {
      $scope.currentPage = 1;
      $scope.queryPage();
    };
    //分页 end










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
storeApp.register.controller('repayment', ['$scope','repaymentService',
  function($scope,repaymentService) {
    //页数
    $scope.currentPage=1;
    $scope.pageSize=10;
    //数据
    $scope.repaymentInfoData=[];
    //查询
    $scope.load= function () {
      $scope.showMe=true;//loading
      $scope.repaymentInfo= repaymentService.query(
          {
            //merchantId: storeApp.userInfo.merchantID,
            merchantId: storeApp.userInfo.merchantID,
            offset: $scope.currentPage,
            limit: $scope.pageSize
          },
          function () {
              //success
              $scope.showMe=false;
              $scope.repaymentInfoData=$scope.repaymentInfo.data.list;

              //分页相关--待优化
              $scope.totalCount = $scope.repaymentInfo.data.total;
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
          },
          function () {
            //false
            $scope.dataError=true;
          }
      );
    };
    $scope.load();


    //分页
    $scope.currentPage = 1;
    $scope.totalPage = 1;
    $scope.pageSize = 10;
    $scope.pages = [];
    $scope.endPage = 1;


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

//提现记录
storeApp.register.controller('cashrecord', ['$scope','cashRecordService',
  function($scope,cashRecordService) {
    //页数
    $scope.currentPage=1;
    $scope.pageSize=10;
    //数据
    //查询
    $scope.cashRecordInfo= cashRecordService.query(
        {
          //merchantId: storeApp.userInfo.merchantID,
          merchantId: storeApp.userInfo.merchantID,
          offset: $scope.currentPage,
          limit: $scope.pageSize
        },
        function () {
          //success

        },
        function () {
          //false
          $scope.dataError=true;
        }
    )
  }
]);

//月报明细
storeApp.register.controller('monthreportdetails', ['$scope', '$routeParams', 'monthDetailService',
  function ($scope, $routeParams, monthDetailService) {
    $scope.month = $routeParams.period.replace("-", "年");
    $scope.pointTotal = $routeParams.pointTotal;

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

// 积分充值页
storeApp.register.controller('rechargeconfirm', ['$scope', 'rechargeConfirmService', 'getPayTypeService', 'getPayUrlService',
    function($scope, rechargeConfirmService, getPayTypeService, getPayUrlService) {

    }
]);


