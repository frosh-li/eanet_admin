storeApp.register.directive('loading', function () {
  return {
    restrict:'AE',
    replace:true,
    templateUrl:'/modules/point/views/d_loading.html',
    link: function (scope,elem,attr,ctrl) {
      scope.showMe=false;
      scope.$watch("showMe", function (value) {
        if(value){
          $(".mmg-mask")[0].style.display="block";
          $(".mmg-loading")[0].style.display="block";
        }
      })
    }
  }
});