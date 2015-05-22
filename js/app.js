'use strict';

/* App Module */
var storeApp = angular.module('storeApp', [
    'ngRoute',
    'ngResource',
    'authsServices',
    'authsControllers',
    'storeAppFilters',
    'storeAppFactories',
    'mainControllers'
    /*detectedControllerService*/
    //'couponServices',
    //'couponControllers'
    /*endDetectedControllerService*/
]);

storeApp.config(['$routeProvider','$httpProvider',
  function($routeProvider,$httpProvider) {

    [
      /*detectedRouters*/
      {name: 'coupon', subName:'Coupon'}
      /*endDetectedRouters*/
    ].forEach(function(router){
        $routeProvider.
            when('/'+router.name+'/'+router.subName.toLowerCase()+"/edit:id",{
                templateUrl:'templates/'+router.name+"/"+router.subName.toLowerCase()+'/'+'create.html',
                controller: router.name+router.subName+"Edit"
            }).
            when('/'+router.name+'/'+router.subName.toLowerCase()+"/create",{
                templateUrl:'templates/'+router.name+"/"+router.subName.toLowerCase()+'/'+'create.html',
                controller: router.name+router.subName+"Create"
            })
    });

    $routeProvider
      .when('/auths/listuser',{
        templateUrl:'templates/auths/listuser.html',
        controller:'authsUserList'
      }).when('/auths/adduser', {
        templateUrl:'templates/auths/adduser.html',
        controller: 'authsUserAdd'
      }).when('/auths/edituser/:id',{
        templateUrl:'templates/auths/adduser.html',
        controller: 'authsUserAdd'
      }).when('/auths/listgroup',{
        templateUrl:'templates/auths/listgroup.html',
        controller:'authsGroupList'
      }).when('/auths/addgroup',{
        templateUrl:'templates/auths/addgroup.html',
        controller:'authsGroupAdd'
      }).when('/auths/editgroup/:id',{
        templateUrl:'templates/auths/addgroup.html',
        controller:'authsGroupAdd'
      }).when('/auths/listapi',{
        templateUrl:'templates/auths/listapi.html',
        controller:'authsApiList'
      }).when('/auths/addapi',{
        templateUrl:'templates/auths/addapi.html',
        controller:'authsApiAdd'
      }).when('/auths/editapi/:id',{
        templateUrl:'templates/auths/addapi.html',
        controller:'authsApiAdd'
      })

      $httpProvider.defaults.transformRequest = function(data){
        if(typeof data === 'object'){
          var ret = [];
          for(var key in data){
            if(data.hasOwnProperty(key) && key.charAt(0) !== "$")
              ret.push(key+"="+data[key]);
          }
          return ret.join("&");
        }
      };

      $httpProvider.interceptors.push(function($q){
        return {
          'request': function(config){
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
            $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
            /*
            $httpProvider.defaults.headers.post['X-TOKEN'] = localStorage.getItem('token');
            $httpProvider.defaults.headers.put['X-TOKEN'] = localStorage.getItem('token');
            $httpProvider.defaults.headers.common['X-TOKEN'] = localStorage.getItem('token');
            $httpProvider.defaults.headers.post['X-UID'] = localStorage.getItem('uid');
            $httpProvider.defaults.headers.put['X-UID'] = localStorage.getItem('uid');
            $httpProvider.defaults.headers.common['X-UID'] = localStorage.getItem('uid');
            */
            if(config.url.indexOf('.html') < 0 && config.url.indexOf('refreshtoken') < 0){
              $("#ajaxLoading").html('数据加载中，请稍等').fadeIn(500);
            }
            return config;
          }
        }
      });

      $httpProvider.responseInterceptors.push(function($q){
        return function(promise){
          return promise.then(function(response){
            if(document.getElementById('ajaxLoading').style.display!='none'){
              $("#ajaxLoading").html('数据加载完成').fadeOut(2000);
            }
            console.log(response);
            if(response.data && response.data.status == 302){
              console.log('需要登录');
              window.location = './login.html';
            }
            if(response.data && response.data.status == 301){
              console.log('权限不够');
              //throw new Error('not enough permissions');
              alert('权限不够');
              return $q.reject('not enough permissions');
            }
            if(response.data && response.data.status == 400){
              console.log(response.msg);
              alert(response.msg);
              return $q.reject(response.msg);
            }
            return response;
            //return $q.inject(response);
          },function(response){
            console.log('服务器内部错误');
            return $q.reject('服务器内部错误');
          });
        };
      });
      // refresh token
  }
]);

storeApp.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
      'self',
    // Allow loading from our assets domain. Notice the difference between * and **.
      '**']);
});

storeApp.config(function($controllerProvider, $compileProvider, $filterProvider, $provide) {
    storeApp.register = {
        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        factory: $provide.factory,
        service: $provide.service
    };
});
