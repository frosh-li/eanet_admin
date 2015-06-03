'use strict';

/* mainControllers */

var mainControllers = angular.module('mainControllers', ['ngTable','ngResource']);

mainControllers.controller('mainController', ['$http','$scope','AuthApi',
  function($http,$scope,AuthApi) {
      $scope.lists = AuthApi.query();
      var uinfo = {username:"",group:"",uid:""};
      if(localStorage.getItem('uinfo') && localStorage.getItem('uinfo') != "undefined"){
          uinfo = JSON.parse(localStorage.getItem('uinfo'));
      }
      $scope.username = uinfo.username;
      $scope.role = uinfo.group;
      $scope.uid = uinfo.uid;
  }

]);