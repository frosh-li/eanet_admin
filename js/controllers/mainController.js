'use strict';

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
/* mainControllers */

var mainControllers = angular.module('mainControllers', ['ngTable','ngResource','storeAppDirectivies']);

mainControllers.controller('baseController',['$scope','$rootScope','$http', function($scope,$rootScope, $http){

    $http.post('/api/user/loginStatus').success(function(ret){
        if(ret.status == 200){
            $rootScope.user = ret.data;
            $rootScope.menus = ret.menus;
            console.log($rootScope.user);
        }else{
            alert('请登陆');
            //return;
            window.location = "/login.html";
        }
    });

    $scope.logout = function(){
        $http.post('/api/user/logout').success(function(ret){
            if(ret.status == 200){
                window.location = "/login.html";
            }
        });
    };
}]);
mainControllers.controller('CompList', ['$resource','$scope','$timeout','ngTableParams','Upload','CompFeed',
    function($resource,$scope, $timeout,ngTableParams,Upload, CompFeed) {
        var Api = $resource('/api/comp/comp/');
        $scope.search = {
            type: -1,
            id: "",
            name: "",
            pingying: ""
        };
        $scope.company_type = [
            {val: -1, name: '企业类型'},
            {val: 1, name: '药店企业'},
            {val: 2, name: '批发企业'}
        ];
        $scope.psearch = function(){
            console.log($scope.search);
            var params = {
                page: 1,            // show first page
                count: 10,          // count per page
            };
            for(var key in $scope.search){
                if($scope.search.hasOwnProperty(key) && $scope.search[key] !=="" & $scope.search[key] !== -1){
                    params[key] = $scope.search[key];
                }
            }
            $scope.tableParams = new ngTableParams(params, {
                total: 0,           // length of data
                getData: function($defer, params) {
                    // ajax request to api
                    Api.get(params.url(), function(data) {
                        $timeout(function() {
                            // update table params
                            params.total(data.total);
                            // set new data
                            $defer.resolve(data.result);
                        }, 500);
                    });
                }
            });
        }
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
        }, {
            total: 0,           // length of data
            getData: function($defer, params) {
                // ajax request to api
                Api.get(params.url(), function(data) {
                    $timeout(function() {
                        // update table params
                        params.total(data.total);
                        // set new data
                        $defer.resolve(data.result);
                    }, 500);
                });
            }
        });

        $scope.del = function(id){
            var role = new CompFeed({id: id});
            role.$delete(function(ret){
                console.log(ret);
                if(ret.status == 500){
                    alert('系统错误'+"\n"+ret.err);
                    return;
                }
                alert('删除成功');
                window.location.reload();
            })
        }

        $scope.upload = function (files) {
          if (files && files.length) {
              for (var i = 0; i < files.length; i++) {
                  var file = files[i];
                  Upload.upload({
                      url: 'api/upload/',
                      fields: {'username': $scope.username},
                      file: file
                  }).progress(function (evt) {
                      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                      console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                  }).success(function (data, status, headers, config) {
                      console.log('file ' + config.file.name + 'uploaded. Response: ' + data);

                      if(data.status == 200){
                          alert('解析成功');
                          window.location.reload();
                      }else{
                          alert(data.msg);
                      }
                  });
              }
          }
      };
    }
]);

mainControllers.controller('UserList', ['$http','$scope','$timeout','UserFeed',
    function($http,$scope, $timeout, UserFeed) {
        $scope.lists = UserFeed.query();
        $scope.del = function(id){
            var role = new RoleFeed({id: id});
            role.$delete(function(ret){
                console.log(ret);
                if(ret.status == 500){
                    alert('系统错误'+"\n"+ret.err);
                    return;
                }
                alert('删除成功');
                window.location.reload();
            })
        }
    }
]);

mainControllers.directive("page", function() {
// Removes the need for duplicating the scode that makes the suggestions list.
    return {
        restrict: "A",
        templateUrl:"/views/common/pager.html"
    };
});

mainControllers.controller('showAllMarket', ['$resource','$http','$scope','$timeout','UserFeed',
    function($resource,$http,$scope, $timeout, UserFeed) {
        var Api = $resource('/api/comp/comp');
        $scope.page = 1;
        $scope.count = 12;
        $scope.total = 0;
        $scope.list = [];
        $scope.totalpage = 0;
        $scope.pages = [];
        function request(){
            $scope.list = [];
            $http.get('/api/items/market?page='+$scope.page+"&count="+$scope.count).success(function(ret){
                console.log(ret);
                $scope.$data = ret.result;
                ret.result.forEach(function(item, index){
                    $scope.list[Math.floor(index/4)] = $scope.list[Math.floor(index/4)] || [];
                    $scope.list[Math.floor(index/4)].push(item);
                });
                $scope.total = ret.total;
                $scope.totalpage = Math.ceil(ret.total/$scope.count);
                buildPage();
            });
        }
        function buildPage(){
            var maxShow = 10;
            var ret = [];
            if($scope.totalpage <= maxShow){
                for(var i = 1 ; i <= $scope.totalpage; i ++){
                    if($scope.page == i){
                        ret.push({
                            active:"active",
                            number: i
                        });
                    }else{
                        ret.push({
                            active:"",
                            number: i
                        });
                    }
                }
            }else{
                var page = $scope.page;
                var minpage = page-5 > 0 ? (page-5):1;
                var maxpage = page+5 >$scope.totalpage ? $scope.totalpage : (page+5);
                for(var i = minpage ; i <= maxpage ; i++){
                    if($scope.page == i){
                        ret.push({
                            active:"active",
                            number: i
                        });
                    }else{
                        ret.push({
                            active:"",
                            number: i
                        });
                    }
                }
            }
            $scope.pages = ret;

        }
        $scope.gotoPage = function(page){
            console.log(page,'-------');
            $scope.page = page;
            request();
        }
        $scope.request = request;
        request();

        $scope.del = function(id){
            var item = new ItemFeed({id: id});
            item.$delete(function(ret){
                console.log(ret);
                if(ret.status == 500){
                    alert('系统错误'+"\n"+ret.err);
                    return;
                }
                alert('删除成功');
                window.location.reload();
            })
        }
    }
]);

