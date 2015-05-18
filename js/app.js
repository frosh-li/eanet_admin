'use strict';

/* App Module */

var storeApp = angular.module('storeApp', [
    'ngRoute',
    'ngResource',
    'authsServices',
    'authsControllers'
    /*detectedControllerService*/
    //'couponServices',
    //'couponControllers'
    /*endDetectedControllerService*/
]);

storeApp.factory('TreeData', function() {
  /**
   * 能够自动处理树形数据联动的类，子节点列表必须命名为items。同时，节点会被增加三个属性：checked, folded, intermediate
   * @example
   * var data = new TreeData([
   *   {
   *     label: 'a',
   *     items: [
   *       {
   *         label: 'a1'
   *       },
   *       {
   *         label: 'a2'
   *       }
   *     ]
   *   },
     *   {
   *     label: 'b',
   *     items: [
   *       {
   *         label: 'b1'
   *       },
   *       {
   *         label: 'b2'
   *       }
   *     ]
   *   }
   * ]);
   * @param tree {Array.<Object>}
   * @param cbIsSame {function(Object, Object):boolean}
   * @constructor
   */
  function TreeData(tree, cbIsSame) {
    var _this = this;
    this.tree = tree;
    this.isSame = cbIsSame || function(item1, item2) { return item1 === item2 };
    /**
     * 折叠/展开
     * @param item {Object}
     * @param folded
     * @private
     */
    this._fold = function(item, folded) {
      item.folded = folded;
    };
    /**
     * 折叠指定的节点
     * @param item {Object}
     */
    this.fold = function(item) {
      this._fold(item, true);
    };
    /**
     * 展开指定的节点
     * @param item {Object}
     */
    this.unfold = function(item) {
      this._fold(item, false);
    };
    /**
     * 切换节点的折叠状态
     * @param item {Object}
     */
    this.toggleFold = function(item) {
      this._fold(item, !item.folded);
    };
    /**
     * 检查指定节点的折叠状态
     * @param item {Object}
     * @returns {boolean}
     */
    this.isFolded = function(item) {
      return item.folded;
    };
    /**
     * 递归检查指定节点是否有选中状态的子节点，不检查当前节点状态
     * @param item {Object} 起始节点
     * @return {boolean}
     */
    this.hasCheckedChildren = function(item) {
      return !!_.find(item.items, function(subItem) {
        return subItem.checked || _this.hasCheckedChildren(subItem);
      });
    };
    /**
     * 递归检查指定节点是否有未选中状态的子节点，不检查当前节点状态
     * @param item {Object} 起始节点
     * @return {boolean}
     */
    this.hasUncheckedChildren = function(item) {
      return !!_.find(item.items, function(subItem) {
        return !subItem.checked || _this.hasUncheckedChildren(subItem);
      });
    };
    /**
     * 指定节点是否半选状态，但不检查当前节点。即：既有被选中的子节点，也有未选中的子节点
     * @param item {Object} 起始节点
     * @return {boolean}
     */
    this.hasSemiCheckedChildren = function(item) {
      return this.hasCheckedChildren(item) && this.hasUncheckedChildren(item);
    };
    /**
     * 当前节点是否半选状态，hasSemiCheckedChildren的别名
     * @param item {Object}
     * @returns {boolean}
     */
    this.isSemiChecked = function(item) {
      return this.hasSemiCheckedChildren(item);
    };
    /**
     * 更新item的父级节点，重新检查它们的checked和semiChecked状态
     * @param items
     * @param item
     * @private
     */
    this._updateParents = function(items, item) {
      _.each(items, function(subItem) {
        if(_this.hasChildren(subItem, item)) {
          // 先要递归更新子级，否则中间节点的状态可能仍然处于选中状态，会影响当前节点的判断
          _this._updateParents(subItem.items, item);
          subItem.checked = _this.hasCheckedChildren(subItem);
          subItem.semiChecked = _this.isSemiChecked(subItem);
        }
      });
    };
    this.updateChecked = function(item) {
      this._updateParents(this.tree, item);
    };
    /**
     * 选中/反选指定节点
     * @param item {Object}
     * @param checked {boolean}
     * @private
     */
    this._check = function(item, checked) {
      item.checked = checked;
      // 把当前节点的选中状态应用到所有下级
      _.each(item.items, function(subItem) {
        _this._check(subItem, checked);
      });
      // 自动更新所有上级的状态
      this._updateParents(this.tree, item);
    };
    this._find = function(items, item) {
      if (!items)
        return null;
      // 在子节点中查找
      for (var i = 0; i < items.length; ++i) {
        var subItem = items[i];
        // 如果找到了则直接返回
        if (this.isSame(subItem, item))
          return subItem;
        // 否则递归查找
        var subResult = _this._find(subItem.items, item);
        if (subResult)
          return subResult;
      }
      return null;
    };
    /**
     * 查找指定的节点，会使用cbIsSame参数
     * @param item
     * @returns {Object}
     */
    this.find = function(item) {
      return this._find(this.tree, item);
    };
    /**
     * parent及其子节点中有没有指定的subItem节点
     * @param parent {Object}
     * @param subItem {Object|Array}
     * @returns {boolean}
     */
    this.hasChildren = function(parent, subItem) {
      var subItems = _.isArray(subItem) ? subItem : [subItem];
      return !!_.find(subItems, function(subItem) {
        return _this._find(parent.items, subItem);
      });
    };
    /**
     * 选中节点
     * @param item {Object}
     * @param checked {boolean}
     */
    this.check = function(item, checked) {
      item = this.find(item);
      this._check(item, checked || angular.isUndefined(checked));
    };
    /**
     * 反选节点
     * @param item {Object}
     */
    this.uncheck = function(item) {
      item = this.find(item);
      this._check(item, false);
    };
    /**
     * 切换节点的选中状态
     * @param item {Object}
     */
    this.toggleCheck = function(item) {
      item = this.find(item);
      this._check(item, !item.checked);
    };
    /**
     * 指定节点是否被选中
     * @param item {Object}
     * @returns {boolean}
     */
    this.isChecked = function(item) {
      item = this.find(item);
      return item.checked;
    };
  }
  return TreeData;
});

