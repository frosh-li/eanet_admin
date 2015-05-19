'use strict';

/* Filters */

var storeAppFilters = angular.module("storeAppFilters",[]);

storeAppFilters.filter('boole',function(){
  return function(input){
      return input=="true"||input==1?1:0;
  };
});

storeAppFilters.filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
});