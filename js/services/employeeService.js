'use strict';

/* Services */

var employeeServices = angular.module('employeeServices', ['ngResource']);

employeeServices.factory('Employees', ['$resource',
  function($resource){
    return $resource(globalConfig.api + '/user/:id', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:true},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false}
    });
  }]);