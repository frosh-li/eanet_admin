
'use strict';

/* Services */

var mainServices = angular.module('mainServices', ['ngResource']);

mainServices.factory('RoleFeed', ['$resource',
  function($resource){
    return $resource('api/role/role/:id', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:true},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false},
      "delete": {method: "DELETE", params: {id:'@id'}}
    });
  }
]);

mainServices.factory('ItemFeed', ['$resource',
  function($resource){
    return $resource('api/items/map/:id', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:false},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false},
      "delete": {method: "DELETE", params: {id:'@id'}}
    });
  }
]);

mainServices.factory('ItemDetailFeed', ['$resource',
  function($resource){
    return $resource('api/items/map/:id', {id:'@id',search:'@search'}, {
      get: {method:'get'},
      query: {method:'GET', params:{}, isArray:false},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false},
      "delete": {method: "DELETE", params: {id:'@id'}}
    });
  }
]);

mainServices.factory('FeedbackFeed', ['$resource',
  function($resource){
    return $resource('api/app/feedback/:id', {id:'@id',search:'@search'}, {
      get: {method:'get'},
      query: {method:'GET', params:{}, isArray:false},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false},
      "delete": {method: "DELETE", params: {id:'@id'}}
    });
  }
]);

mainServices.factory('OrderFeed', ['$resource',
  function($resource){
    return $resource('api/order/order/:id', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:true},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false},
      "delete": {method: "DELETE", params: {id:'@id'}}
    });
  }
]);

mainServices.factory('OrderDetailFeed', ['$resource',
  function($resource){
    return $resource('api/order/orderdetail/:id', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:true},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false},
      "delete": {method: "DELETE", params: {id:'@id'}}
    });
  }
]);


mainServices.factory('UserFeed', ['$resource',
  function($resource){
    return $resource('api/user/user/:id', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:true},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET'},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false},
      "delete": {method: "DELETE", params: {id:'@id'}}
    });
  }
]);

mainServices.factory('PushFeed', ['$resource',
  function($resource){
    return $resource('api/push/push/:id', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:true},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET'},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false},
      "delete": {method: "DELETE", params: {id:'@id'}}
    });
  }
]);

mainServices.factory('CompFeed', ['$resource',
  function($resource){
    return $resource('api/comp/comp/:id', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:true},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false},
      "delete": {method: "DELETE", params: {id:'@id'}}
    });
  }
]);

mainServices.factory('CategoryService', ['$resource',
  function($resource){
    return $resource('api/category/category', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:false},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false},
      "delete": {method: "DELETE", params: {id:'@id'}}
    });
  }
]);

mainServices.factory('SwiperService', ['$resource',
  function($resource){
    return $resource('api/swiper/swiper', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:true},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false},
      "delete": {method: "DELETE", params: {id:'@id'}}
    });
  }
]);

mainServices.factory('AdService', ['$resource',
  function($resource){
    return $resource('api/swiper/swiper', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:true},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false},
      "delete": {method: "DELETE", params: {id:'@id'}}
    });
  }
]);


