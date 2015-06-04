'use strict';

//创建验证指令函数
function createValidate(mod, name, msg, pat, fn, args){
    mod.directive(name, [function () {
      return {
          restrict: "A",
          require: ["?^errMsg", "ngModel"],
          scope: true,
          controller: function($scope){
          },
          link: function (scope, element, attr, ctrls) {
              var regexp = pat;
              var val = 0;
              var fnObj = {errMsg:"", inputed:0, max:attr[name]}; //用于设置错误显示信息
              
              ctrls[0].setInput( fnObj.inputed );
              ctrls[0].setMax( fnObj.max );
                          
              ctrls[1].$parsers.push(function (value) {
                  var validity = true;
                  if(!fn){
                      validity = ctrls[1].$isEmpty(value) || regexp.test(value);
                  }else{
                      if(args){
                          validity = fn(value, ctrls, fnObj, attr[name], scope, element, val);
                          msg = fnObj.errMsg;
                      }else{
                          validity = fn(value, ctrls);
                      }
                  }
                  
                  if(!validity){
                      ctrls[0].errMsg(msg,1);
                  }else{
                      ctrls[0].errMsg(msg,0);
                      val = value;
                  }
                  
                  if(fnObj.inputed)
                      ctrls[0].setInput( fnObj.inputed );
                  if(fnObj.max)
                      ctrls[0].setMax( fnObj.max );
                  
                  ctrls[1].$setValidity(name, validity);
                  return validity ? value : undefined;
              });

          }
      };
    }]);
}

/* Directives */

var storeAppDirectivies = angular.module("storeAppDirectivies",[]);

//错误信息显示指令必须写在外层
storeAppDirectivies.directive('errMsg', [function () {
    return {
      restrict: "A",
      scope: true,
      controller: function($scope){
          $scope.errMsg = "";
          $scope.errMsgArray = [];
          $scope.inputed = 0;
          $scope.max = 0;
              
          this.errMsg = function(errmsg,boole){
              if(boole == 1 && $scope.errMsgArray.indexOf(errmsg) < 0){
                  $scope.errMsgArray.push(errmsg);
              }
              if(boole == 0 && $scope.errMsgArray.indexOf(errmsg) >= 0){
                  if($scope.errMsgArray.length > 0 && $scope.errMsgArray.indexOf(errmsg) >= 0){
                      $scope.errMsgArray.splice($scope.errMsgArray.indexOf(errmsg), 1);
                  }
              }
              $scope.errMsg = $scope.errMsgArray.join("");
          };
          
          this.setInput = function(val){
              if(val)
                  $scope.inputed = val;
          }
          
          this.setMax = function(val){
              if(val)
                  $scope.max = val;
          }
      }
    };
}]);

createValidate(storeAppDirectivies, "isRepeat", "两次输入密码不相同！", false, 
    function(value,ctrls){ 
        return ctrls[1].$isEmpty(value) ||  value == $scope.formData.password ; 
    }
);

createValidate(storeAppDirectivies, "maxLength", "", false, 
    function(value, ctrls, fnObj, attrValue, scope, element, val){
        var validity = true;
        
        console.log(val);
        
        if(value)
            validity = value.length < attrValue;

        fnObj.errMsg = "最多"+attrValue+"个字符！";
        
        fnObj.inputed = 1;
        if(value)
            fnObj.inputed = value.length;
            
        fnObj.max = attrValue;

        if(!validity){
            ctrls[1].$setViewValue(val);
            ctrls[1].$render();
        }

        return validity;
    }, 
true);

createValidate(storeAppDirectivies, "minLength", "", false, 
    function(value, ctrls, fnObj, attrValue, $scope){
        var validity = true;
        if(value)
            validity = value.length >= attrValue;
            
        fnObj.errMsg = "最少"+attrValue+"个字符！";
        return validity ;
    }, 
true);

createValidate(storeAppDirectivies, "notEmpty", "必填项！", false, function(value,ctrls){return value;});
createValidate(storeAppDirectivies, "startFxg", "首字符必须为/！", /^[/]{1}[A-Za-z0-9_/]+$/);

createValidate(storeAppDirectivies, "isEnglish", "只能输入数字和英文字符！", /^[a-zA-Z0-9]+$/);
createValidate(storeAppDirectivies, "isChinese", "只能输入中文字符！", /^[\u0391-\uFFE5]+$/);
createValidate(storeAppDirectivies, "isEmail", "请输入正确格式的EMAIL！", /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);