mainControllers.controller('ItemList', ['ngTableParams','$resource',"ItemFeed","$scope", "$document", "smartySuggestor", "$window", "$timeout",
    function(ngTableParams,$resource,ItemFeed,$scope, $document, smartySuggestor, $window, $timeout) {
        /** Once the user has typed something in the input, smarty should
        *   handle the following situations accordingly:
        *   - User clicks outside the input or suggestions dropdown:
        *      - Suggestions dropdown disappears
        *      - Behaves normally when user clicks back into the input
        *   - User clicks a suggestion from the dropdown:
        *      - Suggestions dropdown disappears
        *      - Input is filled with value of clicked suggestion
        *      - Focus is on zipcode input
        *   - User presses up or down arrows, or hovers with mouse
        *      ($scope.userInteraction = true)
        *      - The selected suggestion changes accordingly
        *   - User presses enter or blurs the input
        *      - If there is a selection made, that selection should fill the input
        *      - If there is no selection made, whatever the user has currently typed
        *       should remain in the input
        *      - Focus is moved to the zipcode input
        */
        // $scope.suggestions holds the smart suggestions based on the current prefix.
        // If there are suggestions in the array, the suggestions drowdown will show.
        // $scope.prefix holds the value of the request input.
        // $scope.selected holds the index of $scope.suggestions that is
        // currently selected by the user.  If $scope.selected is -1, nothing is selected.
        $scope.suggestions = [];
        $scope.prefix = "";
        $scope.selected = -1;
        $scope.selectionMade = false;
        $scope.zip = "";

        $scope.$watch("prefix", function(newValue, oldValue) {
            if (newValue != oldValue && $scope.selectionMade == false) {
                if ($scope.prefix == "" || angular.isUndefined($scope.prefix)) {
                    $scope.suggestions = [];
                    $scope.selected = -1;
                } else {
                    var promise = smartySuggestor.getSmartySuggestions($scope.prefix);
                    promise.then(function(data) {
                        $scope.suggestions = data;
                    });
                }
            }
        });

        $scope.clickedSomewhereElse = function() {
            $scope.selected = -1;
            $scope.suggestions = [];
        };

        $document.bind("click", onDocumentClick);
        $scope.$on("$destroy", function() {
            $document.unbind("click", onDocumentClick);
        })
        function onDocumentClick() {
            $scope.$apply($scope.clickedSomewhereElse());
        }

        $scope.suggestionPicked = function() {
            if ($scope.selected != -1 && $scope.selected < $scope.suggestions.length) {
                $scope.prefix = $scope.suggestions[$scope.selected];
            }
            $scope.selectionMade = true;
            $scope.suggestions = [];
        };

        $scope.setSelected = function(newValue) {
            if (newValue > $scope.suggestions.length) {
                $scope.selected = 0;
            } else if (newValue < 0) {
                $scope.selected = $scope.suggestions.length;
            } else {
                $scope.selected = newValue;
            }
        };

        $scope.price = "";
        $scope.addYP = function(){
            var sp = $scope.prefix.split("|");
            var item = new ItemFeed({
                price: $scope.price,
                good_id:sp[0]
            });
            item.$save(function(data){
                if(data.status == 500){
                    alert('添加失败');
                    console.log(data.err || data.msg);
                }
                alert('添加成功');
            });
        };
        var Api = $resource('/api/items/map/');
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10          // count per page
        }, {
            total: 0,           // length of data
            getData: function($defer, params) {
                // ajax request to api
                Api.get(params.url(), function(data) {
                    $timeout(function() {
                        // update table params
                        params.total(data.total);
                        // set new data
                        $defer.resolve(data.result);
                    }, 500);
                });
            }
        });
        $scope.del = function(id){
            var item = new ItemFeed({id: id});
            item.$delete(function(ret){
                console.log(ret);
                if(ret.status == 500){
                    alert('系统错误'+"\n"+ret.err);
                    return;
                }
                alert('删除成功');
                window.location.reload();
            })
        }
    }
]);

mainControllers.controller('companyRelateList', ['$http','$route','ngTableParams','$scope','$timeout','$resource',
    function($http,$route,ngTableParams,$scope, $timeout, $resource) {
        var companyid = $route.current.params.companyid;
        $scope.companyid = companyid;
        var Api = $resource('/api/comp/relate/');
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            companyid:companyid
        }, {
            total: 0,           // length of data
            getData: function($defer, params) {
                // ajax request to api
                Api.get(params.url(), function(data) {
                    $timeout(function() {
                        // update table params
                        params.total(data.total);
                        // set new data
                        $defer.resolve(data.result);
                    }, 500);
                });
            }
        });
        $scope.removeRelate = function(id, companyid){
            $http.post('/api/comp/relate/',{
                comp_id_2: id,
                comp_id_1:companyid,
                remove:1
            }).success(function(data){
                console.log(data);
                if(data.status == 500){
                    if(data.err.indexOf('Duplicate') > -1){
                        alert('已经加入过关联');
                    }else{
                        alert(data.msg || data.err);
                    }
                }else if(data.status == 200){
                    alert('删除关联成功');
                    window.location.reload();
                }
            })
        }
    }
]);

