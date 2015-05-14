
'use strict';

/* Services */

var authsServices = angular.module('authsServices', ['ngResource']);

authsServices.factory('AuthUser', ['$resource',
  function($resource){
    return $resource(globalConfig.api + 'auths/user/:id', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:false},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false}
    });
  }]);

authsServices.factory('AuthGroup', ['$resource',
  function($resource){
    return $resource(globalConfig.api + 'auths/group/:id', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:false},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false}
    });
  }]);

authsServices.factory('AuthApi', ['$resource',
  function($resource){
    return $resource(globalConfig.api + 'auths/apis/:id', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:false},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false}
    });
  }]);