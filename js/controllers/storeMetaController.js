'use strict';

/* storeMetaControllers */

var storeMetaControllers = angular.module('storeMetaControllers', ['ngTable']);

storeMetaControllers.controller('dataentrySuppliersList', ['$http','$scope','Suppliers',
  function($http,$scope,Suppliers) {
    console.log('haap');
    $scope.deleteArray = [];
    $scope.lists = Suppliers.query();
    console.log($scope.lists);
    $scope.SaveOne = function(supplier){
      console.log(supplier);
      supplier.$update({catid: supplier._id});
    };
  }]);

storeMetaControllers.controller('dataentrySuppliersEdit', ['$scope','$routeParams','Suppliers',
  function($scope,$routeParams, Suppliers) {
    var id = $routeParams.id;
    $scope.supplier = Suppliers.getOne({id: id});
    $scope.save = function(supplier){
      console.log(supplier);
      supplier.$update(function(data){
        if(data.status == true){
          console.log('添加成功');
        }
      });
    };
  }]);

storeMetaControllers.controller('dataentrySuppliersCreate', ['$scope','Suppliers',
  function($scope, Suppliers) {
    $scope.supplier = new Suppliers();
    $scope.save = function(supplier){
      console.log(supplier);
      supplier.$save(function(data){
        if(data.status == true){
          console.log('添加成功');
        }
      });
    };
    
  }]);

storeMetaControllers.controller('dataentryStoresList', ['$http','$scope','Stores',
  function($http,$scope,Stores) {
    console.log('haap');
    $scope.deleteArray = [];
    $scope.lists = Stores.query();
    console.log($scope.lists);
    $scope.SaveOne = function(store){
      console.log(store);
      store.$update({catid: store._id});
    };
  }]);

storeMetaControllers.controller('dataentryStoresEdit', ['$scope','$routeParams','Stores',
  function($scope,$routeParams, Stores) {
    var id = $routeParams.id;
    $scope.store = Stores.getOne({id: id});
    $scope.save = function(store){
      console.log(store);
      store.$update(function(data){
        if(data.code == 200){
          console.log('添加成功');
        }
      });
    };
  }]);

storeMetaControllers.controller('dataentryStoresCreate', ['$scope','Stores',
  function($scope, Stores) {
    $scope.store = new Stores();
    $scope.save = function(store){
      console.log(store);
      store.$save(function(data){
        if(data.code == 200){
          console.log('添加成功');
        }
      });
    };
    
  }]);
