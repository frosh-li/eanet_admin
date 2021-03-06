'use strict';

/* App Module */
var storeApp = angular.module('storeApp', [
    'ngRoute',
    'ngResource',
    /*
    'authsServices',
    'authsControllers',
    'storeAppFilters',
    'storeAppFactories',
    */
    'storeAppFilters',
    'ngTasty',
    'mainControllers',
    'mainServices',
    'ngFileUpload'
    /*detectedControllerService*/
    //'couponServices',
    //'couponControllers'
    /*endDetectedControllerService*/
]);

storeApp.config(['$routeProvider','$httpProvider',
  function($routeProvider,$httpProvider) {

    [
      /*detectedRouters*/
      {name: 'comp', subName:'Comp'},
      {name: 'user', subName:'User'},
      {name: 'role', subName:'Role'},
      {name: 'comp_map', subName:'Comp_map'},

      /*endDetectedRouters*/
    ].forEach(function(router){
        $routeProvider.
            when('/'+router.name+'/'+router.subName.toLowerCase()+"/edit:id",{
                templateUrl:'views/'+router.name+"/"+'create.html',
                controller: router.subName+"Edit"
            }).
            when('/'+router.name+'/'+router.subName.toLowerCase()+"/create",{
                templateUrl:'views/'+router.name+"/"+'create.html',
                controller: router.subName+"Create"
            }).
            when('/'+router.name+'_list/',{
                templateUrl:'views/'+router.name+"/"+'list.html',
                controller: router.subName+"List"
            })
    });
    $routeProvider.when('/companyRelate/:companyid',{
        templateUrl:'views/companyRelate/list.html',
        controller: 'companyRelateList'
    });
    $routeProvider.when('/companyRelate/setup/:companyid',{
        templateUrl:'views/companyRelate/list_yd.html',
        controller: 'companyRelateYdList'
    });

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
              //$("#ajaxLoading").html('数据加载中，请稍等').fadeIn(500);
            }
            return config;
          }
        }
      });

      $httpProvider.responseInterceptors.push(function($q){
        return function(promise){
          return promise.then(function(response){
            //if(document.getElementById('ajaxLoading').style.display!='none'){
              //$("#ajaxLoading").html('数据加载完成').fadeOut(2000);
            //}
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