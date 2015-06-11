
'use strict';

/* Services */

storeApp.register.factory('points', ['$resource',
  function($resource){
    return $resource(globalConfig.api + 'order/order/index/:id', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:false},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false}
    });
  }]);
