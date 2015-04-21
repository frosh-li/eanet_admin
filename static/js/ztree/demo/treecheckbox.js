(function(window){
	/*
	树形多选列表函数
	使用范例：
	<!-- 树形插件 -->
	<link rel="stylesheet" href="__PUBLIC__/js/ztree/css/zTreeStyle/zTreeStyle.css" type="text/css">
	<script type="text/javascript" src="__PUBLIC__/js/ztree/js/jquery.ztree.core-3.5.js"></script>
	<script type="text/javascript" src="__PUBLIC__/js/ztree/js/jquery.ztree.excheck-3.5.js"></script>
	<script type="text/javascript" src="__PUBLIC__/js/ztree/demo/treecheckbox.js"></script>
	<SCRIPT type="text/javascript">
	$(function(){
		
		var zNodes = [{"id":206,"name":"购物1","categoryLevel":1,"pId":0,"pIdName":null,"sort":1,"isLeaf":1},{"id":203,"name":"测试1111","categoryLevel":1,"pId":0,"pIdName":null,"sort":2,"isLeaf":1}];

		categoryTree(zNodes, "#treeCategory", function(res){ 
			console.log(res); 
		});
	});
	</SCRIPT>	
	<ul id="treeCategory" class="ztree"></ul>
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
					$(id).find("span.checkbox_true_full").each(function(i,el){ 
						categoryIds.push($(el).attr("categoryId"));
					});
					func(categoryIds);	
				}
			}
		};
		
		$.fn.zTree.init($(id), setting, zNodes);
	}

	window.categoryTree = categoryTree;
})(window);