
'use strict';

/* employeeControllers */

var purchaseControllers = angular.module('purchaseControllers', ['ngTable']);


purchaseControllers.controller('purchasePurchaseList', ['$http','$scope','Purchase',
  function($http,$scope,Purchase) {
    console.log('haap');
    $scope.deleteArray = [];
    $scope.lists = Purchase.query();
    console.log($scope.lists);
    $scope.SaveOne = function(purchase){
      console.log(purchase);
      purchase.$update({catid: purchase._id});
    };
  }]);

purchaseControllers.controller('purchasePurchaseEdit', ['$scope','$routeParams','Purchase',
  function($scope,$routeParams, Purchase) {
    var id = $routeParams.id;
    $scope.purchase = Purchase.getOne({id: id});
    $scope.save = function(purchase){
      console.log(purchase);
      purchase.$update(function(data){
        if(data.status == true){
          console.log('添加成功');
        }
      });
    };
  }]);

purchaseControllers.controller('purchasePurchaseCreate', ['$scope','Purchase',
  function($scope, Purchase) {
    $scope.purchase = new Purchase();
    $scope.save = function(purchase){
      console.log(purchase);
      purchase.$save(function(data){
        if(data.status == true){
          console.log('添加成功');
        }
      });
    };
    
  }]);



purchaseControllers.controller('purchaseReceivingList', ['$http','$scope','Receiving',
  function($http,$scope,Receiving) {
    console.log('haap');
    $scope.deleteArray = [];
    $scope.lists = Receiving.query();
    console.log($scope.lists);
    $scope.SaveOne = function(receiving){
      console.log(receiving);
      receiving.$update({catid: receiving._id});
    };
  }]);

purchaseControllers.controller('purchaseReceivingEdit', ['$scope','$routeParams','Receiving',
  function($scope,$routeParams, Receiving) {
    var id = $routeParams.id;
    $scope.receiving = Receiving.getOne({id: id});
    $scope.save = function(receiving){
      console.log(receiving);
      receiving.$update(function(data){
        if(data.status == true){
          console.log('添加成功');
        }
      });
    };
  }]);

purchaseControllers.controller('purchaseReceivingCreate', ['$scope','Receiving',
  function($scope, Receiving) {
    $scope.receiving = new Receiving();
    $scope.save = function(receiving){
      console.log(receiving);
      receiving.$save(function(data){
        if(data.status == true){
          console.log('添加成功');
        }
      });
    };
    
  }]);



purchaseControllers.controller('purchaseReturnsList', ['$http','$scope','Returns',
  function($http,$scope,Returns) {
    console.log('haap');
    $scope.deleteArray = [];
    $scope.lists = Returns.query();
    console.log($scope.lists);
    $scope.SaveOne = function(returns){
      console.log(returns);
      returns.$update({catid: returns._id});
    };
  }]);

purchaseControllers.controller('purchaseReturnsEdit', ['$scope','$routeParams','Returns',
  function($scope,$routeParams, Returns) {
    var id = $routeParams.id;
    $scope.returns = Returns.getOne({id: id});
    $scope.save = function(returns){
      console.log(returns);
      returns.$update(function(data){
        if(data.status == true){
          console.log('添加成功');
        }
      });
    };
  }]);

purchaseControllers.controller('purchaseReturnsCreate', ['$scope','Returns',
  function($scope, Returns) {
    $scope.returns = new Returns();
    $scope.save = function(returns){
      console.log(returns);
      returns.$save(function(data){
        if(data.status == true){
          console.log('添加成功');
        }
      });
    };
    
  }]);

