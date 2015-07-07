(function(window){
	var stime = 0,
		checktime = 0;
	var wait = function(milli){
		var dtd = $.Deferred();
		setTimeout(function(){
			var now = new Date().getTime();
			if(now > milli + stime - 50){
				if(stime > checktime + 10){
					dtd.resolve();
					checktime = stime;
					return dtd;
				}
			}
		},milli);
		stime = new Date().getTime();
		return dtd.promise(); 
	}
	window.wait = wait;
})(window);

var strWidth1 = (function() {
    function check(str) {
      if (/[\x00-\xFF]/.test(str)) {
        return false;
      } else {
        if (str.indexOf('“') >= 0 || str.indexOf('”') >= 0) {
          return false;
        }
        return true;
      }
    };
    return function(str) {
      var width = 0,
        i;
      if (!str) {
        return 0;
      }
      for (i = 0; i < str.length; i++) {
        width += (check(str.charAt(i)) ? 2 : 1);
      }
      return width;
    };
})();

//计算字节数
function strWidth(str){ 
	function check(str) {
		if (/[\x00-\xFF]/.test(str)) {
			return false;
		} else {
			if (str.indexOf('“') >= 0 || str.indexOf('”') >= 0) {
				return false;
			}
			return true;
		}
    };

	var width = 0;
    var	i;

	if (!str) {
        return 0;
    }
    for (i = 0; i < str.length; i++) {
        width += (check(str.charAt(i)) ? 2 : 1);
    }
    return width;
}

//根据字节数截取字符数
function subStringByWidth(str,num){
	function check(str) {
		if (/[\x00-\xFF]/.test(str)) {
			return false;
		} else {
			if (str.indexOf('“') >= 0 || str.indexOf('”') >= 0) {
				return false;
			}
			return true;
		}
	};

	if (!str) {
        return 0;
    }

    var len = str.length,
	    width = 0;

    for (i = 0; i < len; i++) {
        width += check(str.charAt(i)) ? 2 : 1;
        if(width > num)
        	break
    }
    return str.substring(0,i);
}

