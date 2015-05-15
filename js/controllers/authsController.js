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
    
    $scope.menu = ["不显示","显示"];
    $scope.lists = AuthApi.query();
    
    $scope.hanldeTree = function(obj){
        var env = window.event || e;
        console.log(env.target);
    }
    
    $scope.transBoole = function(b){
      return b=="true"||b==1?1:0;
    }
    
    $scope.delModule = function(index,moduleCode){
      if(!confirm("确定删除")){
          return false; 
      }
      console.log(moduleCode);
      AuthApi.delete({code:moduleCode}).$promise.then(function(data){
          if(data.status == 200){
              alert("操作成功！ ");
              $scope.lists.data.splice(index,1);
          }else{
            alert(data.msg);
          }
      }, function(err){
          console.log(err);
          alert("系统错误！ ");
      });
    }

  }]);

authsControllers.controller('authsApiAdd', ['$http','$scope','AuthApi','$routeParams',
  function($http,$scope,AuthApi,$routeParams) {
    var vm = $scope.vm = [{name:"", url:"", method:"get", isMenu:true}];  
    
    $scope.addItem = function() {
      vm.push({name:"", url:"", method:"get", isMenu:true});
    };
    
    $scope.delItem = function(index) {
      vm.splice(index,1);
    };
    
    $scope.show_error = true;
    $scope.show_type = 1;
    $scope.methods = ["get","post","put","delete"];
    
    $scope.formData = {code : "", model : "", uri : "", apilist : vm};
    
    if($routeParams.code){
        AuthApi.getOne({code : $routeParams.code}).$promise.then(function(res){
          $scope.formData = res.data;
          $scope.formData.apilist = $scope.formData.innerApi;
        });
    }

    $scope.isMenu = [false,true];
    $scope.transBoole = function(b){
      return b=="true"||b==1?1:0;
    }

    $scope.processForm = function(){
      $scope.formData.innerApi = JSON.stringify($scope.formData.apilist);
      var authApi = new AuthApi($scope.formData);
      authApi.$save(function(data){
        if(data.status == 200){
          alert('注册成功');
          //$state.go("auths.apis");
        }else{
          alert(data.msg);
        }

      }, function(err){
        console.log(err);
        alert('系统错误')
      });
    }    

  }]);
