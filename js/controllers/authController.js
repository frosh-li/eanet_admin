'use strict';

/**
 * 权限控制
 */

(function(){
    var auths = localStorage.getItem('auth');

    var modules = $("#mainMenu .module");
    console.log(auths,modules);

    auths = JSON.parse(auths);

    for(var i = 0 ; i< modules.length ; i++){
        var item = modules[i];
        var show = item.getAttribute('ng-show');
        if(!show){
            item.style.display = "block";
            continue;
        }
        if(auths && auths.indexOf(show.replace(/[{}]/g,'')) > -1){
            item.style.display = "block";
        }else{
            item.style.display = "none";
        }
    }

})();

/**
 * 登陆注销控制
 */

(function(){
    var logout = $(".sign-out a");
    logout.click(function(e){
        e.preventDefault();
        var token = localStorage.getItem("token");
        var redirect = window.location.protocol+"//"+window.location.host+window.location.pathname+'login.html';
        window.location = globalConfig.api + "/user/logout?token="+token+"&redirect="+redirect;
    });
})();