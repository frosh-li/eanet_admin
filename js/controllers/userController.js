'use strict';

/* userControllers */

var userControllers = angular.module('userControllers', ['ngTable']);

userControllers.controller('UserProfile',['$http','$scope'],function($http,$scope){
    $scope.username = "lijunliang";
});
