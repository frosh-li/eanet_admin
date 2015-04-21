/**
 * 生成类目联动下拉选项菜单
 * 2014.12.13
 * v0.1
 * 示例：
 * <script type="text/javascript" src="__PUBLIC__/js/libs/buildCategorySelections.js"></script>
 * HTML: 
 *				<input type="hidden" id="initCategory1Id" value="{=$category1=}">
 *				<input type="hidden" id="initCategory2Id" value="{=$category2=}">
 *				<input type="hidden" id="initCategory3Id" value="{=$category3=}">
 *				<select id="category1Id" name="category1">
 *					<option>一级类目</option>
 *				</select>
 *				<select id="category2Id" name="category2">
 *					<option>二级类目</option>
 *				</select>
 *				<select id="category3Id" name="category3">
 *					<option>三级类目</option>
 *				</select>
 *
 */
if((typeof(categoryLevelFetched)).toLowerCase() == 'undefined') {
	var allCategory    = []; // 树形展开所需数据
	var categoryLevel  = [];
	var categoryLevel1 = categoryLeve2 = categoryLeve3 = []; // 联动筛选所需数据
	var categoryLevelFetched = false;	
} else {
	categoryLevelFetched = true;
}

//初始化buildCategorySelections
var initPage = true;

var categoryLevelOptionsInitialed = false;
var categoryLevelOptionsInitialTask = 0;

$(function() {
	if(!categoryLevelFetched) {
		// FIXME categoryLevel 应该在 html 里面初始化，而不是异步初始化。
		categoryLevelFetched = true;
		$.ajax({
			type:"GET",
			url:"/category/category_system/ajax_get_categorylevel?categoryLevel=3",
			data:{categoryLevel: 3},
			dataType:'json',
			success:function(json){
				// TODO 需要优化，这部分逻辑要和数据获取分离
				categoryLevel1 = json.data.level1;
				categoryLevel2 = json.data.level2;
				categoryLevel3 = json.data.level3;
				
				categoryLevel = categoryLevel1.concat(categoryLevel2).concat(categoryLevel3);
				buildCategoryLevel(categoryLevel);
				
				initCategoryLevelOptions();
			},
			error: function() {
				alert('获取类目数据失败，可能是请求超时');
			}
		});
	} else {
		categoryLevelOptionsInitialTask = setTimeout('30', function() {
			if(!categoryLevelOptionsInitialed && categoryLevel) {
				initCategoryLevelOptions();
				clearTimeout(categoryLevelOptionsInitialTask);
			}
		});
	}
});

function initCategoryLevelOptions()
{
	if(!$('category1Id')) {
		// TODO create the dom
	}
	
	$('category1Id').empty();
	
	var innerHTML = '<option selected="selected" value="">一级类目</option>';
	$.each(categoryLevel1, function(i, n) {
		innerHTML += '<option value="' + n.categoryId + '">' + n.categoryName + '</option>';
	});
	
	$("#category1Id").html(innerHTML);
	$("#category1Id").unbind('change').change(function() {
		var level1Id = $(this).val();
		
		generateCategoryLevel2Option(level1Id);
		
		if(level1Id == '0') {
			$("#category2Id").attr('disabled', 'disabled');
		} else {
			$("#category2Id").removeAttr('disabled');
		}
		
		generateCategoryLevel3Option(0);
		$("#category3Id").hide();
		$("#category3Id").attr('disabled', 'disabled');
		
		$("em[for='category3Id']").hide();
	});
	
	$("#category2Id").attr('disabled', 'disabled');
	$("#category3Id").attr('disabled', 'disabled');
	
	initSelect();
}

function generateCategoryLevel2Option(level1Id)
{
	$('category2Id').empty();

	var innerHTML = '<option selected="selected" value="">二级类目</option>';
	$.each(categoryLevel2, function(i, n) {
		if(n.parent == level1Id) {
			innerHTML += '<option value="' + n.categoryId + '">' + n.categoryName + '</option>';
		}
	});
	$("#category2Id").html(innerHTML);

	$("#category2Id").unbind('change').change(function() {
		var level2Id = $(this).val();
		var isLeaf = 0;
		
		generateCategoryLevel3Option(level2Id);
		isLeaf = $("#category3Id").children().length <= 1 ? true : false;
		if(level2Id == '0' || isLeaf) {
			$("#category3Id").attr('disabled', 'disabled');
			if(isLeaf) {
				$("#category3Id").hide();
			}
		} else {
			$("#category3Id").removeAttr('disabled');
			$("#category3Id").show();
		}
		
		$("em[for='category3Id']").hide();
	});
}

function generateCategoryLevel3Option(level2Id)
{
	$('category3Id').empty();
	var innerHTML = '<option selected="selected" value="">三级类目</option>';
	$.each(categoryLevel3, function(i, n) {
		if(n.parent == level2Id) {
			innerHTML += '<option value="' + n.categoryId + '">' + n.categoryName + '</option>';
		}
	});
	$("#category3Id").html(innerHTML);
}

function initSelect()
{
	initPage = arguments[0] === true ? true : initPage;
	if(initPage && $("#initCategory1Id").length > 0 && $("#initCategory2Id").length > 0 && $("#initCategory3Id").length > 0)
	{
		var category1Id = $("#initCategory1Id").val();
		var category2Id = $("#initCategory2Id").val();
		var category3Id = $("#initCategory3Id").val();
		$("#category1Id").val(category1Id);
		$("#category1Id").change();
		$("#category2Id").val(category2Id);
		$("#category2Id").change();
		$("#category3Id").val(category3Id);
		$("#category3Id").change();

		if(!category1Id && !category2Id && !category3Id) {
			$("#category2Id").attr('disabled', 'disabled');
			$("#category3Id").attr('disabled', 'disabled');
		}
		
		initPage = false;
	}
}

function buildCategoryLevel(categoryLevel) {
	var len = categoryLevel.length;
	var categroy = {};
	allCategory = [];
	for(var i = 0; i < len; i++) {
		category = {
				id: categoryLevel[i].categoryId,
				categoryLevel: categoryLevel[i].categoryLevel,
				pId: categoryLevel[i].parent,
				name: categoryLevel[i].categoryName,
				sort: categoryLevel[i]['sort'],
				isLeaf: categoryLevel[i].isLeaf 
		};
		allCategory.push(category);
	}
}