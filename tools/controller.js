--commonHeader--
'use strict';

/* employeeControllers */

var {{module}}Controllers = angular.module('{{module}}Controllers', ['ngTable']);
--endCommonHeader--

--factorys--
{{module}}Controllers.controller('{{module}}{{subMenu}}List', ['$http','$scope','{{subMenu}}',
  function($http,$scope,{{subMenu}}) {
    console.log('haap');
    $scope.deleteArray = [];
    $scope.lists = {{subMenu}}.query();
    console.log($scope.lists);
    $scope.SaveOne = function({{subMenuOne}}){
      console.log({{subMenuOne}});
      {{subMenuOne}}.$update({catid: {{subMenuOne}}._id});
    };
  }]);

{{module}}Controllers.controller('{{module}}{{subMenu}}Edit', ['$scope','$routeParams','{{subMenu}}',
  function($scope,$routeParams, {{subMenu}}) {
    var id = $routeParams.id;
    $scope.{{subMenuOne}} = {{subMenu}}.getOne({id: id});
    $scope.save = function({{subMenuOne}}){
      console.log({{subMenuOne}});
      {{subMenuOne}}.$update(function(data){
        if(data.status == true){
          console.log('添加成功');
        }
      });
    };
  }]);

{{module}}Controllers.controller('{{module}}{{subMenu}}Create', ['$scope','{{subMenu}}',
  function($scope, {{subMenu}}) {
    $scope.{{subMenuOne}} = new {{subMenu}}();
    $scope.save = function({{subMenuOne}}){
      console.log({{subMenuOne}});
      {{subMenuOne}}.$save(function(data){
        if(data.status == true){
          console.log('添加成功');
        }
      });
    };
    
  }]);

--endfactorys--