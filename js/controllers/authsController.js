'use strict';

/* authsControllers */

var authsControllers = angular.module('authsControllers', ['ngTable']);

authsControllers.controller('authsUserList', ['$http','$scope','AuthUserList',
  function($http,$scope,AuthUserList) {

    $scope.lists = AuthUserList.query();
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
  
authsControllers.controller('authsCreateUser', ['$http','$scope','AuthGroupList',
  function($http,$scope,AuthGroupList) {

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
    
      $.ajax({
        method  : 'POST',
        url     : globalConfig.api + "auths/newuser",
        data    : $.param($scope.formData),
        headers: {
          'X-TOKEN': token,
          'X-UID': uid
        },
      }).success(function(data) {
        console.log(data);
        if(data.status == 200){
          alert("注册成功！");
        }
        return false;
        if (!data.success) {
            $scope.errorName = data.errors.name;
            $scope.errorSuperhero = data.errors.superheroAlias;
        } else {
            $scope.message = data.message;
        }
      });
    }

  }]);

authsControllers.controller('authsApiList', ['$http','$scope','AuthApiList',
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