mainControllers.controller('companyRelateYdList', ['$http','$route','ngTableParams','$scope','$timeout','$resource',
    function($http,$route,ngTableParams,$scope, $timeout, $resource) {
        var companyid = $route.current.params.companyid;
        $scope.companyid = companyid;
        var Api = $resource('/api/comp/relateyd/');
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            companyid:companyid
        }, {
            total: 0,           // length of data
            getData: function($defer, params) {
                // ajax request to api
                Api.get(params.url(), function(data) {
                    $timeout(function() {
                        // update table params
                        params.total(data.total);
                        // set new data
                        $defer.resolve(data.result);
                    }, 500);
                });
            }
        });

        $scope.setupRelate = function(id, companyid){
            $http.post('/api/comp/relate/',{
                comp_id_2: id,
                comp_id_1:companyid
            }).success(function(data){
                console.log(data);
                if(data.status == 500){
                    if(data.err.indexOf('Duplicate') > -1){
                        alert('已经加入过关联');
                    }else{
                        alert(data.msg || data.err);
                    }
                }else if(data.status == 200){
                    alert('关联成功');
                }
            })
        }
    }
]);

mainControllers.controller('OrderList', ['$route','$http','ngTableParams','$scope','$timeout','$resource',
    function($route,$http,ngTableParams,$scope, $timeout,$resource) {
        $scope.routetype = $route.current.params.type;
        $scope.active0 = $scope.routetype == 0 ? "active":"";
        $scope.active1 = $scope.routetype == 1 ? "active":"";
        $scope.active2 = $scope.routetype == 2 ? "active":"";
        var Api = $resource('/api/order/order/');
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            type:2,
            ordertype:$scope.routetype
        }, {
            total: 0,           // length of data
            getData: function($defer, params) {
                // ajax request to api
                Api.get(params.url(), function(data) {
                    $timeout(function() {
                        // update table params
                        params.total(data.total);
                        // set new data
                        $defer.resolve(data.result);
                    }, 500);
                });
            }
        });
        $scope.del = function(id){
            var role = new RoleFeed({id: id});
            role.$delete(function(ret){
                console.log(ret);
                if(ret.status == 500){
                    alert('系统错误'+"\n"+ret.err);
                    return;
                }
                alert('删除成功');
                window.location.reload();
            })
        }
        // 提交订单，直接订单可以直接提交
        $scope.submitOrder = function(order_id){
            $http.post('/api/order/orderSubmit',{order_id: order_id}).success(function(ret){
                if(ret.status == 500){
                    alert(ret.err || ret.msg);
                }else if(ret.status == 200){
                    alert('提交订单成功');
                    window.location.reload();
                }
            });
        };
        $scope.comfirmOrder = function(order_id){
            $http.post('/api/order/orderPFSubmit',{order_id: order_id}).success(function(ret){
                if(ret.status == 500){
                    alert(ret.err || ret.msg);
                }else if(ret.status == 200){
                    alert('提交成功');
                    window.location.reload();
                }
            });
        }
    }
]);

mainControllers.controller('RejectOrderList', ['$route','$http','ngTableParams','$scope','$timeout','$resource',
    function($route,$http,ngTableParams,$scope, $timeout,$resource) {
        $scope.routetype = $route.current.params.type;
        $scope.active0 = $scope.routetype == 0 ? "active":"";
        $scope.active1 = $scope.routetype == 1 ? "active":"";
        $scope.active2 = $scope.routetype == 2 ? "active":"";
        var Api = $resource('/api/order/rejectOrder/');
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            type:"supplie_id"
        }, {
            total: 0,           // length of data
            getData: function($defer, params) {
                // ajax request to api
                Api.get(params.url(), function(data) {
                    $timeout(function() {
                        // update table params
                        params.total(data.total);
                        // set new data
                        $defer.resolve(data.result);
                    }, 500);
                });
            }
        });
        $scope.comfirmRejct = function(order_id){
            $http.post('/api/order/rejectOrder').success(function(ret){
                if(ret.status == 200){
                    alert('确认拒收成功');
                    window.location.reload();
                }else{
                    alert('确认拒收失败');
                }
            });
        }
    }
]);

mainControllers.controller('Yd_orderList', ['Upload','$route','$http','ngTableParams','$scope','$timeout','$resource','OrderFeed',
    function(Upload,$route,$http,ngTableParams,$scope, $timeout,$resource,OrderFeed) {
        $scope.routetype = $route.current.params.type;
        $scope.active0 = $scope.routetype == 0 ? "active":"";
        $scope.active1 = $scope.routetype == 1 ? "active":"";
        $scope.active2 = $scope.routetype == 2 ? "active":"";
        // $scope.active3 = $scope.routetype == 3 ? "active":"";
        $scope.canCreate = true;
        var Api = $resource('/api/order/order/');
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            ordertype: $scope.routetype
        }, {
            total: 0,           // length of data
            getData: function($defer, params) {
                // ajax request to api
                Api.get(params.url(), function(data) {
                    $timeout(function() {
                        // update table params
                        params.total(data.total);
                        // set new data

                        data.result.forEach(function(item){
                            if(item.order_type === 1 && item.order_status === 1){
                                $scope.canCreate = false;
                            }
                        });
                        $defer.resolve(data.result);

                    }, 500);
                });
            }
        });
        $scope.del = function(id){
            var order = new OrderFeed({id: id});
            order.$delete(function(ret){
                console.log(ret);
                if(ret.status == 500){
                    alert('系统错误'+"\n"+ret.err);
                    return;
                }
                alert('删除成功');
                window.location.reload();
            })
        }
        // 提交订单，直接订单可以直接提交
        $scope.submitOrder = function(order_id){
            $http.post('/api/order/orderSubmit',{order_id: order_id}).success(function(ret){
                if(ret.status == 500){
                    alert(ret.err || ret.msg);
                }else if(ret.status == 200){
                    alert('提交订单成功');
                    window.location.reload();
                }
            });
        };
    }
]);

