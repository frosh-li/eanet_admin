$(function(){
	var old_show = $.fn.show;
	$.fn.show = function(){
		if(this.selector == "#brg"){ 
			$(document.body).css("overflow","hidden");
		}
	    return old_show.apply(this, arguments);
	};
	var old_hide = $.fn.hide;
	$.fn.hide = function(){
		if(this.selector == "#brg"){ 
			$(document.body).css("overflow","");
			$(window.parent.document.body).css("overflow","");
		}
	    return old_hide.apply(this, arguments);
	};
});