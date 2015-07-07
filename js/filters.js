'use strict';

/* Filters */

var storeAppFilters = angular.module("storeAppFilters",[]);

storeAppFilters.filter('boole',function(){
  return function(input){
      return input=="true"||input==1?1:0;
  };
});

storeAppFilters.filter('isMenuCn', function() {
  return function(input) {
    return input=="true"||input==1?"显示为菜单":"";
  };
});

storeAppFilters.filter('roleTypeToCN', function() {
  return function(input) {
    return input == 0 ? "超级管理员":(input == 1?"批发企业":"药店零售商");
  };
});

storeAppFilters.filter('userStateCN', function() {
  return function(input) {
  	var ret="正常";
  	switch(input){
  		case 0:
  			ret = "正常";
  			break;
  		case 1:
  			ret = "停用";
  			break;
  	}
  	return ret;
  };
});

storeAppFilters.filter('companyType', function() {
  return function(input) {
  	var ret="药店";
  	switch(input){
  		case 1:
  			ret = "药店";
  			break;
  		case 2:
  			ret = "批发企业";
  			break;
  	}
  	return ret;
  };
});


