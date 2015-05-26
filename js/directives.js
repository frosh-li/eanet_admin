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
                      ctrls[0].errMsg(msg,1);
                  }else{
                      ctrls[0].errMsg(msg,0);
                  }
                  
                  return validity ? value : undefined;
              };
              
              ctrls[1].$formatters.push(customValidator);
              ctrls[1].$parsers.push(customValidator);
          }
      };
    }]);    
}

function array_element_remove(arr, el){
    if(arr.length > 0 && arr.indexOf(el) >= 0){
        arr.splice(arr.indexOf(el), 1);
    }
}

/* Directives */

var storeAppDirectivies = angular.module("storeAppDirectivies",[]);

storeAppDirectivies.directive('errMsg', [function () {
    return {
      restrict: "A",
      scope: true,
      controller: function($scope){
          $scope.errMsg = "";
          $scope.errMsgArray = [];
          this.errMsg = function(errmsg,boole){
              if(boole == 1 && $scope.errMsgArray.indexOf(errmsg) < 0){
                  $scope.errMsgArray.push(errmsg);
              }
              if(boole == 0 && $scope.errMsgArray.indexOf(errmsg) >= 0){
                  array_element_remove($scope.errMsgArray, errmsg);
              }
              $scope.errMsg = $scope.errMsgArray.join("");
          }
      }
    };
}]);

createValidate(storeAppDirectivies, "isRepeat", "两次输入密码不相同！", false, function(value,ctrls){ return ctrls[1].$isEmpty(value) ||  value == $scope.formData.password ; });
  
createValidate(storeAppDirectivies, "isEnglish", "只能输入数字和英文字符！", /^[a-zA-Z0-9]+$/);
createValidate(storeAppDirectivies, "isChinese", "只能输入中文字符！", /^[\u0391-\uFFE5]+$/);
createValidate(storeAppDirectivies, "isEmail", "请输入正确格式的EMAIL！", /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
createValidate(storeAppDirectivies, "notEmpty", "必填项！", false, function(value,ctrls){return value;});