$(function(){
	var strWidth = (function() {
	    function check(str) {
	      if (/[\x00-\xFF]/.test(str)) {
	        return false;
	      } else {
	        if (str.indexOf('“') >= 0 || str.indexOf('”') >= 0) {
	          return false;
	        }
	        return true;
	      }
	    };
	    return function(str) {
	      var width = 0,
	        i;
	      if (!str) {
	        return 0;
	      }
	      for (i = 0; i < str.length; i++) {
	        width += (check(str.charAt(i)) ? 2 : 1);
	      }
	      return width;
	    };
	})();

    // 判断整数value是否等于0 
    jQuery.validator.addMethod("isIntEqZero", function(value, element) { 
         value=parseInt(value);      
         return this.optional(element) || value==0;       
    }, "整数必须为0"); 

    jQuery.validator.addMethod("byteRangeLength", function(value, element, param) {
        var length = value.length;
        for(var i = 0; i < value.length; i++){
            if(value.charCodeAt(i) > 127){
                length++;
            }
        }
        return this.optional(element) || (length >= param[0] && length <= param[1]);   
    }, $.validator.format("请确保输入的值在{0}-{1}个字节之间(一个中文字算2个字节)"));

    // 英文字符是汉字字符数量的两倍的检验
    jQuery.validator.addMethod("zh2en", function(value, element, param) {
    	var inputShow=true;
    	param[1] = strWidth(value);
    	if( parseInt(strWidth(value))>parseInt(param[0]) ){
    		inputShow=false; 
    	}
    	return this.optional(element) || inputShow;       
    }, $.validator.format("输入不能超过{0}个字符，您已输入{1}个字符，汉字相当于两个字符"));
    
    // 判断整数value是否大于某个数
    jQuery.validator.addMethod("greaterThan", function(value, element, param) { 
         value=parseInt(value);      
         return this.optional(element) || value >= param[0];       
    }, $.validator.format("输入数不能小于{0}")); 

    // 判断整数value是否小于某个数
    jQuery.validator.addMethod("smallerThan", function(value, element, param) { 
         value=parseInt(value);      
         return this.optional(element) || value <= param[0];       
    }, $.validator.format("输入数不能大于{0}")); 

    // 判断整数value的大小是否在某两个数之间
    jQuery.validator.addMethod("rangeFrom", function(value, element, param) { 
         value=parseInt(value);      
         return this.optional(element) || (value >= param[0] && value <= param[1]);       
    }, $.validator.format("输入数的大小必须在{0}-{1}之间！"));

    // 判断整数value是否大于0
    jQuery.validator.addMethod("isIntGtZero", function(value, element) { 
         value=parseInt(value);      
         return this.optional(element) || value>0;       
    }, "整数必须大于0"); 
      
    // 判断整数value是否大于或等于0
    jQuery.validator.addMethod("isIntGteZero", function(value, element) { 
         value=parseInt(value);      
         return this.optional(element) || value>=0;       
    }, "整数必须大于或等于0");   
    
    // 判断整数value是否不等于0 
    jQuery.validator.addMethod("isIntNEqZero", function(value, element) { 
         value=parseInt(value);      
         return this.optional(element) || value!=0;       
    }, "整数必须不等于0");  
    
    // 判断整数value是否小于0 
    jQuery.validator.addMethod("isIntLtZero", function(value, element) { 
         value=parseInt(value);      
         return this.optional(element) || value<0;       
    }, "整数必须小于0");  
    
    // 判断整数value是否小于或等于0 
    jQuery.validator.addMethod("isIntLteZero", function(value, element) { 
         value=parseInt(value);      
         return this.optional(element) || value<=0;       
    }, "整数必须小于或等于0");  
    
    // 判断浮点数value是否等于0 
    jQuery.validator.addMethod("isFloatEqZero", function(value, element) { 
         value=parseFloat(value);      
         return this.optional(element) || value==0;       
    }, "浮点数必须为0"); 
      
    // 判断浮点数value是否大于0
    jQuery.validator.addMethod("isFloatGtZero", function(value, element) { 
         value=parseFloat(value);      
         return this.optional(element) || value>0;       
    }, "浮点数必须大于0"); 
      
    // 判断浮点数value是否大于或等于0
    jQuery.validator.addMethod("isFloatGteZero", function(value, element) { 
         value=parseFloat(value);      
         return this.optional(element) || value>=0;       
    }, "浮点数必须大于或等于0");   
    
    // 判断浮点数value是否不等于0 
    jQuery.validator.addMethod("isFloatNEqZero", function(value, element) { 
         value=parseFloat(value);      
         return this.optional(element) || value!=0;       
    }, "浮点数必须不等于0");  
    
    // 判断浮点数value是否小于0 
    jQuery.validator.addMethod("isFloatLtZero", function(value, element) { 
         value=parseFloat(value);      
         return this.optional(element) || value<0;       
    }, "浮点数必须小于0");  
    
    // 判断浮点数value是否小于或等于0 
    jQuery.validator.addMethod("isFloatLteZero", function(value, element) { 
         value=parseFloat(value);      
         return this.optional(element) || value<=0;       
    }, "浮点数必须小于或等于0");  
    
    // 判断百分数  
    jQuery.validator.addMethod("isPercent", function(value, element) {
    	var intStr = /^[0-9]\d{0,1}$/;
    	var floatStr = /^[0-9]\d{0,1}\.\d{2}$/;
        return this.optional(element) || intStr.test(value) || floatStr.test(value);
    }, "整数不能大于100，小数为2位"); 

    // 判断金额  
    jQuery.validator.addMethod("isMoney", function(value, element) {
    	var intStr = /^[0-9]\d{0,10}$/;
    	var floatStr = /^\d+\.\d{2}$/;
    	var floatStr = /^[-\+]?\d+(\.\d{2})?$/;
        return this.optional(element) || floatStr.test(value);
    }, "小数不能大于2位数"); 

    // 判断金额1  
    jQuery.validator.addMethod("isMoney1", function(value, element) {
    	var intStr = /^[0-9]\d{0,10}$/;
    	var floatStr = /^[-\+]?\d+(\.\d{1,2})?$/;
        return this.optional(element) || floatStr.test(value);
    }, "小数不能大于2位数"); 

    // 判断浮点型  
    jQuery.validator.addMethod("isFloat", function(value, element) {       
         return this.optional(element) || /^[-\+]?\d+(\.\d+)?$/.test(value);       
    }, "只能包含数字、小数点等字符"); 
     
    // 匹配integer
    jQuery.validator.addMethod("isInteger", function(value, element) {       
         return this.optional(element) || (/^[-\+]?\d+$/.test(value) && parseInt(value)>=0);       
    }, "匹配integer");  
     
    // 判断数值类型，包括整数和浮点数
    jQuery.validator.addMethod("isNumber", function(value, element) {       
         return this.optional(element) || /^[-\+]?\d+$/.test(value) || /^[-\+]?\d+(\.\d+)?$/.test(value);       
    }, "匹配数值类型，包括整数和浮点数");  
    
    // 只能输入[0-9]数字
    jQuery.validator.addMethod("isDigits", function(value, element) {       
         return this.optional(element) || /^\d+$/.test(value);       
    }, "只能输入整数！");  

    // 判断中文字符 
    jQuery.validator.addMethod("isChinese", function(value, element) {       
         return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);       
    }, "只能包含中文字符。");   
 
    // 判断英文字符 
    jQuery.validator.addMethod("isEnglishTwo", function(value, element) {       
         return this.optional(element) || /^[A-Za-z]+$/.test(value);       
    }, "只能包含英文字符。");   
    
     // 判断英文字符english
    jQuery.validator.addMethod("english", function(value, element) {       
         return this.optional(element) || /^[A-Za-z]+$/.test(value);       
    }, "只能包含英文字符。");

     // 手机号码验证    
    jQuery.validator.addMethod("isMobile", function(value, element) {    
      var length = value.length;    
      return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value));    
    }, "请正确填写您的手机号码。");

    // 电话号码验证    
    jQuery.validator.addMethod("isPhone", function(value, element) {    
	    //var tel = /^(\d{3,4}-?)?\d{7,9}$/g;    
        var tel = /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
      return this.optional(element) || (tel.test(value));    
    }, "请正确填写您的电话号码。");

    // 联系电话(手机/电话皆可)验证   
    jQuery.validator.addMethod("isTel", function(value,element) {   
        var length = value.length;
        var mobile = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;  
        //var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
        //var tel = /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
        var tel = /^(((\d{3,4})-(\d{7,8})-(\d{1,4}))|^((\d{3,4})-(\d{7,8}))$)$/;
        return this.optional(element) || tel.test(value) || (length==11 && mobile.test(value));   
    }, "请正确填写电话号码"); 
 
     // 匹配qq      
    jQuery.validator.addMethod("isQq", function(value, element) {       
         return this.optional(element) || /^[1-9]\d{4,12}$/.test(value);       
    }, "匹配QQ");   
 
     // 邮政编码验证    
    jQuery.validator.addMethod("isZipCode", function(value, element) {    
      var zip = /^[0-9]{6}$/;    
      return this.optional(element) || (zip.test(value));    
    }, "请正确填写您的邮政编码。");  
    
    // 匹配密码，以字母开头，长度在6-12之间，只能包含字符、数字和下划线。      
    jQuery.validator.addMethod("isPwd", function(value, element) {       
         return this.optional(element) || /^[a-zA-Z]\\w{6,12}$/.test(value);       
    }, "以字母开头，长度在6-12之间，只能包含字符、数字和下划线。");  
    
    // 匹配密码，以字母开头，长度在6-12之间，必须包含字符、数字和符号的两种以上的组合。      
    jQuery.validator.addMethod("isPassword", function(value, element, param) {
	    var p = /^(?=.*[0-9].*)(?=.*[a-zA-Z].*).{8,20}$/;
         return this.optional(element) || p.test(value);       
    },$.validator.format( "密码必须包含字符和数字且长度在{0}-{1}之间。"));
       
    // 只能包含字符、数字。      
    jQuery.validator.addMethod("isEnglishOrNumber", function(value, element) {    
        var str = /^[a-zA-Z0-9]+$/;  
         return this.optional(element) || str.test(value);
    }, "只能包含字母、数字。");  
    
    // 身份证号码验证
    jQuery.validator.addMethod("isIdCardNo", function(value, element) { 
      var idCard = /^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/;   
      return this.optional(element) || isIdCardNo(value);    
    }, "请输入正确的身份证号码。"); 

    // IP地址验证   
    jQuery.validator.addMethod("ip", function(value, element) {    
      return this.optional(element) || /^(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.)(([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))\.){2}([1-9]|([1-9]\d)|(1\d\d)|(2([0-4]\d|5[0-5])))$/.test(value);    
    }, "请填写正确的IP地址。");
   
    // 字符验证，只能包含中文、英文、数字、下划线等字符。    
    jQuery.validator.addMethod("stringCheck", function(value, element) {       
         return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test(value);       
    }, "只能包含中文、英文、数字、下划线等字符");   
    
    // 字符验证，非中文字符。    
    jQuery.validator.addMethod("noChineseCheck", function(value, element) {       
         return this.optional(element) || /^[\w@#!%&\*',;=?$\x22]+$/.test(value);       
    }, "只能包含英文、数字、符号等字符");   

    // 匹配english  
    jQuery.validator.addMethod("isEnglish", function(value, element) {       
         return this.optional(element) || /^[A-Za-z]+$/.test(value);       
    }, "只能是英文字母");   
    
    // 匹配汉字  
    jQuery.validator.addMethod("isChinese", function(value, element) {       
         return this.optional(element) || /^[\u4e00-\u9fa5]+$/.test(value);       
    }, "只能是汉字");   
    
    // 匹配中文(包括汉字和字符) 
    jQuery.validator.addMethod("isChineseChar", function(value, element) {       
         return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);       
    }, "只能是中文(包括汉字和字符) "); 
      
    // 判断是否为合法字符(a-zA-Z0-9-_)
    jQuery.validator.addMethod("isRightfulString", function(value, element) {       
         return this.optional(element) || /^[A-Za-z0-9_-]+$/.test(value);       
    }, "判断是否为合法字符(a-zA-Z0-9-_)");   
    
    // 判断是否包含中英文特殊字符，除英文"-_"字符外
    jQuery.validator.addMethod("isContainsSpecialChar", function(value, element) {  
         var reg = RegExp(/[(\ )(\`)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=)(\|)(\{)(\})(\')(\:)(\;)(\')(',)(\[)(\])(\.)(\<)(\>)(\/)(\?)(\~)(\！)(\@)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\—)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\’)(\。)(\，)(\、)(\？)]+/);   
         return this.optional(element) || !reg.test(value);       
    }, "含有中英文特殊字符");   
        
    // 判断银行账号
    jQuery.validator.addMethod("isBankAccount", function(value, element) {
         return this.optional(element) || value.length == 30;       
    }, "只能输入30个整数");  
   
    // 验证email格式
    jQuery.validator.addMethod("isEmail", function(value, element) {
    	var length = /^\S{0,30}$/;
    	var pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
         return this.optional(element) || (length.test(value) && pattern.test(value));       
    }, "请输入正确的邮箱格式，不能有中文字符以及常用标点符号，字符长度不能大于30位！");  

    //身份证号码的验证规则
    function isIdCardNo(num){ 
    　   //if (isNaN(num)) {alert("输入的不是数字！"); return false;} 
    　　 var len = num.length, re; 
    　　 if (len == 15) 
    　　 re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/); 
    　　 else if (len == 18) 
    　　 re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/); 
    　　 else {
            //alert("输入的数字位数不对。"); 
            return false;
        } 
    　　 var a = num.match(re); 
    　　 if (a != null) 
    　　 { 
    　　 if (len==15) 
    　　 { 
    　　 var D = new Date("19"+a[3]+"/"+a[4]+"/"+a[5]); 
    　　 var B = D.getYear()==a[3]&&(D.getMonth()+1)==a[4]&&D.getDate()==a[5]; 
    　　 } 
    　　 else 
    　　 { 
    　　 var D = new Date(a[3]+"/"+a[4]+"/"+a[5]); 
    　　 var B = D.getFullYear()==a[3]&&(D.getMonth()+1)==a[4]&&D.getDate()==a[5]; 
    　　 } 
    　　 if (!B) {
            //alert("输入的身份证号 "+ a[0] +" 里出生日期不对。"); 
            return false;
        } 
    　　 } 
    　　 if(!re.test(num)){
            //alert("身份证最后一位只能是数字和字母。");
            return false;
        }
    　　 return true; 
    } 

    // 匹配中文(包括汉字和字符和英文) 
    jQuery.validator.addMethod("startWithChinese1", function(value, element, param) {       
         return (this.optional(element) || /^[\u0391-\uFFE5]+[\w\W]+$/.test(value)) && (strWidth(value)<=500 && strWidth(value)>=20);       
    }, $.validator.format("只能是中文开头(包括汉字、字母、数字和字符)，且字符数在{1}-{0}之间（一个汉字占两个字符）")); 

    // 匹配中文(包括汉字和字符和英文) 
    jQuery.validator.addMethod("textLimit", function(value, element, param) {
    	param[2] = strWidth(value);
        return this.optional(element) || (parseInt(strWidth(value))<=parseInt(param[0]) && parseInt(strWidth(value))>=parseInt(param[1]));       
    }, $.validator.format("已输入{2}个字符，字符数在{1}-{0}之间（一个汉字占两个字符）")); 

    
	$("form123").on("input propertychange",".text-limit",function(){
		$("em.tips-show").remove();
		var strlength = parseInt(strWidth($(this).val())); 
		if(strlength > parseInt($(this).attr("end")) || strlength < parseInt($(this).attr("start"))){
			$("<em class='tips-show' style='color:red;margin-left:20px'>已输入"+strlength+"个字符，字符数在"+$(this).attr("start")+"-"+$(this).attr("end")+"之间（一个汉字占两个字符）</em>").insertAfter($(this));
		}
	});

	$("form").on("input propertychange","input[type='text']",function(){
  		$(this).parent().find("em.tips").remove();
		var strLength = strWidth($(this).val());
		var minlength = $(this).attr("minlength")?$(this).attr("minlength"):0;
		var maxlength = $(this).attr("maxlength")?$(this).attr("maxlength"):100;
		if(strLength > maxlength){
			$(this).val(subStringByWidth($(this).val(),$(this).attr("maxLength")));
  		}
		strLength = strWidth($(this).val());
  		$(this).parent().append("<em class='tips' style='margin-left:20px;color:red'>"+strLength+"/"+maxlength+"</em>");  		
  	}).on("blur","input[type='text']",function(){ 
		$(this).parent().find("em.tips").remove();
  	});

  	$("input[type='text'].nozh2en").unbind().on("input propertychange",function(e){
		$(this).parent().find("em.tips").remove();
  		$(this).parent().append("<em class='tips' style='margin-left:20px;color:red'>"+$(this).val().length+"/"+$(this).attr("maxlength")+"</em>");  	
  		return false;	
  	}).on("blur","input[type='text']",function(){ 
		$(this).parent().find("em.tips").remove();
		return false;
	});

  	$("form").on("input propertychange","textarea.text-limit",function(){
  		$(this).parent().find("em.tips").remove();
		var strLength = strWidth($(this).val());
		var minlength = $(this).attr("minlength")?$(this).attr("minlength"):0;
		var maxlength = $(this).attr("maxlength")?$(this).attr("maxlength"):100;
		if(strLength > maxlength){
			$(this).val(subStringByWidth($(this).val(),$(this).attr("maxLength")));
  		}
		strLength = strWidth($(this).val());
  		$(this).parent().append("<em class='tips' style='margin-left:20px;color:red'>"+strLength+"/"+maxlength+"</em>");  		
  	}).on("blur","input[type='text']",function(){ 
		$(this).parent().find("em.tips").remove();
  	});

    $("#save_file,#submit_file").click(function(e){ 
		$("#form_data").trigger("submit");
		if($("#form_data").valid()) {
		}else{ 
			return false;
		}

    	var $this = $(this);

		$(document).ajaxStart(function() {
		   	$this.attr("disabled",true);
		});
		$(document).ajaxComplete(function() {
			$this.removeAttr("disabled");
		});

    });
  	
});