mainControllers.controller('rejectList', ['$route','$http','ngTableParams','$scope','$timeout','$resource',
    function($route,$http,ngTableParams,$scope, $timeout,$resource) {
        $scope.routetype = $route.current.params.type;
        $scope.active0 = $scope.routetype == 0 ? "active":"";
        $scope.active1 = $scope.routetype == 1 ? "active":"";
        $scope.active2 = $scope.routetype == 2 ? "active":"";
        // $scope.active3 = $scope.routetype == 3 ? "active":"";

        var Api = $resource('/api/order/rejectOrder/');
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10          // count per page
        }, {
            total: 0,           // length of data
            getData: function($defer, params) {
                // ajax request to api
                Api.get(params.url(), function(data) {
                    $timeout(function() {
                        // update table params
                        params.total(data.total);
                        // set new data
                        $defer.resolve(data.result);
                    }, 500);
                });
            }
        });
        $scope.del = function(id){
            var role = new RoleFeed({id: id});
            role.$delete(function(ret){
                console.log(ret);
                if(ret.status == 500){
                    alert('系统错误'+"\n"+ret.err);
                    return;
                }
                alert('删除成功');
                window.location.reload();
            })
        }
        // 提交订单，直接订单可以直接提交
        $scope.submitOrder = function(order_id){
            $http.post('/api/order/orderSubmit',{order_id: order_id}).success(function(ret){
                if(ret.status == 500){
                    alert(ret.err || ret.msg);
                }else if(ret.status == 200){
                    alert('提交订单成功');
                    window.location.reload();
                }
            });
        };
    }
]);



mainControllers.controller('Yd_orderCreate', ["$document", "smartySuggestor", "$window",'$rootScope','$http','$scope','$timeout','OrderFeed','OrderFeed',
    function($document, smartySuggestor, $window,$rootScope,$http,$scope, $timeout, OrderFeed, RoleFeed) {
        smartySuggestor.setConfig({requestUrl:"/api/comp/suggest"});
        $scope.suggestions = [];
        $scope.prefix = "";
        $scope.selected = -1;
        $scope.selectionMade = false;
        $scope.zip = "";

        $scope.$watch("prefix", function(newValue, oldValue) {
            if (newValue != oldValue && $scope.selectionMade == false) {
                if ($scope.prefix == "" || angular.isUndefined($scope.prefix)) {
                    $scope.suggestions = [];
                    $scope.selected = -1;
                } else {
                    var promise = smartySuggestor.getSmartySuggestions($scope.prefix);
                    promise.then(function(data) {
                        $scope.suggestions = data;
                    });
                }
            }
        });

        $scope.clickedSomewhereElse = function() {
            $scope.selected = -1;
            $scope.suggestions = [];
        };

        $document.bind("click", onDocumentClick);
        $scope.$on("$destroy", function() {
            $document.unbind("click", onDocumentClick);
        })
        function onDocumentClick() {
            $scope.$apply($scope.clickedSomewhereElse());
        }

        $scope.suggestionPicked = function() {
            if ($scope.selected != -1 && $scope.selected < $scope.suggestions.length) {
                $scope.prefix = $scope.suggestions[$scope.selected];
            }
            $scope.selectionMade = true;
            $scope.suggestions = [];
        };

        $scope.setSelected = function(newValue) {
            if (newValue > $scope.suggestions.length) {
                $scope.selected = 0;
            } else if (newValue < 0) {
                $scope.selected = $scope.suggestions.length;
            } else {
                $scope.selected = newValue;
            }

            $scope.formData.supplie_id = $scope.suggestions[$scope.selected].split('|')[0];
        };


        $scope.lists = [];
        $scope.order_type_list = [
            {val: 1, name:'直接订单'},
            {val: 2, name:'询价'},
        ];
        $scope.formData = {
            supplie_id: "",
            order_oper: $rootScope.user.realname,
            order_beizu: "",
            order_date: (new Date()).Format("yyyyMMdd"),
            order_lastvaiddate: "",
            order_status:1,
            order_type:1,
            comp_id: $rootScope.user.comp_id
        };

        $scope.processForm = function(){
            console.log($scope.formData);
            if(!/^2[0-9]{5}$/.test($scope.formData.supplie_id)){
                alert('请选择供应商');
                return;
            }
            if(!/^[0-9]{8}$/.test($scope.formData.order_date)){
                alert('请输入正确订单日期');
                return;
            }
            if(!/^[0-9]{8}$/.test($scope.formData.order_lastvaiddate)){
                alert('请输入正确的交货订单日期');
                return;
            }
            var order = new OrderFeed($scope.formData);
            order.$save(function(ret){
                if(ret.msg){
                    alert(ret.msg);
                    return;
                }
                if(ret.status == 200){
                    alert('新增成功，即将返回列表页面');
                    window.history.back();
                }
            });
        }

    }
]);

