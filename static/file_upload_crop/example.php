<?php 
error_reporting(0);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" href="/public/jquery-ui/themes/base/all.css">
	<script src="/public/jquery-ui/jquery.js"></script>
	<script src="/public/js/jquery-ui-1.10.3.min.js"></script>
	<script type="text/javascript" src="index.js"></script>
	<title></title>
	<style>
		.file1 {
			position: absolute;
			float:left;

			background-color: rgb(207, 89, 69);
			background-image: none;
			border-bottom-color: rgb(209, 91, 71);

			border-radius: 4px;

			border-color: rgb(209, 91, 71);

			color: rgb(255, 255, 255);

			display: inline-block;
			font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
			font-size: 12px;
			font-weight: normal;
			line-height: 17px;

			margin: 0px;
			margin-right: 10px;

			padding: 12px;
			padding-top: 5px;
			padding-bottom: 5px;

			text-align: center;
			text-decoration: none solid rgb(255, 255, 255);
			text-shadow: rgba(0, 0, 0, 0.247059) 0px -1px 0px;

			vertical-align: middle;
			white-space: nowrap;

			cursor:pointer;
		}
	</style>
</head>
<body>
<label class="file1">上传图片</label>

<br>

<span class="image_uploads_otherpics"></span>

	<script>
		$(function(){ 
			$(".file1").click(function(){
				createImageUpload({ 
					div_id		: 	"file_upload_div",
					iframe_id	:	"file_upload_iframe",
					width		:	"<?php if($_GET["width"]) echo $_GET["width"]; else echo 400;?>",
					height		:	"<?php if($_GET["height"]) echo $_GET["height"]; else echo 400;?>",
					resizable	:	"<?php if(!$_GET["resizable"]) echo 'true'; else echo $_GET["resizable"];?>",
					p 			:	"0",
					inputName 	:	"brandLogo[]",
					node 		:	"image_uploads_otherpics",
					fileSize 	:	"5242880",
					picCount	: 	2,
					setType 	: 	"true"
				});
			});
		});
		
		function defaultcallback(index,code,msg,name,url,input_name,node,count) {
		    if(code != 0) {
		        alert(msg);
		        return false;
		    }
		    var html = "<div class=\"div_"+name+"\"><img class=\"image_src\"  id=\""+name+"\" src=\""+url+"\" style=\"display:inline-block\"  /><input type=\"hidden\" name=\""+input_name+"\"  class=\""+input_name+"\"  value=\""+name+"\"><a onclick=\"delete_image_uploads(\'"+name+"\')\" class=\"btn btn-danger upBtn vebot\" style=\"cursor:pointer\">删除</a><br><br></div>";
			if(count == "1"){
		        $('.'+node).html(html);
		        $("em#image_uploads_otherpics_check").hide();
		    } else {
		        var nowcount = 0;
		   	    nowcount=$("."+node+" div").length;
		   	    if(nowcount >= count) {
		   			alert("对不起，上传的图片数量不能超过"+count+"张！");
		 	    } else {
		   		    $('.'+node).append(html);
		   		} 
		    }    
		}

		function delete_image_uploads(name) {
			$(".div_"+name).remove(); 
		 	if($(".image_uploads_otherpics").html() < 3){ 
				$("#image_uploads_otherpics_check").show();
			}
		}

	</script>

</body>
</html>
