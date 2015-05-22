'use strict';

/* mainControllers */

var mainControllers = angular.module('mainControllers', ['ngTable']);

mainControllers.controller('mainController', ['$http','$scope',
  function($http,$scope) {
  	  var uinfo = JSON.parse(localStorage.getItem('uinfo'));

      $scope.username = uinfo.username;
      $scope.role = uinfo.group;
      $scope.uid = uinfo.uid;
  }

]);