mainControllers.controller('setprice', [
    '$resource',
    'ngTableParams',
    '$route',
    "$document",
    "smartySuggestor",
    "$window",'$rootScope','$http','$scope','$timeout','OrderDetailFeed','OrderFeed',
    function(
        $resource,
        ngTableParams,
        $route,$document, smartySuggestor, $window,$rootScope,$http,$scope, $timeout, OrderDetailFeed, RoleFeed) {
        $scope.orderid = $route.current.params.orderid;
        $scope.companyid = $route.current.params.comp_id;
        $scope.order_status = $route.current.params.order_status;

        $scope.processForm = function(){
            console.log($scope.formData);

            var oid = [],price=[],amount = [];
            $scope.formData.forEach(function(item){
                oid.push(item.oid);
                price.push(item.price),
                amount.push(item.price*item.good_number)
            });

            $http.post('/api/order/autoprice', {orderid:$scope.orderid,amount:amount.join("|"),oid:oid.join("|"),price:price.join("|")}).success(function(ret){
                console.log(ret);
            });
        };
        var Api = $resource('/api/order/orderdetail/');
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            order_id: $scope.orderid
        }, {
            total: 0,           // length of data
            getData: function($defer, params) {
                // ajax request to api
                Api.get(params.url(), function(data) {
                    $timeout(function() {
                        // update table params
                        params.total(data.total);
                        // set new data
                        $scope.formData = [];
                        data.result.forEach(function(item, index){
                            $scope.formData.push({
                                oid: item.oid,
                                good_number:item.good_number,
                                price: item.good_price||0,
                                good_id: item.good_id
                            });
                        });
                        $defer.resolve(data.result);
                    }, 500);
                });
            }
        });
        $scope.del = function(id){
            var orderdetail = new OrderDetailFeed({id: id});
            orderdetail.$delete(function(ret){
                console.log(ret);
                if(ret.status == 500){
                    alert('系统错误'+"\n"+ret.err);
                    return;
                }
                alert('删除成功');
                window.location.reload();
            })
        };
        // 自动填充报价单
        $scope.autoPrice = function(){
            $http.get('/api/order/autoprice/'+$scope.orderid).success(function(datas){
                var ret = datas.data;
                $scope.formData.forEach(function(_,index){
                    ret.forEach(function(r){
                        if(r.good_id == _.good_id){
                            $scope.formData[index].price = r.price;
                        }
                    })
                });
            });
        };


    }
]);


mainControllers.controller('rejectItems', [
    '$resource',
    'ngTableParams',
    '$route',
    "$document",
    "smartySuggestor",
    "$window",'$rootScope','$http','$scope','$timeout','OrderDetailFeed','OrderFeed',
    function(
        $resource,
        ngTableParams,
        $route,$document, smartySuggestor, $window,$rootScope,$http,$scope, $timeout, OrderDetailFeed, RoleFeed) {
        $scope.orderid = $route.current.params.orderid;
        $scope.companyid = $route.current.params.comp_id;
        $scope.processForm = function(){
            var oid = [],good_reject = [];
            $scope.formData.forEach(function(item){
                oid.push(item.oid);
                good_reject.push(item.good_reject);
            });

            $http.post('/api/order/rejectItems', {orderid:$scope.orderid,good_reject:good_reject.join("|"),oid:oid.join("|")}).success(function(ret){
                if(ret.status == 200){
                    alert('拒收成功，请等待确认');
                    window.history.back();
                }else{
                    alert('拒收失败，请刷新页面重试');
                }

            });
        };
        var Api = $resource('/api/order/orderdetail/');
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            order_id: $scope.orderid
        }, {
            total: 0,           // length of data
            getData: function($defer, params) {
                // ajax request to api
                Api.get(params.url(), function(data) {
                    $timeout(function() {
                        // update table params
                        params.total(data.total);
                        // set new data
                        $scope.formData = [];
                        data.result.forEach(function(item, index){
                            $scope.formData.push({
                                oid: item.oid,
                                good_reject: item.good_reject,
                                good_id: item.good_id
                            });
                        });
                        $defer.resolve(data.result);
                    }, 500);
                });
            }
        });

    }
]);

