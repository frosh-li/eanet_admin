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
    $scope.lists = AuthGroup.query();
    console.log($scope.lists);
    
    $scope.delGroup = function(id,index){
      if(!confirm("确定删除")){
          return false; 
      }
      console.log(id,index);
      AuthGroup.delete({id:id}).$promise.then(function(data){
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

authsControllers.controller('authsGroupAdd', ['$http','$scope','AuthGroup','AuthApi','$routeParams','TreeData',
  function($http,$scope,AuthGroup,AuthApi,$routeParams,TreeData) {
    var vm = $scope.vm = {};
    
    $scope.formData   =   {name:"", apilist:{}};
        
    AuthApi.query().$promise.then(function(res){
        $scope.formData.apilist = res.data;
        
        if($routeParams.name){
            AuthGroup.getOne({name : $routeParams.name}).$promise.then(function(res){
              if(res.data){
                $scope.formData.name = res.data.name;
                $scope.formData.apilist.forEach(function(api){
                    api.items = api.innerApi;
                    api.items.forEach(function(item){
                        res.data.apilist.forEach(function(checkedItem){
                            if("/"+api.code + "/"  +item.url === checkedItem.url && item.method === checkedItem.method){
                                item.checked=true;
                                return;
                            }
                        });
                    });
                });
              }
                
            });
        }else{
          $scope.formData.apilist.forEach(function(api){
              api.items = api.innerApi;
          
              api.items.forEach(function(item){
                  item.checked=false;
              });
          });
        }
        
        vm.tree = new TreeData($scope.formData.apilist);
    });
    
    $scope.processForm = function(){
      var postParams = [];
      //$scope.formData.apilist = JSON.stringify($scope.formData.apilist);
      for(var i = 0, len = $scope.formData.apilist.length ; i < len ; i++){
        for(var j = 0, jlen = $scope.formData.apilist[i].innerApi.length ; j < jlen ; j++){
          if($scope.formData.apilist[i].innerApi[j].checked){
            postParams.push({
              url:"/" +$scope.formData.apilist[i].code + "/" + $scope.formData.apilist[i].innerApi[j].url,
              method:$scope.formData.apilist[i].innerApi[j].method
            });
          }
        }
      }
      
      var authGroup = new AuthGroup({
        groupname: $scope.formData.name,
        apilist: JSON.stringify(postParams)
      });
      
      authGroup.$save(function(data){
        if(data.status == 200){
          alert('新建成功');
        }else{
          alert(data.msg);
        }
      }, function(err){
        console.log(err);
        alert('系统错误');
      });
    }    

  }]);

authsControllers.controller('authsCreateUser', ['$http','$scope','AuthUser','AuthGroup',
  function($http,$scope,AuthUser,AuthGroup) {

    $scope.grouplists = AuthGroup.query();
    $scope.formData = {username:"", password:"", group:""};

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
    
    $scope.menu = ["不显示在菜单","显示在菜单"];
    $scope.lists = AuthApi.query();
    
    $scope.hanldeTree = function(obj){
        var env = window.event || e;
        console.log(env.target);
    }
    
    $scope.transBoole = function(b,type){
      if(type == "number")
        return b=="true"||b==1?1:0;
      if(type == "bool")
        return b=="true"||b==1?true:false;
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
      alert("aaa");
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
    $scope.transBoole = function(b,type){
      if(type == "number")
        return b=="true"||b==1?1:0;
      if(type == "bool")
        return b=="true"||b==1?true:false;
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
