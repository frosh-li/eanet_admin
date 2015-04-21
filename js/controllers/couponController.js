
'use strict';

/* employeeControllers */

var couponControllers = angular.module('couponControllers', ['ngTable']);



couponControllers.controller('couponCouponList', ['$http','$scope','Coupon',
  function($http,$scope,Coupon) {
    $scope.deleteArray = [];
    $scope.coupons = Coupon.query();
    $scope.SaveOne = function(coupon){
      console.log(coupon);
      coupon.$update({catid: coupon._id});
    };
  }]);

couponControllers.controller('couponCouponEdit', ['$scope','$routeParams','Coupon',
  function($scope,$routeParams, coupon) {
    var id = $routeParams.id;
    $scope.coupon = coupon.getOne({id: id});
    $scope.save = function(coupon){
      console.log(coupon);
      coupon.$update(function(data){
        if(data.status == true){
          console.log('添加成功');
        }
      });
    };
  }]);

couponControllers.controller('couponCouponCreate', ['$scope','Coupon',
  function($scope, Coupon) {
    $scope.coupon = new Coupon();
    $scope.save = function(coupon){
      console.log(coupon);
      coupon.$save(function(data){
        if(data.status == true){
          console.log('添加成功');
        }
      });
    };

  }]);