mainControllers.controller('orderItemAdd', [
    'Upload',
    '$resource',
    'ngTableParams',
    '$route',
    "$document",
    "smartySuggestor",
    "$window",'$rootScope','$http','$scope','$timeout','OrderDetailFeed','OrderFeed',
    function(
        Upload,
        $resource,
        ngTableParams,
        $route,$document, smartySuggestor, $window,$rootScope,$http,$scope, $timeout, OrderDetailFeed, RoleFeed) {
        $scope.orderid = $route.current.params.orderid;
        $scope.companyid = $route.current.params.comp_id;
        $scope.order_status = $route.current.params.order_status;
        $scope.showAdd = $scope.order_status == 1 ? true: false;
        // 需要调取对应批发企业有的数据
        smartySuggestor.setConfig({requestUrl:"/api/items/suggestHAS",params:{companyid:$scope.companyid}});


        $scope.suggestions = [];
        $scope.prefix = "";
        $scope.selected = -1;
        $scope.selectionMade = true;
        $scope.zip = "";

        $scope.$watch("prefix", function(newValue, oldValue) {
            if (newValue != oldValue && $scope.selectionMade == false) {
                if ($scope.prefix == "" || angular.isUndefined($scope.prefix)) {
                    $scope.suggestions = [];
                    $scope.selected = -1;
                } else {
                    var promise = smartySuggestor.getSmartySuggestions($scope.prefix);
                    promise.then(function(data) {
                        $scope.suggestions = data;
                    });
                }
            }
        });

        $scope.clickedSomewhereElse = function() {
            $scope.selected = -1;
            $scope.suggestions = [];
        };

        $document.bind("click", onDocumentClick);

        $scope.$on("$destroy", function() {
            $document.unbind("click", onDocumentClick);
        })
        function onDocumentClick() {
            $scope.$apply($scope.clickedSomewhereElse());
        }

        $scope.suggestionPicked = function() {
            if ($scope.selected != -1 && $scope.selected < $scope.suggestions.length) {
                $scope.prefix = $scope.suggestions[$scope.selected];
            }
            $scope.selectionMade = true;
            $scope.suggestions = [];
        };

        $scope.setSelected = function(newValue) {
            if (newValue > $scope.suggestions.length) {
                $scope.selected = 0;
            } else if (newValue < 0) {
                $scope.selected = $scope.suggestions.length;
            } else {
                $scope.selected = newValue;
            }

            $scope.formData.good_id = $scope.suggestions[$scope.selected].split('|')[0];
        };
        var order = {
            order_id: "",
            good_id: "",
            good_name: "",
            good_number: 10,
            random:+Date.now()
        };
        $scope.formData = [order];
        $scope.addnew = function(){
            $scope.formData.push({
                order_id: "",
                good_id: "",
                good_name: "",
                good_number: 10,
                random:+Date.now()
            });
        };
        $scope.formData = {
            good_id:"",
            good_number:10,
            order_id:$scope.orderid
        };
        $scope.processForm = function(){
            console.log($scope.formData);

            if(!/^D[0-9]{16}$/.test($scope.formData.order_id)){
                alert('订单ID错误');
                return;
            }

            if(!/^[0-9]{7}$/.test($scope.formData.good_id)){
                alert('请选择正确的商品编号');
                return;
            }
            var order = new OrderDetailFeed($scope.formData);
            order.$save(function(ret){
                if(ret.err){
                    alert(ret.err.message);
                    return;
                }
                if(ret.status == 200){
                    alert('新增成功，即将返回列表页面');
                    window.location.reload();
                }
            });
        };
        var Api = $resource('/api/order/orderdetail/');
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            order_id: $scope.orderid
        }, {
            total: 0,           // length of data
            getData: function($defer, params) {
                // ajax request to api
                Api.get(params.url(), function(data) {
                    $timeout(function() {
                        // update table params
                        params.total(data.total);
                        // set new data
                        $defer.resolve(data.result);
                    }, 500);
                });
            }
        });
        $scope.del = function(id){
            var orderdetail = new OrderDetailFeed({id: id});
            orderdetail.$delete(function(ret){
                console.log(ret);
                if(ret.status == 500){
                    alert('系统错误'+"\n"+ret.err);
                    return;
                }
                alert('删除成功');
                window.location.reload();
            })
        };

        $scope.upload = function (files) {
            if (files && files.length) {
              for (var i = 0; i < files.length; i++) {
                  var file = files[i];
                  Upload.upload({
                      url: 'api/order/multiOrders',
                      fields: {'orderid': $scope.orderid},
                      file: file
                  }).progress(function (evt) {
                      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                      console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                  }).success(function (data, status, headers, config) {
                      console.log('file ' + config.file.name + 'uploaded. Response: ' + data);

                      if(data.status == 200){
                          alert('解析成功');
                          window.location.reload();
                      }else{
                          alert(data.msg);
                      }
                  });
              }
            };
        };


    }
]);

mainControllers.controller('orderItemView', ["$document", "smartySuggestor", "$window",'$rootScope','$http','$scope','$timeout','OrderFeed','OrderFeed',
    function($document, smartySuggestor, $window,$rootScope,$http,$scope, $timeout, OrderFeed, RoleFeed) {
        smartySuggestor.setConfig({requestUrl:"/api/comp/suggest"});
        $scope.suggestions = [];
        $scope.prefix = "";
        $scope.selected = -1;
        $scope.selectionMade = false;
        $scope.zip = "";

        $scope.$watch("prefix", function(newValue, oldValue) {
            if (newValue != oldValue && $scope.selectionMade == false) {
                if ($scope.prefix == "" || angular.isUndefined($scope.prefix)) {
                    $scope.suggestions = [];
                    $scope.selected = -1;
                } else {
                    var promise = smartySuggestor.getSmartySuggestions($scope.prefix);
                    promise.then(function(data) {
                        $scope.suggestions = data;
                    });
                }
            }
        });

        $scope.clickedSomewhereElse = function() {
            $scope.selected = -1;
            $scope.suggestions = [];
        };

        $document.bind("click", onDocumentClick);
        $scope.$on("$destroy", function() {
            $document.unbind("click", onDocumentClick);
        })
        function onDocumentClick() {
            $scope.$apply($scope.clickedSomewhereElse());
        }

        $scope.suggestionPicked = function() {
            if ($scope.selected != -1 && $scope.selected < $scope.suggestions.length) {
                $scope.prefix = $scope.suggestions[$scope.selected];
            }
            $scope.selectionMade = true;
            $scope.suggestions = [];
        };

        $scope.setSelected = function(newValue) {
            if (newValue > $scope.suggestions.length) {
                $scope.selected = 0;
            } else if (newValue < 0) {
                $scope.selected = $scope.suggestions.length;
            } else {
                $scope.selected = newValue;
            }

            $scope.formData.supplie_id = $scope.suggestions[$scope.selected].split('|')[0];
        };


        $scope.lists = [];
        $scope.order_type_list = [
            {val: 1, name:'直接订单'},
            {val: 2, name:'询价订单'},
        ];
        $scope.formData = {
            supplie_id: "",
            order_oper: $rootScope.user.realname,
            order_beizu: "",
            order_date: (new Date()).Format("yyyyMMdd"),
            order_lastvaiddate: "",
            order_status:1,
            order_type:1,
            comp_id: $rootScope.user.comp_id
        };

        $scope.processForm = function(){
            console.log($scope.formData);
            if(!/^2[0-9]{5}$/.test($scope.formData.supplie_id)){
                alert('请选择供应商');
                return;
            }
            if(!/^[0-9]{8}$/.test($scope.formData.order_date)){
                alert('请输入正确订单日期');
                return;
            }
            if(!/^[0-9]{8}$/.test($scope.formData.order_lastvaiddate)){
                alert('请输入正确的交货订单日期');
                return;
            }
            var order = new OrderFeed($scope.formData);
            order.$save(function(ret){
                if(ret.err){
                    alert(ret.err.message);
                    return;
                }
                if(ret.status == 200){
                    alert('新增成功，即将返回列表页面');
                    window.history.back();
                }
            });
        }

    }
]);

