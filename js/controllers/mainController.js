'use strict';

/* mainControllers */

var mainControllers = angular.module('mainControllers', ['ngTable','ngResource']);

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