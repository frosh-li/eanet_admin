'use strict';

/* Services */

var storeMetaServices = angular.module('storeMetaServices', ['ngResource']);

storeMetaServices.factory('Suppliers', ['$resource',
  function($resource){
    return $resource(globalConfig.api + '/store/supplier/:id', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:true},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false}
    });
  }]);

storeMetaServices.factory('Stores', ['$resource',
  function($resource){
    return $resource(globalConfig.api + '/store/store/:id', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:true},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false}
    });
  }]);

