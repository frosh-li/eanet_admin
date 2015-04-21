'use strict';

/* storeSaleControllers */

var storeSaleControllers = angular.module('storeSaleControllers', ['ngTable']);

storeSaleControllers.controller('dataentryCustomersList', ['$http','$scope','Customers',
  function($http,$scope,Customers) {
    console.log('haap');
    $scope.deleteArray = [];
    $scope.lists = Customers.query({page_number: 1, page_size:20});
    console.log($scope.lists);
    $scope.SaveOne = function(customer){
      console.log(customer);
      customer.$update({catid: customer._id});
    };
  }]);

storeSaleControllers.controller('dataentryCustomersEdit', ['$scope','$routeParams','Customers',
  function($scope,$routeParams, Customers) {
    var id = $routeParams.id;
    $scope.customer = Customers.getOne({id: id});
    $scope.save = function(customer){
      console.log(customer);
      customer.$update(function(data){
        if(data.status == true){
          console.log('添加成功');
        }
      });
    };
  }]);

storeSaleControllers.controller('dataentryCustomersCreate', ['$scope','Customers',
  function($scope, Customers) {
    $scope.customer = new Customers();
    $scope.save = function(customer){
      console.log(customer);
      customer.$save(function(data){
        if(data.status == true){
          console.log('添加成功');
        }
      });
    };
    
  }]);



storeSaleControllers.controller('salesOrderList', ['$http','$scope','Orders',
  function($http,$scope,Orders) {
    $scope.lists = Orders.query();
  }]);

storeSaleControllers.controller('salesOrderEdit', ['$scope','$routeParams','Orders',
  function($scope,$routeParams, Orders) {
    var id = $routeParams.id;
    $scope.order = Orders.getOne({id: id});
    $scope.save = function(order){
      console.log(order);
      order.$update(function(data){
          console.log('添加成功');
      });
    };
  }]);

storeSaleControllers.controller('salesOrderCreate', ['$scope','Orders',
  function($scope, Orders) {
    $scope.order = new Orders();
    $scope.save = function(customer){
      console.log(order);
      order.$save(function(data){
          console.log('添加成功');
      });
    };
    
  }]);
