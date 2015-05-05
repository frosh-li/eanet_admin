'use strict';
var token = localStorage.getItem('token');
var uid = localStorage.getItem('uid');
if(token){
    $.ajax({
        url: globalConfig.api + "ucenter/refreshtoken",
        method:"POST",
        data: "token="+token,
        headers: {
            'X-TOKEN': token,
            "X-UID": uid
        },
        dataType:"json",
        success:function(data){
            console.log(data);
            if(data.status == 200 && data.data.token){
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('uid', data.data.uid);
                localStorage.setItem('modules', JSON.stringify(data.data.modules));
                console.log('登陆成功，即将跳转');
                window.location="./";
            }else{
                localStorage.clear();
                console.log(data.msg);
            }
        }
    });
}
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
            if(data.status == 400){
                localStorage.clear();
                $(".error").html(data.msg).show().fadeOut(4000);
            }else if(data.data.token){
                // 登陆成功，将token存在于localStorage中
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('uid', data.data.uid);
                localStorage.setItem('modules', JSON.stringify(data.data.modules));
                //localStorage.setItem('auth',JSON.stringify(data.data.auth));
                console.log('登陆成功，即将跳转');
                window.location="./";
            }else{
                $(".error").html('unknown error!').show().fadeOut(4000);
            }
        }
    });

};