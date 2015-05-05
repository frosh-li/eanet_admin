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

authsControllers.controller('authsCreateUser', ['$http','$scope','AuthGroupList',
  function($http,$scope,AuthGroupList) {

    $scope.grouplist = AuthGroupList.query();
    console.log($scope.lists);

  }]);

