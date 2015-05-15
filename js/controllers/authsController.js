'use strict';

/* authsControllers */

var authsControllers = angular.module('authsControllers', ['ngTable']);

authsControllers.controller('authsUser', ['$http','$scope','AuthUser',
  function($http,$scope,AuthUser) {

    $scope.lists = AuthUser.query();
    console.log($scope.lists);

  }]);

authsControllers.controller('authsGroupList', ['$http','$scope','AuthGroup',
  function($http,$scope,AuthGroup) {
    console.log("aaa");
    $scope.lists = AuthGroup.query();
    console.log($scope.lists);

  }]);

authsControllers.controller('authsGroupAdd', ['$http','$scope','AuthGroup',
  function($http,$scope,AuthGroup) {

    $scope.lists = AuthGroup.query();
    console.log($scope.lists);

  }]);

authsControllers.controller('authsCreateUser', ['$http','$scope','AuthUser','AuthGroup',
  function($http,$scope,AuthUser,AuthGroup) {

    $scope.grouplists = AuthGroup.query();
    console.log($scope.grouplists);
    $scope.formData = {username:"周如金",password:"1234454",group:""};

    $scope.selectChange = function(){
      console.log($scope.formData.group);
    }

    $scope.processForm = function(){
      var authUser = new AuthUser($scope.formData);
      authUser.$save(function(data){
        if(data.status == 200){
          alert('新建成功');
        }else{
          alert(data.msg);
        }

      }, function(err){
        console.log(err);
        alert('系统错误')
      });
    }

  }]);

authsControllers.controller('authsApiList', ['$http','$scope','AuthApi',
  function($http,$scope,AuthApi) {

    $scope.lists = AuthApi.query();
    
    $scope.hanldeTree = function(obj){
        var env = window.event || e;
        console.log(env.target);
    }
    
    console.log($scope.lists);
    
    $scope.listss = {
        data:[
          {
            name:"交易管理",
            innerApi:[
              {
                "name":"交易列表",
                "url":"order/list"
              },
              {
                "name":"新建交易",
                "url":"order/list"
              },
              {
                "name":"退换货",
                "url":"order/list"
              },
            ]
          },
          {
            name:"权限管理",
            innerApi:[
              {
                "name":"新建权限组",
                "url":"order/list"
              },
              {
                "name":"新建用户",
                "url":"order/list"
              },
              {
                "name":"权限组列表",
                "url":"order/list"
              },
            ]
          }
        ]
    };
    //console.log($scope.lists);

  }]);

authsControllers.controller('authsApiAdd', ['$http','$scope','AuthApi','$routeParams',
  function($http,$scope,AuthApi,$routeParams) {
    var vm = $scope.vm = [{name:"", url:"", method:"get", isMenu:true}];  
    
    vm.addItem = function() {
      vm.push({name:"", url:"", method:"get", isMenu:true});
    };
    
    vm.delItem = function(index) {
      vm.splice(index,1);
    };
    
    $scope.show_error = true;
    $scope.show_type = 1;
    $scope.methods = ["get","post","put","delete"];
    
    $scope.formData = {code : "", model : "", uri : "", innerApi : vm};
    if($routeParams.code){
        AuthApi.getOne({code : $routeParams.code}).$promise.then(function(res){
          $scope.formData = res.data;
          $scope.formData.apilist = $scope.formData.innerApi;
        });
    }    

    $scope.processForm = function(){
      $scope.formData.innerApi = JSON.stringify($scope.formData.apilist);
      var authApi = new AuthApi($scope.formData);
      authApi.$save(function(data){
        if(data.status == 200){
          alert('注册成功');
        }else{
          alert(data.msg);
        }

      }, function(err){
        console.log(err);
        alert('系统错误')
      });
    }    

  }]);
