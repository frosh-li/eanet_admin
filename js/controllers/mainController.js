'use strict';

/* mainControllers */

var mainControllers = angular.module('mainControllers', ['ngTable','ngResource']);

mainControllers.controller('mainController', ['$http','$scope','AuthMenu',
  function($http,$scope,AuthMenu) {
      $scope.lists = AuthMenu.query();
      var uinfo = {username:"",group:"",uid:""};
      if(localStorage.getItem('uinfo') && localStorage.getItem('uinfo') != "undefined"){
          uinfo = JSON.parse(localStorage.getItem('uinfo'));
      }
      $scope.username = uinfo.username;
      $scope.role = uinfo.group;
      $scope.uid = uinfo.uid;
  }

]);