mainControllers.controller('UserEdit', ['$route','$http','$scope','$timeout','UserFeed','RoleFeed',
    function($route, $http,$scope, $timeout, UserFeed, RoleFeed) {
        var uid = $route.current.params.id
        $scope.lists = [];
        $scope.roles = RoleFeed.query();
        $scope.formData = {
            username: "",
            password: "",
            realname: "",
            comp_id: -1,
            role_id: 1,
            tel:"",
            phone:"",
            email: "",
            state: 0
        };
        UserFeed.getOne({id: uid}, function(ret){
            console.log('user', ret)
            for(var key in ret.data){
                if(ret.data.hasOwnProperty(key)){
                    $scope.formData[key] = ret.data[key];

                }
            }
            $scope.formData.password="";
        });
        $scope.processForm = function(){
            console.log($scope.formData);
            delete $scope.formData.id;
            if($scope.formData.password == ""){
                delete $scope.formData.password;
            }
            var user = new UserFeed($scope.formData);
            user.$update({id: uid},function(ret){
                if(ret.err){
                    alert(ret.err.message);
                    return;
                }
                if(ret.status == 200){
                    alert('修改成功，即将返回列表页面');
                    window.history.back();
                }
            });
        }

    }
]);

mainControllers.controller('UserCreate', ['$http','$scope','$timeout','UserFeed','RoleFeed',
    function($http,$scope, $timeout, UserFeed, RoleFeed) {
        $scope.lists = [];
        $scope.roles = RoleFeed.query();
        $scope.formData = {
            username: "",
            password: "",
            realname: "",
            comp_id: -1,
            role_id: 1,
            tel:"",
            phone:"",
            email: "",
            state: 0
        };

        $scope.processForm = function(){
            console.log($scope.formData);
            var user = new UserFeed($scope.formData);
            user.$save(function(ret){
                if(ret.err){
                    alert(ret.err.message);
                    return;
                }
                if(ret.status == 200){
                    alert('新增成功，即将返回列表页面');
                    window.history.back();
                }
            });
        }

    }
]);


// 角色界面
mainControllers.controller('RoleList', ['$http','$scope','$timeout','RoleFeed',
    function($http,$scope, $timeout, RoleFeed) {
        $scope.lists = RoleFeed.query();
        $scope.del = function(id){
            var role = new RoleFeed({id: id});
            role.$delete(function(ret){
                console.log(ret);
                if(ret.status == 500){
                    alert('系统错误'+"\n"+ret.err);
                    return;
                }
                alert('删除成功');
                window.location.reload();
            })
        }
    }
]);

mainControllers.controller('CategoryList', ['$http','$scope','$timeout','CategoryService',
    function($http,$scope, $timeout, CategoryService) {
        $scope.categories = CategoryService.query();
        $scope.formData={};
        $scope.add = function(parentid, formDataId){
            console.log(parentid, $scope.formData[parentid]);
            if($scope.formData[parentid].trim() == ""){
                alert('请输入分类名称');
                return;
            }
            var category = new CategoryService({
                cat_name: $scope.formData[parentid],
                parent_id: parentid
            });
            category.$save(function(ret){
                if(ret.err){
                    alert(ret.err.message);
                    return;
                }
                if(ret.status == 200){
                    alert('新增成功，即将刷新列表');
                    window.location.reload()
                }
            });
        };
    }
]);

mainControllers.controller('RoleCreate', ['$http','$scope','$timeout','RoleFeed',
    function($http,$scope, $timeout, RoleFeed) {
        $scope.lists = [];

        $scope.formData = {role_name: "", role_type: 0};

        $scope.processForm = function(){
            console.log($scope.formData);
            var role = new RoleFeed($scope.formData);
            role.$save(function(ret){
                if(ret.err){
                    alert(ret.err.message);
                    return;
                }
                if(ret.status == 200){
                    alert('新增成功，即将返回列表页面');
                    window.history.back();
                }
            });
        }

    }
]);

mainControllers.controller('ItemCreate', ['$http','$scope','$timeout','CategoryService','ItemFeed',
    function($http,$scope, $timeout, CategoryService,ItemFeed) {

        $scope.lists = [];

        $scope.formData = {
            category_0: -1,
            category_1: -1,
            category_2: -1,
            good_new: 0
        };
        $scope.categories_0 = [];
        $scope.categories_1 = [];
        $scope.categories_2 = [];
        $scope.categories = CategoryService.query();
        $scope.$watch('formData.category_0', function(){
            $scope.formData.category_1 = -1;
            $scope.formData.category_2 = -1;
            if(parseInt($scope.formData.category_0) === -1){
                $scope.categories_1 = [];
                $scope.categories_2 = [];

            }else{
                // console.log($scope.categories.data, $scope.formData.category_0);

                $scope.categories.data && $scope.categories.data.forEach(function(item){
                    if(item.id === parseInt($scope.formData.category_0)){
                        console.log(item.children);
                        $scope.categories_1 = item.children;
                    }
                });
            }
        });

        $scope.$watch('formData.category_1', function(){
            $scope.formData.category_2 = -1;
            if(parseInt($scope.formData.category_1) === -1){
                $scope.categories_2 = [];

            }else{
                // console.log($scope.categories.data, $scope.formData.category_0);

                $scope.categories_1 && $scope.categories_1.forEach(function(item){
                    if(item.id === parseInt($scope.formData.category_1)){
                        console.log(item.children);
                        $scope.categories_2 = item.children;
                    }
                });
            }
        });

        $scope.processForm = function(){

            $scope.formData.good_cat = $scope.formData.category_2;
            delete $scope.formData.category_0;
            delete $scope.formData.category_1;
            delete $scope.formData.category_2;
            console.log($scope.formData);
            //return ;
            var item = new ItemFeed($scope.formData);
            item.$save(function(ret){
                if(ret.err){
                    alert(ret.err.message);
                    return;
                }
                if(ret.status == 200){
                    alert('新增成功，即将返回列表页面');
                    window.history.back();
                }
            });
        }

    }
]);

