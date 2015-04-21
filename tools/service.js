--commonHeader--
'use strict';

/* Services */

var {{module}} = angular.module('{{module}}', ['ngResource']);
--endCommonHeader--

--factorys--
{{module}}.factory('{{subMenu}}', ['$resource',
  function($resource){
    return $resource(globalConfig.api + '/{{api}}/:id', {id:'@id',search:'@search'}, {
      query: {method:'GET', params:{}, isArray:true},
      //get:{method:'GET', params: {ids: "@ids"}, isArray:false},//不用delete方法也不用这个了
      getOne:{method:'GET', params: {id: "@id"}, isArray:false},//为了优化请求地址，实际上应该是{id: "@id"}
      save: {method:'POST', isArray:false},
      update:{method:"PUT", isArray:false}
    });
  }]);
--endfactorys--