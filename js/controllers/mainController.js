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

var mainControllers = angular.module('mainControllers', ['ngTable','ngResource']);
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

mainControllers.controller('OrderList', ['$http','ngTableParams','$scope','$timeout','$resource',
    function($http,ngTableParams,$scope, $timeout,$resource) {
        var Api = $resource('/api/order/order/');
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            type:2
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

mainControllers.controller('Yd_orderList', ['$http','ngTableParams','$scope','$timeout','$resource',
    function($http,ngTableParams,$scope, $timeout,$resource) {
        var Api = $resource('/api/order/order/');
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

mainControllers.controller('orderItemAdd', [
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
                    window.history.back();
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

mainControllers.controller('RoleEdit', ['$http','$scope',
    function($http,$scope) {
        $scope.lists = [];
    }
]);