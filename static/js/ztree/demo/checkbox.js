(function(window){
	/*
	树形多选列表函数
	使用范例：
	<div id="treeCategory"></div>
	<script>
		var zNodes = [
						{"id":206,"name":"购物1","categoryLevel":1,"pId":0,"pIdName":null,"sort":1,"isLeaf":1},
					  	{"id":203,"name":"测试1111","categoryLevel":1,"pId":0,"pIdName":null,"sort":2,"isLeaf":1}
					 ];
					 
		categoryTree(zNodes, "treeCategory", function(res){ 
			console.log(res); 
		});
	</script>
	*/
	function categoryTree(zNodes,id,func){
		var setting = {
			check: {
				enable: true
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				onCheck: function(event, treeId, treeNode){ 
					var categoryIds = new Array();

					if(treeNode.getCheckStatus().checked){
						categoryIds.push($("#"+treeNode.tId).find("span[name='treeNode-check']").attr("categoryId"));
					}
					$("#treeDemo span.checkbox_true_full").each(function(i,el){ 
						categoryIds.push($(el).attr("categoryId"));
					});
					func(categoryIds);	
				}
			}
		};
		
		$.fn.zTree.init($("#"+id), setting, zNodes);
	}

	window.categoryTree = categoryTree;
})(window);