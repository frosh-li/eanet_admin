'use strict';

/* authsControllers */

var authsControllers = angular.module('authsControllers', ['ngTable']);

authsControllers.controller('authsUserList', ['$http','$scope','AuthUser',
  function($http,$scope,AuthUser) {

      $scope.delUser = function(id,index){
          if(!confirm("确定删除")){
              return false;
          }

          AuthUser.delete({id:id}).$promise.then(function(data){
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
      
      var limit = 10;
      var page = 1;
      $scope.filterBy = {
        'orderNos': '',
        'mobile': '',
        'cardNo': '',
        'orderStatus': '',
        'tradeCodes': '',
        'startDate': '',
        'endDate': '',
        'tradeSrc': ''
      }
      
      $scope.getResource = function (params, paramsObj) {
          paramsObj.limit = paramsObj.count;
          paramsObj.p = paramsObj.page;
          params = params.replace('page=', 'p=');
          params += '&limit='+paramsObj.count;
          params = {page:paramsObj.page,count:paramsObj.count,limit:paramsObj.count}
          return AuthUser.query(params).$promise.then(function(response){
              response.header = [];
              var data =  {
                'rows': response.data,
                'header': response.header,
                'pagination': {
                    "count": paramsObj.count,
                    "page": paramsObj.page,
                    "pages": Math.ceil(response.totalCount/paramsObj.count),
                    "size": response.totalCount
                }
              }
              
              return data;
          });
      }
      
  }

]);

authsControllers.controller('authsUserAdd', ['$http','$scope','AuthUser','AuthGroup','$routeParams','$location',
  function($http,$scope,AuthUser,AuthGroup,$routeParams,$location) {

    $scope.grouplists = AuthGroup.query();
    $scope.merchants = [];

    $scope.formData = {username:"", password:"", group:"", merchantID:"1", merchantName:""};
    
    if($routeParams.id){
        AuthUser.getOne({id : $routeParams.id}).$promise.then(function(res){
          $scope.formData = res.data;
        });
    }

    $scope.selectChange = function(){
        console.log($scope.formData.group);
    }
    
    var stime = 0,
		checktime = 0;
  	function wait(milli){
  		var dtd = $.Deferred();
  		setTimeout(function(){
  			var now = new Date().getTime();
  			if(now > milli + stime - 50){
  				if(stime > checktime + 10){
  					dtd.resolve();
  					checktime = stime;
  					return dtd;
  				}
  			}
  		},milli);
  		stime = new Date().getTime();
  		return dtd.promise(); 
  	}
    
    $scope.getMerchants = function(){
        var urlApi = globalConfig.api + 'v1/cdaservice/bp/merchants';
        var params = 'merchantName=' + $scope.formData.merchantName;
        wait(500).done(function(){
            $http.get(urlApi+"?"+params).then(function (response) {
                $scope.merchants = [];
                response.data.data.datas.forEach(function(m){
                    $scope.merchants.push(m);
                });
            });
        });
    }
    
    $scope.merchantShow = function(t){
        $scope.merchantNameShow = t;
    }
    
    $scope.setMerchantId = function(id){
        $scope.formData.merchantID = id;
        $scope.merchants = [];
    }

    $scope.processForm = function(){
      var authUser = new AuthUser($scope.formData);
      authUser.$save(function(data){
        if(data.status == 200){
          alert('操作成功， 正在返回列表页...');
          $location.path("/auths/listuser");
        }else{
          alert(data.msg);
        }

      }, function(err){
        console.log(err);
        alert('系统错误')
      });
    }

  }

]);

authsControllers.controller('authsGroupList', ['$http','$scope','AuthGroup',
  function($http,$scope,AuthGroup) {
    $scope.lists = AuthGroup.query();

    $scope.delGroup = function(id,index){
      if(!confirm("确定删除")){
          return false;
      }
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

  }

]);

authsControllers.controller('authsGroupAdd', ['$http','$scope','AuthGroup','AuthApi','$routeParams','TreeData','$location',
  function($http,$scope,AuthGroup,AuthApi,$routeParams,TreeData,$location) {
    var vm = $scope.vm = {};

    $scope.formData   =   {name:"", apilist:{}};

    AuthApi.query().$promise.then(function(res){
        $scope.formData.apilist = res.data;

        if($routeParams.id){
            AuthGroup.getOne({id : $routeParams.id}).$promise.then(function(res){
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
          alert('操作成功， 正在返回列表页...');
          $location.path('/auths/listgroup');
        }else{
          alert(data.msg);
        }
      }, function(err){
        console.log(err);
        alert('系统错误');
      });
    }

  }

]);

authsControllers.controller('authsApiList', ['$http','$scope','AuthApi',
  function($http,$scope,AuthApi) {

    $scope.lists = AuthApi.query();

    $scope.handleTree = function(obj){
        var env = window.event || e;
    }

    $scope.delModule = function(index,id){
      if(!confirm("确定删除")){
          return false;
      }
      AuthApi.delete({id:id}).$promise.then(function(data){
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

  }

]);

authsControllers.controller('authsApiAdd', ['$http','$scope','AuthApi','$routeParams','$location',
  function($http,$scope,AuthApi,$routeParams,$location) {
    $scope.formData = {code : "", model : "", uri : "", apilist : [{name:"", url:"", method:"get", isMenu:true}]};

    $scope.addItem = function() {
      $scope.formData.apilist.push({name:"", url:"", method:"get", isMenu:true});
    };

    $scope.delItem = function(index) {
      $scope.formData.apilist.splice(index,1);
    };

    $scope.show_error = true;
    $scope.show_type = 1;
    $scope.methods = ["get","post","put","delete"];
    $scope.title = "API注册";

    if($routeParams.id){
        AuthApi.getOne({id : $routeParams.id}).$promise.then(function(res){
          $scope.formData = res.data;
          $scope.formData.apilist = $scope.formData.innerApi;
        });
    }

    $scope.getPos = function(e){
        var pos = {url:$location.$$url, title:$scope.title, x:event.x, y:event.y};
        var localPos = [];

        if($routeParams.heatmap)
            return false;

        if(JSON.parse(localStorage.getItem($location.$$url)).length > 0){
            localPos = JSON.parse(localStorage.getItem($location.$$url));
            localPos.push(pos);
        }else{
            localPos = [pos];
        }
        localStorage.setItem($location.$$url,JSON.stringify(localPos));
    }

    $scope.processForm = function(){
      $scope.formData.innerApi = JSON.stringify($scope.formData.apilist);
      var authApi = new AuthApi($scope.formData);
      authApi.$save(function(data){
        if(data.status == 200){
          alert('操作成功， 正在返回列表页...');
          $location.path("/auths/listapi");
        }else{
          alert(data.msg);
        }
      }, function(err){
        console.log(err);
        alert('系统错误')
      });
    }

  }

]);