storeApp.config(['$routeProvider','$httpProvider',
  function($routeProvider,$httpProvider) {
    [
      /*detectedRouters*/
      {name: 'coupon', subName:'Coupon'}
      /*endDetectedRouters*/
    ].forEach(function(router){
      $routeProvider.
      when('/'+router.name+'/'+router.subName.toLowerCase()+"/edit:id",{
        templateUrl:'templates/'+router.name+"/"+router.subName.toLowerCase()+'/'+'create.html',
        controller: router.name+router.subName+"Edit"
      }).
      when('/'+router.name+'/'+router.subName.toLowerCase()+"/create",{
        templateUrl:'templates/'+router.name+"/"+router.subName.toLowerCase()+'/'+'create.html',
        controller: router.name+router.subName+"Create"
      })
    });
      $routeProvider.when('/auths/newuser', {
        templateUrl:'templates/auths/newuser.html',
        controller: 'authsCreateUser'
      }).when('/auths/group',{
        templateUrl:'templates/auths/group.html',
        controller:'authsGroupList'
      }).when('/auths/addgroup',{
        templateUrl:'templates/auths/addgroup.html',
        controller:'authsGroupAdd'
      }).when('/auths/users',{
        templateUrl:'templates/auths/users.html',
        controller:'authsUser'
      }).when('/auths/apis',{
        templateUrl:'templates/auths/apis.html',
        controller:'authsApiList'
      }).when('/auths/addapi',{
        templateUrl:'templates/auths/addapi.html',
        controller:'authsApiAdd'
      }).when('/auths/addapi/:code',{
        templateUrl:'templates/auths/addapi.html',
        controller:'authsApiAdd'
      }).when('/auths/addgroup/:name',{
        templateUrl:'templates/auths/addgroup.html',
        controller:'authsGroupAdd'
      })

      $httpProvider.defaults.transformRequest = function(data){
        if(typeof data === 'object'){
          var ret = [];
          for(var key in data){
            if(data.hasOwnProperty(key) && key.charAt(0) !== "$")
              ret.push(key+"="+data[key]);
          }
          return ret.join("&");
        }
      };
      $httpProvider.interceptors.push(function($q){

        return {
          'request': function(config){
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
            $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
            /*
            $httpProvider.defaults.headers.post['X-TOKEN'] = localStorage.getItem('token');
            $httpProvider.defaults.headers.put['X-TOKEN'] = localStorage.getItem('token');
            $httpProvider.defaults.headers.common['X-TOKEN'] = localStorage.getItem('token');
            $httpProvider.defaults.headers.post['X-UID'] = localStorage.getItem('uid');
            $httpProvider.defaults.headers.put['X-UID'] = localStorage.getItem('uid');
            $httpProvider.defaults.headers.common['X-UID'] = localStorage.getItem('uid');
            */
            if(config.url.indexOf('.html') < 0 && config.url.indexOf('refreshtoken') < 0){
              $("#ajaxLoading").html('Data Loading, Please Just Wait.....').fadeIn(500);
            }
            return config;
          }
        }
      });
      $httpProvider.responseInterceptors.push(function($q){
        return function(promise){
          return promise.then(function(response){
            if(document.getElementById('ajaxLoading').style.display!='none'){
              $("#ajaxLoading").html('Data Request Finished!').fadeOut(4000);
            }
            console.log(response);
            if(response.data && response.data.status == 302){
              console.log('需要登录');
              window.location = './login.html';
            }
            if(response.data && response.data.status == 301){
              console.log('权限不够');
              //throw new Error('not enough permissions');
              alert('权限不够');
              return $q.reject('not enough permissions');
            }
            if(response.data && response.data.status == 400){
              console.log(response.msg);
              alert(response.msg);
              return $q.reject(response.msg);
            }
            return response;
            //return $q.inject(response);
          },function(response){
            console.log('服务器内部错误');
            return $q.reject('服务器内部错误');
          });
        };
      });
      // refresh token


  }]);

storeApp.config(function($sceDelegateProvider) {
$sceDelegateProvider.resourceUrlWhitelist([
// Allow same origin resource loads.
  'self',
// Allow loading from our assets domain. Notice the difference between * and **.
  '**']);
});

storeApp.config(function($controllerProvider, $compileProvider, $filterProvider, $provide) {
  storeApp.register = {
    controller: $controllerProvider.register,
    directive: $compileProvider.directive,
    filter: $filterProvider.register,
    factory: $provide.factory,
    service: $provide.service
  };
});
