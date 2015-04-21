(function($,window){
	function createImageUpload(obj){
		$("#"+obj.div_id).remove();
		var div_iframe_html = '<div id="'+obj.div_id+'" style="z-index:1000;position:absolute;top:0px;left:0px;display:none;padding:15px;background:#eee;cursor:move"><div style="cursor:none;border:1px lightblue solid;background:white"><iframe id="'+obj.iframe_id+'" frameborder="0" style="border:none;width:100%;height:100%" src="index.php?type=get&p='+obj.p+'&inputName='+obj.inputname+'&node='+obj.node+'&fileSize='+obj.filesize+'&setType='+obj.setType+'&picCount='+obj.picCount+'&width='+obj.width+'&height='+obj.height+'&div_id='+obj.div_id+'&resizable='+obj.resizable+'"></iframe></div><div id="close" style="font-size: 16px;position: absolute;right: -10px;top: -10px;background: lightslategrey;color:white;width: 30px;height: 30px;border-radius: 20px;text-align: center;line-height: 30px;font-weight: bolder; cursor:pointer">×</div></div>';
		$("body").append(div_iframe_html);
		var iframe_width = parseInt(obj.width)+185;
		var iframe_height = parseInt(obj.height)+70;
		$("#"+obj.iframe_id).css({"width":iframe_width,"height":iframe_height});
		$("#"+obj.div_id).show().position({my: "center", at: "center", of: window.top}).draggable();
		$("#"+obj.div_id).find("#close")
			.on("mouseover",function(){
				$(this).css("background","black");
			}).on("mouseout",function(){
				$(this).css("background","lightslategrey");
			}).on("click",function(){
				$("#"+obj.div_id).remove();
			});
	}
	window["createImageUpload"] = createImageUpload;
})(jQuery,window);