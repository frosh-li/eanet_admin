'use strict';

/* employeeControllers */

var employeeControllers = angular.module('employeeControllers', ['ngTable']);

employeeControllers.controller('employeeEmployeeList', ['$http','$scope','Employees',
  function($http,$scope,Employees) {
    console.log('haap');
    $scope.deleteArray = [];
    $scope.lists = Employees.query();
    console.log($scope.lists);
    $scope.SaveOne = function(employee){
      console.log(employee);
      employee.$update({catid: employee._id});
    };
  }]);

employeeControllers.controller('employeeEmployeeEdit', ['$scope','$routeParams','Employees',
  function($scope,$routeParams, Employees) {
    var id = $routeParams.id;
    $scope.employee = Employees.getOne({id: id});
    $scope.save = function(employee){
      console.log(employee);
      employee.$update(function(data){
        if(data.status == true){
          console.log('添加成功');
        }
      });
    };
  }]);

employeeControllers.controller('employeeEmployeeCreate', ['$scope','Employees',
  function($scope, Employees) {
    $scope.employee = new Employees();
    $scope.save = function(employee){
      console.log(employee);
      employee.$save(function(data){
        if(data.status == true){
          console.log('添加成功');
        }
      });
    };
    
  }]);

