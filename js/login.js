'use strict';

var login = function(){
    var username = $("#username").val().trim();
    var password = $("#password").val().trim();
    var account = "username="+username+"&password="+password;
    console.log(username,password);
    //$http.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded;charset=utf-8';
    var url = globalConfig.api+"ucenter/login";
    $.ajax({
        url: url,
        method:'post',
        data: account,
        dataType:"json",
        success:function(data){
            if(data.status !== 200){
                localStorage.clear();
                $("#tips").html(data.msg).show().fadeOut(4000).html("");
            }else{
                localStorage.setItem('modules', JSON.stringify(data.data.modules));
                console.log('登陆成功，即将跳转');
                window.location="./";
            }
        }
    });
};