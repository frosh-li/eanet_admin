'use strict';

//创建验证指令函数
function createValidate(mod, name, msg, pat, fn){
    mod.directive(name, [function () {
      return {
          restrict: "A",
          require: ["?^errMsg", "ngModel"],
          scope: true,
          link: function ($scope, element, attr, ctrls) {
              var regexp = pat;

              var customValidator = function (value) {
                  var validity = false;
                  if(!fn)
                      validity = ctrls[1].$isEmpty(value) || regexp.test(value);
                  else
                      validity = fn(value,ctrls);
                    
                  ctrls[1].$setValidity(name, validity);
    
                  if(!validity){
                      ctrls[0].errMsg(msg);
                  }
                  
    console.log(validity);
    
                  return validity ? value : undefined;
              };
              
              ctrls[1].$formatters.push(customValidator);
              ctrls[1].$parsers.push(customValidator);
          }
      };
    }]);    
}

/* Directives */

var storeAppDirectivies = angular.module("storeAppDirectivies",[]);

storeAppDirectivies.directive('errMsg', [function () {
    return {
      restrict: "A",
      scope: true,
      controller: function($scope){
          $scope.errMsg = "格式不正确！";
          this.errMsg = function(errmsg){
              $scope.errMsg = errmsg;
          }
      }
    };
}]);

createValidate(storeAppDirectivies, "isChinese", "只能输入中文！", /^[\u0391-\uFFE5]+$/);
createValidate(storeAppDirectivies, "isEmail", "请输入正确格式的EMAIL！", /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
createValidate(storeAppDirectivies, "notEmpty", "必填项！", false, function(value,ctrls){return value;});

storeAppDirectivies.directive('isRepeat', [function () {
  return {
      restrict: "A",
      require: ["?^errMsg", "ngModel"],
      scope: true,
      link: function ($scope, element, attr, ctrls) {
          if (ctrls) {
              var regexp = /^[a-zA-Z0-9]+$/;
          }
          var customValidator = function (value) {
              var validity = ctrls[1].$isEmpty(value) ||  value == $scope.formData.password ;
              ctrls[1].$setValidity("isRepeat", validity);

              if(!validity){
                  ctrls[0].errMsg("两次密码不同！");
              }

              return validity ? value : undefined;
          };
          ctrls[1].$formatters.push(customValidator);
          ctrls[1].$parsers.push(customValidator);
      }
  };
}]);

