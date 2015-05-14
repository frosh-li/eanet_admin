'use strict';

/* authsControllers */

var authsControllers = angular.module('authsControllers', ['ngTable']);

authsControllers.controller('authsUser', ['$http','$scope','AuthUser',
  function($http,$scope,AuthUser) {

    $scope.lists = AuthUser.query();
    console.log($scope.lists);

  }]);

authsControllers.controller('authsGroupList', ['$http','$scope','AuthGroupList',
  function($http,$scope,AuthGroupList) {

    $scope.lists = AuthGroupList.query();
    console.log($scope.lists);

  }]);

authsControllers.controller('authsGroupAdd', ['$http','$scope','AuthGroupList',
  function($http,$scope,AuthGroupList) {

    $scope.lists = AuthGroupList.query();
    console.log($scope.lists);

  }]);

authsControllers.controller('authsCreateUser', ['$http','$scope','AuthUser','AuthGroupList',
  function($http,$scope,AuthUser,AuthGroupList) {

    $scope.grouplists = AuthGroupList.query();
    console.log($scope.grouplists);

    $scope.formData = {username:"周如金",password:"1234454",group:""};

    $scope.selectChange = function(){
      console.log($scope.formData.group);
    }

    $scope.processForm = function(){
      var token = localStorage.getItem('token');
      var uid = localStorage.getItem('uid');
      
      console.log($.param($scope.formData));
      
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
  function($http,$scope,AuthApiList) {

    // $scope.lists = AuthApiList.query();
    $scope.hanldeTree = function(obj){
        var env = window.event || e;
        console.log(env.target);
    }
    $scope.lists = {
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
    console.log($scope.lists);

  }]);

authsControllers.controller('authsApiAdd', ['$http','$scope','AuthGroupList',
  function($http,$scope,AuthGroupList) {

    $scope.lists = AuthGroupList.query();
    $scope.formData = {code:"模块标识",model:"模块名称"}; 
    
    var vm = $scope.vm = {};
    vm.items = ['item1'];
    vm.itemId = 3;
    
    vm.addItem = function() {
      vm.items.push('item' + vm.itemId);
      vm.itemId++;
    };
    
    vm.delItem = function(index) {
      vm.items.splice(index, 1);
    };

  }]);
