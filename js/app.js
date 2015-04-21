'use strict';

/* App Module */

var apihost = "http://10.1.171.80:3000/";

var storeApp = angular.module('storeApp', [
    'ngRoute',
    /*detectedControllerService*/
    'couponServices',
    'couponControllers'
    /*endDetectedControllerService*/
]);
storeApp.config(['$routeProvider','$httpProvider',
  function($routeProvider,$httpProvider) {
    [
      /*detectedRouters*/
      {name: 'coupon', subName:'Coupon'},
      /*endDetectedRouters*/
    ].forEach(function(router){
      $routeProvider.
      when('/'+router.name+'/'+router.subName.toLowerCase(),{
        templateUrl:'templates/'+router.name+"/"+router.subName.toLowerCase()+'/'+'list.html',
        controller: router.name+router.subName+"List"
      }).
      when('/'+router.name+'/'+router.subName.toLowerCase()+"/edit:id",{
        templateUrl:'templates/'+router.name+"/"+router.subName.toLowerCase()+'/'+'create.html',
        controller: router.name+router.subName+"Edit"
      }).
      when('/'+router.name+'/'+router.subName.toLowerCase()+"/create",{
        templateUrl:'templates/'+router.name+"/"+router.subName.toLowerCase()+'/'+'create.html',
        controller: router.name+router.subName+"Create"
      })
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
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
      $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
      $httpProvider.defaults.headers.post['X-TOKEN'] = localStorage.getItem('token');
      $httpProvider.defaults.headers.put['X-TOKEN'] = localStorage.getItem('token');
      $httpProvider.defaults.headers.common['X-TOKEN'] = localStorage.getItem('token');
      $httpProvider.defaults.headers.post['X-UID'] = localStorage.getItem('uid');
      $httpProvider.defaults.headers.put['X-UID'] = localStorage.getItem('uid');
      $httpProvider.defaults.headers.common['X-UID'] = localStorage.getItem('uid');
      $httpProvider.interceptors.push(function($q){

        return {
          'request': function(config){
            console.log(config);
            if(config.url.indexOf('.html') < 0 && config.url.indexOf('refreshtoken') < 0){
              $("#ajaxLoading").html('Data Loading, Please Just Wait.....').fadeIn(500);
            }
            return config;
          }
        }
      });
      $httpProvider.responseInterceptors.push(function($q){
        return function(promise){
          return promise.then(function(response){
            if(document.getElementById('ajaxLoading').style.display!='none'){
              $("#ajaxLoading").html('Data Request Finished!').fadeOut(4000);
            }
            if(response.status && response.status == 300){
              console.log('需要登录');
              window.location = './login.html';
            }
            if(response.status && response.status == 301){
              console.log('权限不够');
              //throw new Error('not enough permissions');
              alert('not enough permissions');
              return $q.reject('not enough permissions');
            }
            if(response.status && response.status == 400){
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


  }]);

setInterval(checkLogin, 60000);


function checkLogin(){
    var token = localStorage.getItem('token');
    var uid = localStorage.getItem('uid');

    if(token && uid){
        $.ajax({
            url: apihost + "ucenter/refreshtoken",
            method:"POST",
            headers: {
              'X-TOKEN': token,
              'X-UID': uid
            },
            dataType:"json",
            success:function(data){
              console.log('data',data);
              if(data.status != 200){
                  localStorage.clear();
                  window.location="./login.html";
                  return;
              }
              if(data.data.token){
                  localStorage.setItem('token', data.data.token);
                  localStorage.setItem('uid', data.data.uid);
              }
            }
        });
    }else{
        localStorage.clear();
        window.location="./login.html";
    }
}