mainControllers.controller('ItemEdit', ['$route','$http','$scope','$timeout','CategoryService','ItemFeed',
    function($route, $http,$scope, $timeout, CategoryService,ItemFeed) {
        var itemid = $route.current.params.id;
        $scope.lists = [];

        $scope.formData = {
            category_0: -1,
            category_1: -1,
            category_2: -1,
            good_new: 0
        };
        $scope.categories = CategoryService.query();
        if(itemid){
            ItemFeed.get({id: itemid}, function(ret){
                console.log('item feed get', ret);
                for(var key in ret.data){
                    if(ret.data.hasOwnProperty(key)){
                        $scope.formData[key] = ret.data[key];
                    }
                }
                //$scope.formData.category_2 = $scope.formData.good_cat;
                $scope.categories.data.forEach(function(cat){

                    cat.children.forEach(function(cat_1){
                        cat_1.children.forEach(function(cat_2){

                            if(cat_2.id === $scope.formData.good_cat){
                                console.log('find current')
                                $scope.formData.category_0 = cat.id;
                                $timeout(function(){
                                    $scope.formData.category_1 = cat_1.id;
                                    $timeout(function(){
                                        $scope.formData.category_2 = cat_2.id;
                                    },500)
                                },500)
                            }
                        });
                    });
                });
            });
            //console.log(query);
        }
        $scope.categories_0 = [];
        $scope.categories_1 = [];
        $scope.categories_2 = [];

        $scope.$watch('formData.category_0', function(){
            $scope.formData.category_1 = -1;
            $scope.formData.category_2 = -1;
            if(parseInt($scope.formData.category_0) === -1){
                $scope.categories_1 = [];
                $scope.categories_2 = [];

            }else{
                // console.log($scope.categories.data, $scope.formData.category_0);

                $scope.categories.data && $scope.categories.data.forEach(function(item){
                    if(item.id === parseInt($scope.formData.category_0)){
                        console.log(item.children);
                        $scope.categories_1 = item.children;
                    }
                });
            }
        });

        $scope.$watch('formData.category_1', function(){
            $scope.formData.category_2 = -1;
            if(parseInt($scope.formData.category_1) === -1){
                $scope.categories_2 = [];

            }else{
                // console.log($scope.categories.data, $scope.formData.category_0);

                $scope.categories_1 && $scope.categories_1.forEach(function(item){
                    if(item.id === parseInt($scope.formData.category_1)){
                        console.log(item.children);
                        $scope.categories_2 = item.children;
                    }
                });
            }
        });

        $scope.processForm = function(){

            $scope.formData.good_cat = $scope.formData.category_2;
            delete $scope.formData.category_0;
            delete $scope.formData.category_1;
            delete $scope.formData.category_2;
            console.log($scope.formData);
            //return ;
            var item = new ItemFeed($scope.formData);
            var id = $scope.formData.good_id;
            delete $scope.formData.good_id;
            delete $scope.formData.good_company;
            item.$update({id: id}, function(ret){
                if(ret.err){
                    alert(ret.err.message);
                    return;
                }
                if(ret.status == 200){
                    alert('修改成功，即将返回列表页面');
                    window.history.back();
                }
            });
        }

    }
]);

mainControllers.controller('RoleEdit', ['$http','$scope',
    function($http,$scope) {
        $scope.lists = [];
    }
]);

mainControllers.controller('PushCreate', ['$http','$scope','PushFeed',
    function($http,$scope, PushFeed) {
        $scope.formData = {
            msg: ""
        };
        $scope.processForm = function(){
            var push = new PushFeed($scope.formData);
            push.$save(function(ret){
                if(ret.err){
                    alert(ret.err.message);
                    return;
                }
                if(ret.status == 200){
                    alert('新增成功，即将返回列表页面');
                    window.history.back();
                }
            });
        }
    }
]);

mainControllers.controller('PushList', ['$http','$scope','PushFeed',
    function($http,$scope, PushFeed) {
        $scope.lists = PushFeed.query();
        console.log($scope.lists);
    }
]);

mainControllers.controller('CompCreate', ['$http','$scope','CompFeed',
    function($http,$scope,CompFeed) {
        $scope.formData = {
            type: 1,
            status: 0
        };
        $scope.processForm = function(){

            console.log($scope.formData);
            //return ;
            var company = new CompFeed($scope.formData);
            company.$save(function(ret){
                if(ret.err){
                    alert(ret.err.message);
                    return;
                }
                if(ret.status == 200){
                    alert('新增成功，即将返回列表页面');
                    window.history.back();
                }
            });
        }
    }
]);

mainControllers.controller('CompEdit', ['$route','$http','$scope','CompFeed',
    function($route,$http,$scope,CompFeed) {
        var comp_id = $route.current.params.id
        $scope.formData = {
        };
        CompFeed.getOne({id: comp_id}, function(ret){
            console.log('user', ret)
            for(var key in ret.data){
                if(ret.data.hasOwnProperty(key)){
                    $scope.formData[key] = ret.data[key];
                }
            }
        });

        $scope.processForm = function(){

            console.log($scope.formData);
            //return ;
            var company = new CompFeed($scope.formData);
            company.$update({id: comp_id}, function(ret){
                if(ret.err){
                    alert(ret.err.message);
                    return;
                }
                if(ret.status == 200){
                    alert('修改成功，即将返回列表页面');
                    window.history.back();
                }
            });
        }
    }
]);