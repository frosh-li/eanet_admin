/**
 * Author: meimeidev
 */

//获取cookie 的值
			  var cookie_params="";
			  
			  var header_select_type=getCookie("headerSelectType");
			  var header_select_id=getCookie("headerSelectId");
			  var headerSelectName =getCookie("headerSelectName");
			  if(header_select_type=="store")
			  {
				 
				  if($("#_CustomizedQueryForm").find("input[name='storeId']").length>0){
					  	 
                    	 $("#_CustomizedQueryForm").find("input[name='storeId']").val(header_select_id);
                   }
				  else
					  {
					 
						  $("#_CustomizedQueryForm").append("<input type='hidden' name='storeId' value='"+header_select_id+"'>");
					   
					  }
				  //
			  }
			  else if(header_select_type=="merchant")
			  {
				 if($("#_CustomizedQueryForm").find("input[name='merchantId']").length>0){
					  	   
                    	 $("#_CustomizedQueryForm").find("input[name='merchantId']").val(header_select_id);
                   }
				  else
					  {
					  	 $("#_CustomizedQueryForm").append("<input type='hidden' name='merchantId' value='"+header_select_id+"'>");
					  	 
					  }
				    
			  }
			  else if(header_select_type=="plaza")
			  {
				  if($("#_CustomizedQueryForm").find("input[name='plazaId']").length>0){
					  	   
                    	 $("#_CustomizedQueryForm").find("input[name='plazaId']").val(header_select_id).attr("hname",headerSelectName);
                   }
				  else
					  {
					  	 $("#_CustomizedQueryForm").append("<input type='hidden' name='plazaId' hname='" + headerSelectName + "' value='"+header_select_id+"'>");
					  }
				  
			  }
			  else if(header_select_type=="city")
			  {
				   if($("#_CustomizedQueryForm").find("input[name='cityId']").length>0){
					  	   
                    	 $("#_CustomizedQueryForm").find("input[name='cityId']").val(header_select_id).attr("hname",headerSelectName);
                   }
					  else
						  {
						  $("#_CustomizedQueryForm").append("<input type='hidden' name='cityId' hname='" + headerSelectName + "' value='"+header_select_id+"'>");
						  }
			  }
			  else
			  {
			  }

!function($){
    var MMGrid = function (element, options) {
        this._id = (((1 + Math.random()) * 0x10000) | 0).toString(16);
        this._loadCount = 0;
        this.opts = options;
        this._initLayout($(element));
        this._initHead();
        this._initOptions();
        this._initEvents();
        this._setColsWidth();
        if(this.opts.fullWidthRows){
            this._fullWidthRows();
        }

        //初始化插件
        for(var i=0; i< this.opts.plugins.length; i++){
            var plugin = this.opts.plugins[i];
            plugin.init($.extend(element, this));
        }

        if(options.autoLoad){
            var that = this;
            this.opts = options;
            setTimeout(function(){

                if(options.url){
                    that.load();
                }else{
                    that.load(options.items);
                }
            },0); //chrome style problem
        }

    };

    //see: http://tanalin.com/en/articles/ie-version-js/
    var browser = function(){
        var isIE=!!window.ActiveXObject;
        var isIE10 = isIE && !!window.atob;
        var isIE9 = isIE && document.addEventListener && !window.atob;
        var isIE8 = isIE && document.querySelector && !document.addEventListener;
        var isIE7 = isIE && window.XMLHttpRequest && !document.querySelector;
        var isIE6 = isIE && !window.XMLHttpRequest;

        return {
            isIE: isIE
            , isIE6: isIE6
            , isIE7: isIE7
            , isIE8: isIE8
            , isIE9: isIE9
            , isIE10: isIE10
        };
    }();

    MMGrid.prototype = {

        _initLayout: function($el){
            var opts = this.opts;
            var $elParent = $el.parent();
            var elIndex = $el.index();

            var mmGrid = [
                '<div class="mmGrid">',
                    '<style></style>',
                    '<div class="mmg-headWrapper">',
                        '<form id="search_form" style="margin:0;"><table class="mmg-head" cellspacing="0"></table></form>',
                    '</div>',
                    '<div class="mmg-colResizePointer"></div>',
                    '<div class="mmg-colResizePointer-before"></div>',
                    '<div class="mmg-backboard">',
                        '<a class="mmg-btnBackboardUp"></a>',
                    '</div>',
                    '<div class="mmg-bodyWrapper"></div>',
                    '<a class="mmg-btnBackboardDn"></a>',
                    '<div class="mmg-message">'+ this.opts.noDataText +'</div>',
                    '<div class="mmg-mask mmg-transparent"></div>',
                    '<div class="mmg-loading">',
                        '<div class="mmg-loadingImg"></div>',
                        //'<div class="mmg-loadingText">'+ this.opts.loadingText +'</div>',
                    '</div>',

                '</div>'
            ];
            //fix in IE7,IE6
            if(browser.isIE7 || browser.isIE6){
                $el.prop('cellspacing',0);
            }


            //cached object
            var $mmGrid = $(mmGrid.join(''));
            this.$mmGrid = $mmGrid;
            this.$style = $mmGrid.find('style');
            this.$headWrapper = $mmGrid.find('.mmg-headWrapper');
            this.$head = $mmGrid.find('.mmg-head');
            this.$backboard = $mmGrid.find('.mmg-backboard');
            this.$bodyWrapper = $mmGrid.find('.mmg-bodyWrapper');
            this.$body = $el.removeAttr("style").addClass('mmg-body');
            this._insertEmptyRow();
            this.$body.appendTo(this.$bodyWrapper);



            //放回原位置
            if(elIndex === 0 || $elParent.children().length == 0){
                $elParent.prepend(this.$mmGrid);
            }else{
                $elParent.children().eq(elIndex-1).after(this.$mmGrid);
            }


            // fix in ie6
            if(browser.isIE6 && (!opts.width || opts.width === 'auto')){
                $mmGrid.width('100%');
                $mmGrid.width($mmGrid.width() - ($mmGrid.outerWidth(true) - $mmGrid.width()));
            }else{
                $mmGrid.width(opts.width);
            }

            if(browser.isIE6 && (!opts.height || opts.height === 'auto')){
                $mmGrid.height('100%');
                $mmGrid.height('auto');
                //$mmGrid.height($mmGrid.height() - ($mmGrid.outerHeight(true) - $mmGrid.height()));
            }else{
                //$mmGrid.height(opts.height);
                $mmGrid.height('auto');
            }

            if(opts.checkCol){
                var chkHtml = opts.multiSelect ?  '<input type="checkbox" class="checkAll" title="全选">'
                    : '<input type="checkbox" disabled="disabled" class="checkAll"  title="全选">';
                opts.cols.unshift({title:chkHtml,width: 20, align: 'center' ,lockWidth: true, checkCol: true, renderer:function(){
                    return '<input type="checkbox" class="mmg-check"  title="选择">';
                }});
            }

            if(opts.indexCol){
                opts.cols.unshift({title:'#',width: opts.indexColWidth, align: 'center' ,lockWidth: true, indexCol:true, renderer:function(val,item,rowIndex){
                    return '<label class="mmg-index">' + (rowIndex+1) + '</label>';
                }});
            }

        }

        ,_expandCols: function(cols){
            var newCols = [];
            if(!cols){
               return newCols;
            }
            for(var colIndex=0; colIndex<cols.length; colIndex++){
               var col = cols[colIndex];
               if(col.cols){
                   newCols.push(col);
                   newCols.push.apply(newCols,this._expandCols(col.cols));
               }else{
                   newCols.push(col);
               }
            }
            return newCols;
        }
        ,_leafCols: function(){
            var opts = this.opts;
            var newCols = [];
            var cols = this._expandCols(opts.cols);
            for(var colIndex=0; colIndex<cols.length; colIndex++){
                var col = cols[colIndex];
                if(!col.cols){
                    newCols.push(col);
                }
            }
            return newCols;
        }

        ,_expandThs: function(){
            return this.$head.find('th').sort(function(a, b){
               return parseInt($(a).data('colindex')) - parseInt($(b).data('colindex'));
            });
        }

        ,_leafThs: function(){
            return this.$head.find('th').filter(function(){
                return !$.data(this,'col').cols;
            }).sort(function(a, b){
                return parseInt($(a).data('colindex')) - parseInt($(b).data('colindex'));
            });
        }


        ,_colsWithTitleDeep: function(cols,deep){
            var newCols = [];
            if(!cols){
                return newCols;
            }
            for(var colIndex=0; colIndex<cols.length; colIndex++){
                var col = cols[colIndex];
                if(deep === 1){
                    newCols.push(col);
                }else{
                    newCols.push.apply(newCols, this._colsWithTitleDeep(col.cols, deep-1));
                }
            }
            return newCols;
        }

        ,_titleDeep: function(cols){
            var deep = 1;
            for(var colIndex=0; colIndex<cols.length; colIndex++){
                var col = cols[colIndex];
                if(col.cols){
                    var newDeep = 1 + this._titleDeep(col.cols);
                    if(deep < newDeep){
                        deep = newDeep;
                    }
                }
            }
            return deep;
        }

        , _titleHtml: function(col, rowspan){
            var opts = this.opts;
			// 搜索的get参数
			var searchParams = opts.searchParams.split('&');
			var searchArr = [];
			$.each(searchParams,function(k,val){
			  val = val.split('=');
			  searchArr[val[0]] = val[1];

			});
			// end

            var titleHtml = [];
            if(!col.cols){
                titleHtml.push('<th class="');
                var colIndex =  $.inArray(col, this._expandCols(opts.cols));
                titleHtml.push(this._genColClass(colIndex));
                titleHtml.push(' " ');
                titleHtml.push(' rowspan="');
                titleHtml.push(rowspan);
                titleHtml.push('" colspan="');
                titleHtml.push(1);
                titleHtml.push('" data-colIndex="');
                titleHtml.push(colIndex);
                titleHtml.push('" >');
                titleHtml.push('<div class="mmg-titleWrapper" >');
                titleHtml.push('<span class="mmg-title ');
                if(col.sortable) titleHtml.push('mmg-canSort ');
                var dis_title = '';
                if(col.name) dis_title = col.title;
                titleHtml.push('" title = "'+dis_title+'">');
                if(col.titleHtml){
                    titleHtml.push(col.titleHtml);
                }else{
                    titleHtml.push(col.title);
                }
                titleHtml.push('</span><div class="mmg-sort"></div>');
                if(!col.lockWidth) titleHtml.push('<div class="mmg-colResize"></div>');
                titleHtml.push('</div>');
                if(col.sortable == true){
				  var value ='筛选...';
				  if(searchArr[col.name]){
					value = searchArr[col.name];
				  }
				  var style='';
				  if(opts.searchParams == ''){
					style='style="display:none;"';
				  }
				  if(opts.mmgridDisableSearchInput != 1) {
				    titleHtml.push('<input class="_mmgrid_search_input" type="text" name="'+col.name+'_like" '+style+'  value="'+value+'">');
				  }
          
				}
                titleHtml.push('</th>');

            }else{
                var displayColsLength = col.cols.length;
                $.each(col.cols, function(index, item){
                    if(item.hidden){
                        displayColsLength--;
                    }
                });
                if(displayColsLength === 0){
                    col.hidden = true;
                }
                titleHtml.push('<th class="');
                var colIndex =  $.inArray(col, this._expandCols(opts.cols));
                titleHtml.push(this._genColClass(colIndex));
                titleHtml.push(' mmg-groupCol" ');
                titleHtml.push(' rowspan="');
                titleHtml.push(rowspan-1);
                titleHtml.push('" colspan="');
                titleHtml.push(displayColsLength);
                titleHtml.push('" data-colIndex="');
                titleHtml.push(colIndex);
                titleHtml.push('" >');
                titleHtml.push('<div class="mmg-titleWrapper" >');
                titleHtml.push('<span class="mmg-title ');
                if(col.sortable) titleHtml.push('mmg-canSort ');
                titleHtml.push('">');
                if(col.titleHtml){
                    titleHtml.push(col.titleHtml);
                }else{
                    titleHtml.push(col.title);
                }
                titleHtml.push('</span><div class="mmg-sort"></div>');
                titleHtml.push('</div>');
                if(colIndex != 0 && colIndex != opts.cols.length-1 && opts.mmgridDisableSearchInput != 1)
                  titleHtml.push('<input class="_mmgrid_search_input" type="text" name="'+col.name+'_like" value="筛选..." style="display:none;">');
                titleHtml.push('</th>');
            }

            return titleHtml.join("");
        }

        , _initHead: function(){
            var that = this;
            var opts = this.opts;
            var $head = this.$head;

            if(opts.cols){
                var theadHtmls = ['<thead>'];

                //获取标题深度
                var titleDeep = that._titleDeep(opts.cols);
                for(var deep=1; deep<= titleDeep; deep++){
                    var cols = that._colsWithTitleDeep(opts.cols, deep);
                    theadHtmls.push('<tr>');
                    for(var colIndex=0; colIndex< cols.length; colIndex++){
                        var col = cols[colIndex];
                        theadHtmls.push(this._titleHtml(col, titleDeep-deep+1));
                    }
                    theadHtmls.push('</tr>');
                }
                theadHtmls.push('</thead>');
                $head.html(theadHtmls.join(''));
            }

            var $ths = this._expandThs();
            var expandCols = this._expandCols(opts.cols);
            $.each($ths,function(index){
                if(!expandCols[index].width){
                    expandCols[index].width = 100;
                }
                $.data(this,'col-width',expandCols[index].width);
                $.data(this,'col',expandCols[index]);
            });

            var $mmGrid = this.$mmGrid;
            var $headWrapper = this.$headWrapper;
            var $bodyWrapper = this.$bodyWrapper;
            if(opts.height !== 'auto'){
               // $bodyWrapper.height($mmGrid.height() - $headWrapper.outerHeight(true));
                $bodyWrapper.height('auto');
            }



            //初始化排序状态
            if(opts.sortName){
                for(var colIndex=0; colIndex< expandCols.length; colIndex++){
                    var col = expandCols[colIndex];
                    if(col.sortName === opts.sortName || col.name === opts.sortName){
                        var $th= $ths.eq(colIndex);
                        $.data($th.find('.mmg-title')[0],'sortStatus',opts.sortStatus);
                        $th.find('.mmg-sort').addClass('mmg-'+opts.sortStatus);
                    }
                }
            }
        }

        , _initOptions: function(){
            var opts = this.opts;
            var $mmGrid = this.$mmGrid;
            var $headWrapper = this.$headWrapper;
            var $backboard = this.$backboard;
            $mmGrid.find('a.mmg-btnBackboardDn').css({
                'top': $headWrapper.outerHeight(true)
            }).slideUp('fast');

            var cols = this._leafCols();
            if(cols){
                var bbHtml = ['<h1>显示列</h1>'];
                for(var colIndex=0; colIndex<cols.length; colIndex++){
                    bbHtml.push('<label ');
                    if(cols[colIndex].checkCol || cols[colIndex].indexCol){
                        bbHtml.push('style="display:none;" ');
                    }
                    var col = cols[colIndex];
                    bbHtml.push('><input type="checkbox"  ');
					// local
					var local_hidden = false;
					var catch_key = GridHiddenColsKey();
				    var memory_local = getGridConf(catch_key);
					//alert(memory_local);
				    if(memory_local){
				    var memory_arr = memory_local.split('|');
				    $.each(memory_arr,function(k,v){
				      var json_data = JSON.parse(v);
				      if(col.name == json_data.name){
					    local_hidden = true;
						return false;
				      }
				    });
			       }

                    if(!col.hidden && !local_hidden)
				      bbHtml.push('checked="checked"');
					if(local_hidden)
					  bbHtml.push('');

                    if(col.lockDisplay) bbHtml.push(' disabled="disabled"');

                    if(col.title){
                        var dis_title = col.title;
                    }else{
                        var dis_title = '未命名';
                    }
                    bbHtml.push('/><span title="'+dis_title+'">');
                    bbHtml.push(dis_title);
                    bbHtml.push('</span></label>');
                }
                $backboard.append($(bbHtml.join('')));
            }
        }

        , _initEvents: function(){
            var that = this;
            var opts = this.opts;
            var $mmGrid = this.$mmGrid;
            var $headWrapper = this.$headWrapper;
            var $head = this.$head;
            var $bodyWrapper = this.$bodyWrapper;
            var $body = this.$body;
            var $backboard = this.$backboard;
            var $ths = this._expandThs();
            var expandCols = this._expandCols(opts.cols);
            var leafCols = this._leafCols();

            //调整浏览器
            if(opts.width === 'auto' || opts.height === 'auto' || (typeof opts.width === 'string' && opts.width.indexOf('%') === opts.width.length-1) ||
                typeof opts.height === 'string' && opts.height.indexOf('%') === opts.height.length-1){
                $(window).on('resize', function(){
                    that.resize();
                });
            }

            //滚动条事件
            $bodyWrapper.on('scroll', function(){
                $head.css('left',- $(this).scrollLeft());
            });
             var input_default = '筛选...';
			// 搜索框focus，blur，keydown 操作
			$("._mmgrid_search_input").focus(function(){
                  if(this.value == input_default){
                   this.value='';
                  }
                });
            $("._mmgrid_search_input").blur(function(){
                  if(this.value == ''){
                   this.value= input_default;
                  }
                });
            // 参数拼接
            function GetParams() {
                var params = {};
                var pluginParams = {};
                for(var i=0; i< opts.plugins.length; i++){
                  var plugin = opts.plugins[i];
                  $.extend(pluginParams, plugin.params());
                }
                params = $.extend(params, pluginParams); // 其他参数
                if(getGridConf(GridSortKey())!=null){
                  params.sort = getGridConf(GridSortKey());
                }
                var add_params = '';
                $.each(params,function(k,v){
                  if(k == 'p') v=1;
                    add_params +="&"+k+"="+v;
                });
                return add_params;
            }
            
          
			   
             
            
            $("#_CustomizedQueryFormSubmit").click(function(){
            	
            	$(this).attr('disabled',"true");
            	
            	// 在提交前插入验证操作
            	if((typeof(validateCustomizedQueryForm)).toLowerCase() == 'function') {
            		if(!validateCustomizedQueryForm()) {
            			$('#_CustomizedQueryFormSubmit').removeAttr("disabled");
            			return false;
            		}
            	}
            	
              that._showLoading();
              var add_params = GetParams();
              $.ajax({
                type: opts.method,
                url: opts.url,
                data: cookie_params+$("#_CustomizedQueryForm").serialize()+add_params,
                dataType: 'json',
                cache: opts.cache
              }).done(function(data){
            	  $('#_CustomizedQueryFormSubmit').removeAttr("disabled");
                try{
                    var QueryArr = $("#_CustomizedQueryForm").serializeArray();
                    $.each(QueryArr,function(k,v){
                      if(v['name'].indexOf("[") > 0 ){
                    	  //如果是名字中包含中括号，例如，checkbox的name是channel[] 则跳过，否则会出错
                      }else{	
                    	  if($("#search_form").find("input[name="+v['name']+"]")){
                    		  $("#search_form").find("input[name="+v['name']+"]").val(v['value']);
                    	  }
                      }
                    });
					
	                // 分页页码p为1
                  	for(var i=0; i< opts.plugins.length; i++){
                    	var plugin = opts.plugins[i];
                    	if(plugin.data('p')) {
                      		plugin.data('p',1);
                    	}
                  	}
    
                    //获得root对象
                    var items = data;
                    if($.isArray(data[opts.root])){
                        items = data[opts.root];
                    }
                    that._populate(items);
                    that._hideLoading();
                    if(!opts.remoteSort){
                      that._refreshSortStatus();
                    }
                   if(data && $.isArray(data[opts.root])){
                     data = $.extend({}, data);
                   }
                   that.$body.triggerHandler('loadSuccess', data);
                  }catch(e){
                      that._hideLoading();
                      that._showLoadError();
                      that._populate('');
                  }
              }).fail(function(data){
            	  $('#_CustomizedQueryFormSubmit').removeAttr("disabled");
                  that._hideLoading();
                  that._showLoadError();
              });
            });
            $("._mmgrid_search_input").keydown(function(event){
                    if(event.keyCode == 13){
                      $.each($("._mmgrid_search_input"),function(key,item){
                        if(item.value == input_default){
                          item.value = '';
                        }
                      });
                        //alert($("#search_form").serialize());
                        that._showLoading();
                        var add_params = GetParams();
                        $.ajax({
                          type: opts.method,
                          url: opts.url,
                          data: $("#search_form").serialize()+add_params,
                          dataType: 'json',
                          cache: opts.cache
                        }).done(function(data){
                          try{
                              var SearchArr = $("#search_form").serializeArray();
                              $.each(SearchArr,function(k,v){
                                if($("#_CustomizedQueryForm").find("input[name="+v['name']+"]")){
                                  $("#_CustomizedQueryForm").find("input[name="+v['name']+"]").val(v['value']);
                                }
                              });
                              //获得root对象
                              var items = data;
                              if($.isArray(data[opts.root])){
                                  items = data[opts.root];
                              }
                              that._populate(items);
                              that._hideLoading();
                              if(!opts.remoteSort){
                                  that._refreshSortStatus();
                              }
							  if(data && $.isArray(data[opts.root])){
							    data = $.extend({}, data);
						      }
							  that.$body.triggerHandler('loadSuccess', data);
                              //$mmGrid.find('a.mmg-btnBackboardUp').click(); // 关闭选择框
                          }catch(e){
                              that._hideLoading();
                              that._showLoadError();
                              that._populate('');
                              //$mmGrid.find('a.mmg-btnBackboardUp').click(); // 关闭选择框
                          }

                      }).fail(function(data){

                          that._hideLoading();
                          that._showLoadError();
                      });

                    };
                });  // end
            //向下按钮
            var $btnBackboardDn = $mmGrid.find('a.mmg-btnBackboardDn').on('click', function(){
                // 搜索框显示
                $("._mmgrid_search_input").attr('style',"display:block;");
                $btnBackboardDn.attr('style',"top:67px;");

                var backboardHeight = $mmGrid.height() - $headWrapper.outerHeight(true);
                if(opts.height === 'auto'&& opts.backboardMinHeight !== 'auto' && backboardHeight < opts.backboardMinHeight){
                    backboardHeight = opts.backboardMinHeight;
                }
                $backboard.height();//$backboard.height(backboardHeight);此处修改了下拉的高度，不知是否引入新bug
                if(opts.height === 'auto'){
                     $mmGrid.height($headWrapper.outerHeight(true) + $backboard.outerHeight(true));
                    //$mmGrid.height('auto');
                }
                $backboard.slideDown();
                $btnBackboardDn.slideUp('fast');

                that._hideMessage();
            });
            $body.on('mouseenter', function(){
                $btnBackboardDn.slideUp('fast');
            });
            $mmGrid.on('mouseleave', function(){
                $btnBackboardDn.slideUp('fast');
            });
            $headWrapper.on('mouseenter',function(){
                if($backboard.is(':hidden') && opts.showBackboard){
                    $btnBackboardDn.slideDown('fast');
                }
            });
            //向上按钮
            $mmGrid.find('a.mmg-btnBackboardUp').on('click', function(){
                var hidden = false; // 控制搜索框的显示隐藏
                $.each($("._mmgrid_search_input"),function(key,item){
                        if(item.value != input_default &&　item.value != ""){
                          hidden = true;
                        }
                      });
                if (!hidden){
                  $("._mmgrid_search_input").attr('style',"display:none;");
                  $btnBackboardDn.attr('style',"top:35px;display:none;");
                  $.each($("._mmgrid_search_input"),function(key,item){
                    item.value = input_default;
                  });
                }

                $backboard.slideUp().queue(function(next){
                    if(!that.rowsLength() || (that.rowsLength() === 1 && $body.find('tr.emptyRow').length === 1)){
                        that._showNoData();
                    }
                    if(opts.height === 'auto'){
                        $mmGrid.height('auto');
                    }
                    next();
                });
            });

            //隐藏列
            $backboard.on('click', ':checkbox', function(){
                var index = $backboard.find('label').index($(this).parent());
                //最后一个不隐藏
                var last = 1;
                if(opts.checkCol){
                    last = last + 1;
                }
                if(opts.indexCol){
                    last = last + 1;
                }
                if($backboard.find('label :checked').length < last){
                    this.checked = true;
                    return;
                }

                var col = leafCols[index];
                if(this.checked){
                    col.hidden = false;

                }else{
                    col.hidden = true;
                }

				var memory_hidden = '{"name":"'+col.name+'","hidden":"'+col.hidden+'"}';
				// 记录隐藏列
				var catch_key = GridHiddenColsKey();
				var memory_local = getGridConf(catch_key);
				var isAdd = true;
				if(memory_local){
				 var memory_arr = memory_local.split('|');
				 $.each(memory_arr,function(k,v){
				   var json_data = JSON.parse(v);
				   if(col.name == json_data.name){
				     isAdd = false;
					 return false;
				   }
				 });
				 var memory_last = '';
				 if(isAdd){
				   memory_last = memory_local+'|'+memory_hidden;
				 }else{
				   memory_last = memory_local;
				 }

				 if(col.hidden == false){
				  var hidden_ = '{"name":"'+col.name+'","hidden":"true"}';
				  var arr = memory_last.split('|');
                  arr.splice(jQuery.inArray(hidden_,arr),1);
				  memory_last = arr.join('|');

				 }

				  setGridConf(catch_key,memory_last);

				}else{
			      setGridConf(catch_key,memory_hidden);
				}
				changeGridBtn(); // end

                var $ths = $head.find('th');
                for(var colIndex=$ths.length-1; colIndex>=0; colIndex--){
                    var $th = $ths.eq(colIndex);
                    var iCol = $th.data('col');
                    if(iCol.cols){
                        var hidden = true;
                        var colspan = 0;
                        $.each(iCol.cols,function(index,item){
                            if(!item.hidden){
                                hidden = false;
                                colspan++;
                            }
                        });
                        //IE bug
                        if(colspan !== 0){
                            $th.prop('colspan',colspan);
                        }
                        iCol.hidden = hidden;
                    }
                }

                that._setColsWidth();
                //$backboard.height($mmGrid.height() - $headWrapper.outerHeight(true));
//                $backboard.height('394');
                $backboard.height();//此处修改了高度，不知是否引入新BUG
                if(opts.height !== 'auto'){
                    // $bodyWrapper.height($mmGrid.height() - $headWrapper.outerHeight(true));
                    $bodyWrapper.height('auto');
                }
                $mmGrid.find('a.mmg-btnBackboardDn').css({
                    'top': $headWrapper.outerHeight(true)
                })
            });



            //排序事件
            $head.on('click', '.mmg-title', function(){
                var $this = $(this);
                var $titles =  $ths.find('.mmg-title');

                //当前列不允许排序
                var col =$this.parent().parent().data('col');
                if(!col.sortable){
                    return;
                }
                //取得当前列下一个排序状态
                var sortStatus = $.data(this, 'sortStatus') === 'asc' ? 'desc' : 'asc';
                //清除排序状态
                $.each($titles, function(){
                    $.removeData(this,'sortStatus');
                });
                $ths.find('.mmg-sort').removeClass('mmg-asc').removeClass('mmg-desc');
                //设置当前列排序状态
                $.data(this, 'sortStatus', sortStatus);
                $this.siblings('.mmg-sort').addClass('mmg-'+sortStatus);

                if(opts.url && opts.remoteSort){
                    that.load()
                }else{
                    that._nativeSorter($.inArray(col, leafCols), sortStatus);
                    that._setStyle();
                }
            }).on('mousedown', '.mmg-colResize', function(e){
                //调整列宽
                var $resize = $(this);
                var start = e.pageX;
                var $colResizePointer = $mmGrid.find('.mmg-colResizePointer')
                    .css('left', e.pageX - $headWrapper.offset().left).show();

                var scrollLeft = $head.position().left;
                var $colResizePointerBefore = $mmGrid.find('.mmg-colResizePointer-before')
                    .css('left', $resize.parent().parent().position().left + scrollLeft).show();
                //取消文字选择
                document.selection && document.selection.empty && ( document.selection.empty(), 1)
                || window.getSelection && window.getSelection().removeAllRanges();
                document.body.onselectstart = function () {
                    return false;
                };
                $headWrapper.css('-moz-user-select','none');

                $mmGrid.on('mousemove', function(e){
                    $colResizePointer.css('left', e.pageX - $headWrapper.offset().left);
                }).on('mouseup', function(e){
                    //改变宽度
                    var $th = $resize.parent().parent();
                    var width = $th.width() + e.pageX - start;
                    $.data($th[0], 'col-width', width);
                    that._setColsWidth();
                    $headWrapper.mouseleave();
                }).on('mouseleave',function(){
                    $mmGrid.off('mouseup').off('mouseleave').off('mousemove');
                    $colResizePointer.hide();
                    $colResizePointerBefore.hide();
                    document.body.onselectstart = function(){
                        return true;//开启文字选择
                    };
                    $headWrapper.css('-moz-user-select','text');
                });
            });

            //选中事件
            var $body = this.$body;
            $body.on('click','td',function(e){
                var $this = $(this);
                var event = jQuery.Event("cellSelected");
                event.target = e.target;
                that.$body.triggerHandler(event, [$.data($this.parent()[0], 'item'), $this.parent().index(), $this.index()]);

                if(event.isPropagationStopped()){
                    return;
                }
                if(!$this.parent().hasClass('selected')){
                    that.select($this.parent().index());
                }else{
                    that.deselect($this.parent().index());
                }
            });

            $body.on('click','tr > td .mmg-check',function(e){
                e.stopPropagation();
                var $this = $(this);
                if(this.checked){
                    that.select($($this.parents('tr')[0]).index());
                }else{
                    that.deselect($($this.parents('tr')[0]).index());
                }
            });

            //checkbox列
            if(opts.checkCol){
                $head.find('th .checkAll').on('click', function(){
                    if(this.checked){
                        that.select('all');
                    }else{
                        that.deselect('all');
                    }
                });
            }

            //IE6不支持hover
            if (browser.isIE6){
                $body.on('mouseenter','tr', function () {
                    $(this).toggleClass('hover');
                }).on('mouseleave','tr', function () {
                    $(this).toggleClass('hover');
                });
            };


        }

        , _rowHtml: function(item, rowIndex){
            var opts = this.opts;
            var expandCols = this._expandCols(opts.cols);
            var leafCols = this._leafCols();


            if($.isPlainObject(item)){
                var trHtml = [];
                trHtml.push('<tr>');
                for(var colIndex=0; colIndex < leafCols.length; colIndex++){
                    var col = leafCols[colIndex];
                    trHtml.push('<td class="');
                    var index =  $.inArray(col, expandCols);
                    trHtml.push(this._genColClass(index));
                    if(opts.nowrap){
                        trHtml.push(' nowrap');
                    }
                    trHtml.push('"><span class="');
                    if(opts.nowrap){
                        trHtml.push('nowrap');
                    }
                    trHtml.push('">');
                    if(col.renderer){
                    	if(colIndex == 0 && item.selectable == "disabled"){
                    		trHtml.push('');
                    	}
                    	else
                    	{
                    		trHtml.push(col.renderer(item[col.name],item,rowIndex));
                    	}
                    }else{
                        trHtml.push(item[col.name]);
                    }

                    trHtml.push('</span></td>');
                };
                trHtml.push('</tr>');
                return trHtml.join('');
            }
        }

        , _populate: function(items){
            var opts = this.opts;
            var $body = this.$body;

            this._hideMessage();
            if(items && items.length !== 0 && opts.cols){

                var tbodyHtmls = [];
                tbodyHtmls.push('<tbody>');
                for(var rowIndex=0; rowIndex < items.length; rowIndex++){
                    var item = items[rowIndex];
                    tbodyHtmls.push(this._rowHtml(item, rowIndex));
                }
                tbodyHtmls.push('</tbody>');
                $body.empty().html(tbodyHtmls.join(''));
                var $trs = $body.find('tr');
                for(var rowIndex=0; rowIndex < items.length; rowIndex++){
                    $.data($trs.eq(rowIndex)[0],'item',items[rowIndex]);
                }
            }else{
                this._insertEmptyRow();
                this._showNoData();
            }
            this._setStyle();

            if(opts.fullWidthRows && this._loadCount <= 1){
                this._fullWidthRows();
            }
        }

        , _insertEmptyRow: function(){
            var $body = this.$body;
            $body.empty().html('<tbody><tr class="emptyRow"><td  style="border: 0px;background: none;">&nbsp;</td></tr></tbody>');
        }
        , _removeEmptyRow: function(){
            var $body = this.$body;
            $body.find('tr.emptyRow').remove();
        }

        /* 生成列类 */
        , _genColClass: function(colIndex){
            return 'mmg'+ this._id +'-col'+colIndex;
        }

        , _setStyle: function(){
            var $head = this.$head;
            var $ths = this._expandThs();
            var $body = this.$body;
            var leafCol = this._leafCols();

            //head
            $ths.eq(0).addClass('first');
            $ths.eq(-1).addClass('last');
            //body
            $body.find('tr,td').removeClass('even')
                .removeClass('colSelected').removeClass('colSelectedEven');

            $body.find('tr:odd').addClass('even');



            var sortIndex = $.inArray($head.find('.mmg-title').filter(function(){
                return $.data(this,'sortStatus') === 'asc' || $(this).data('sortStatus') === 'desc';
            }).parent().parent().data('col'), leafCol);

            $body.find('tr > td:nth-child('+(sortIndex+1)+')').addClass('colSelected')
                .filter(':odd').addClass('colSelectedEven');

            this._resizeHeight();

        }
        , _setColsWidth: function(){
            var opts = this.opts;
            var $style = this.$style;
            var $head = this.$head;

            var $bodyWrapper = this.$bodyWrapper;
            var $body = this.$body;
            var $ths = this._expandThs();
            var expandCols = this._expandCols(opts.cols);

            var scrollTop = $bodyWrapper.scrollTop();
            var scrollLeft = $head.position().left;

            $bodyWrapper.width(9999);
            $body.width('auto');
            var styleText = [];
            for(var colIndex=0; colIndex<$ths.length; colIndex++){
                var $th = $ths.eq(colIndex);
                styleText.push('.mmGrid .'+this._genColClass(colIndex) + ' {');
                var width = $.data($th[0],'col-width');
                styleText.push('width: '+ width +'px;');
                styleText.push('max-width: '+ width +'px;');

                var col = expandCols[colIndex];
                if(col.align){
                    styleText.push('text-align: '+col.align+';');
                }
				// 设置记忆列的隐藏显示
				var catch_key = GridHiddenColsKey();
				var memory_local = getGridConf(catch_key);
				if(memory_local){
				 var memory_arr = memory_local.split('|');
				 $.each(memory_arr,function(k,v){
				   var json_data = JSON.parse(v);
				   if(col.name == json_data.name && json_data.hidden){
					 styleText.push('display: none; ');
				   }
				 });
			    }

                if(col.hidden){
                    styleText.push('display: none; ');
                }

                styleText.push(' }');
            }

            $body.detach();
            try{
                $style.text(styleText.join(''));
            }catch(error){
                $style[0].styleSheet.cssText = styleText.join('');//IE fix
            }
            $body.width($head.width());
            $bodyWrapper.width('auto');
            $bodyWrapper.append($body);

            //调整滚动条

            $bodyWrapper.scrollLeft(-scrollLeft);
            if($bodyWrapper.scrollLeft() === 0){
                $head.css('left', 0);
            }

            $bodyWrapper.scrollTop(scrollTop);
        }
        , _fullWidthRows: function(){
            var opts = this.opts;
            var $bodyWrapper = this.$bodyWrapper;
            var $mmGrid = this.$mmGrid;
            var $head = this.$head;
            var scrollWidth = $bodyWrapper.width() - $bodyWrapper[0].clientWidth;

            if(scrollWidth && browser.isIE){
                scrollWidth = scrollWidth + 1;
            }

            var fitWidth =  $mmGrid.width() - $head.width() - scrollWidth;
            if(fitWidth < -20){
                return;
            }

            var thsArr = [];
            var $ths = this._leafThs();
            var leafCol = this._leafCols();
            for(var i=0; i< leafCol.length; i++){
                var col = leafCol[i];
                var $th = $ths.eq(i);
                if(!col.lockWidth && $th.is(':visible')){
                    thsArr.push($th);
                }
            }

            var increaseWidth =  Math.floor(fitWidth / thsArr.length);
            var maxColWidthIndex = 0;
            for(var i=0; i< thsArr.length; i++){
                var $th = thsArr[i];
                var colWidth = $.data($th[0], 'col-width') + increaseWidth;
                $.data($th[0], 'col-width', colWidth);

                var maxColWidth = $.data(thsArr[maxColWidthIndex][0], 'col-width');
                if(maxColWidth < colWidth){
                    maxColWidthIndex = i;
                }
            }

            var remainWidth =  fitWidth -  increaseWidth * thsArr.length;
            var maxColWidth = $.data(thsArr[maxColWidthIndex][0], 'col-width');
            $.data(thsArr[maxColWidthIndex][0], 'col-width', maxColWidth + remainWidth);
            this._setColsWidth();
        }


        , _showLoading: function(){
            var $mmGrid = this.$mmGrid;
            $mmGrid.find('.mmg-mask').show();

            var $loading = $mmGrid.find('.mmg-loading');
            $loading.css({
                'left': ($mmGrid.width() - $loading.width()) / 2,
                'top': ($mmGrid.height() - $loading.height()) / 2+17
            }).show();
        }
        , _hideLoading: function(){
            var $mmGrid = this.$mmGrid;
            $mmGrid.find('.mmg-mask').hide();
            $mmGrid.find('.mmg-loading').hide();
        }
        , _showNoData: function(){
            this._showMessage(this.opts.noDataText);
        }

        , _showLoadError: function(){
            this._showMessage(this.opts.loadErrorText);
        }

        , _showMessage: function(msg){
            var $mmGrid = this.$mmGrid;
            var $headWrapper = this.$headWrapper;
            var $message = $mmGrid.find('.mmg-message');

            //这里判断出错提示的高距，如果过窄则直接设定为44
            var topHeight = ($mmGrid.height() + $headWrapper.height()  - $message.height()) / 2;
			var top =  topHeight>40?topHeight:44;
            $message.css({
                'left': ($mmGrid.width() - $message.width()) / 2,
                'top' : top
            }).text(msg).show();
        }
        , _hideMessage: function(){
            var $mmGrid = this.$mmGrid;
            $mmGrid.find('.mmg-message').hide();
        }

        , _nativeSorter: function(colIndex, sortStatus){
            var leafCols = this._leafCols();
            var col = leafCols[colIndex];
            //判断pv,uv,ip_cnt,visit_cnt,activate_cnt,start_cnt位整数(用于统计分析)
            if(col.name=="pv" || col.name=="uv_ip" || col.name=="avg_start_cnt" || col.name=="avg_uv_pages" || col.name=="avg_visit_pages" || col.name=="visit_cnt_rate"){ 
            	col.type='number';
            }
            if(col.name=="uv" || col.name=="ip_cnt" || col.name=="visit_cnt" || col.name=="activate_cnt" || col.name=="start_cnt" || col.name=="bounce_rate" || col.name=="avg_visit_cnt"){ 
            	col.type='number';
            }
            
			if(col.name=="user_cnt_total" || col.name=="user_cnt_new" || col.name=="upgrade_cnt" || col.name=="uv_rate" || col.name=="new_mem_percent" || col.name=="new_mem_rate"){ 
            	col.type='number';
            }
			if(col.name=="coupon_download_amount" || col.name=="app_active" || col.name=="app_launch" || col.name=="booking_cnts" || col.name=="complete_count" || col.name=="coupon_consume_amount" || col.name=="coupon_consume_cnts" || col.name=="coupon_download_amount" || col.name=="coupon_download_cnts" || col.name=="new_mem" || col.name=="new_trade_mem"){
				col.type='number';	
			}
			if(col.name=="order_count" || col.name=="point_award_amount" || col.name=="point_award_cnts" || col.name=="point_consume_amount" || col.name=="point_consume_cnts" || col.name=="total_mem" || col.name=="total_trade_mem" || col.name=="trade_amount" || col.name=="web_pv" || col.name=="web_uv"){
				col.type='number';
			}
			if(col.name=="new_mem" || col.name=="new_mem_rate" || col.name=="new_mem_percent"){ 
            	col.type='number';
            }	

            this.$body.find('tr > td:nth-child('+(colIndex+1)+')')
                .sortElements(function(a, b){
                    var av = $.text($(a));
                    var bv = $.text($(b));
                    //排序前转换
                    if(col.type === 'number'){
                        av = parseFloat(av);
                        bv = parseFloat(bv);
                    }else{
                        //各个浏览器localeCompare的结果不一致
                        return sortStatus === 'desc' ? -av.localeCompare(bv)  : av.localeCompare(bv);
                    }
                    return av > bv ? (sortStatus === 'desc' ? -1 : 1) : (sortStatus === 'desc' ? 1 : -1);
                }, function(){
                    return this.parentNode;
                });
        }

        , _refreshSortStatus: function(){
            var $ths = this.$head.find('th');
            var sortColIndex = -1;
            var sortStatus = '';
            $ths.find('.mmg-title').each(function(index, item){
                var status = $.data(item, 'sortStatus');
                if(status){
                    sortColIndex = index;
                    sortStatus = status;
                }
            });
            var sortStatus = sortStatus === 'desc' ? 'asc' : 'desc';
            if(sortColIndex >=0){
                $ths.eq(sortColIndex).find('.mmg-title').data('sortStatus',sortStatus).click();
            }
        }

        , _loadAjax: function(args){
            var that = this;
            var opts = this.opts;
            var params = {};
            //opt的params可以使函数，例如收集过滤的参数
            if($.isFunction(opts.params)){
                var p = opts.params();
                if(!p){
                    return;
                }
                params = $.extend(params, p);
            }else if($.isPlainObject(opts.params)){
                params = $.extend(params, opts.params);
            }

            if(opts.remoteSort){
                var sortName = '';
                var sortStatus = '';
                var $titles = this.$head.find('.mmg-title');
                for(var colIndex=0; colIndex<$titles.length; colIndex++){
                    var status = $.data($titles[colIndex], 'sortStatus');
                    if(status){
                        var col = $titles.eq(colIndex).parent().parent().data('col');
                        sortName = col.sortName ?
                            col.sortName : col.name;
                        sortStatus = status;
                    }
                }
				var catch_key = GridSortKey();
                if(sortName){
                    params.sort = sortName+'.'+sortStatus;
				    setGridConf(catch_key,params.sort);
					changeGridBtn();
                }else{
					// 添加用户操作记录排序字段
					var memory_sort = getGridConf(catch_key);
					if(memory_sort){
			          params.sort = memory_sort;
					}

				}
            }


            //插件参数合并
			cookie_params="key=value&";
            var pluginParams = {};
            for(var i=0; i< this.opts.plugins.length; i++){
                var plugin = this.opts.plugins[i];
                $.extend(pluginParams, plugin.params());
            }
            params = $.extend(params, pluginParams);

            //合并load的参数
            params = $.extend(params, args);
            // 获取_CustomizedQueryForm，search_form表单
            var _CustomizedQueryForm = $("#_CustomizedQueryForm").serializeArray();
            // 判断_CustomizedQueryForm 是否为空
            var CustomizedQueryNum = 0;
            $.each(_CustomizedQueryForm,function(k,v){
              if(decodeURI(v['value']) !=''){
                CustomizedQueryNum++;
              }
            });

            var search_form = _CustomizedQueryForm;
            var _SearchForm = $("#search_form").serializeArray();
            if(CustomizedQueryNum == 0)  search_form = _SearchForm;

            $.each(search_form,function(k,v){
              if(decodeURI(v['value']) !='筛选...' && v['value'] != ''){
                params[v['name']] = v['value'];
              }
            });

            that._showLoading();
            $.ajax({
                type: opts.method,
                url: opts.url,
                data: params,
                dataType: 'json',
                cache: opts.cache
            }).done(function(data){
                try{
                    //获得root对象
                    var items = data;
                    if($.isArray(data[opts.root])){
                        items = data[opts.root];
                    }
                    that._populate(items);
                    that._hideLoading();
                    if(!opts.remoteSort){
                        that._refreshSortStatus();
                    }

                    if(data && $.isArray(data[opts.root])){
                        data = $.extend(args, data);
                    }
                    that.$body.triggerHandler('loadSuccess', data);


                }catch(e){
                    that._hideLoading();
                    that._showLoadError();
                    throw e;
                }

            }).fail(function(data){

                that._hideLoading();
                that._showLoadError();
                that.$body.triggerHandler('loadError', data);
            });

        }

        , _loadNative: function(args){
            this._populate(args);
            this._refreshSortStatus();
            this.$body.triggerHandler('loadSuccess', args);
        }
        , load: function(args){
            try{
                var opts = this.opts;
                this._hideMessage();
                this._loadCount = this._loadCount + 1 ;

                if($.isArray(args)){

                    //加载本地数据
                    this._loadNative(args);
                }else if(opts.url){
		 this._loadAjax(args);
                }else if(opts.items){
                    this._loadNative(opts.items);
                }else{

                    this._loadNative([]);
                }
            }catch(e){
                this._showLoadError();
                throw e;
            }
        }

        //重设尺寸
        , resize: function(){
            var opts = this.opts;
            var $mmGrid = this.$mmGrid;
            var $headWrapper = this.$headWrapper;
            var $bodyWrapper = this.$bodyWrapper;

            // fix in ie6
            if(browser.isIE6 && (!opts.width || opts.width === 'auto')){
                $mmGrid.width('100%');
                $mmGrid.width($mmGrid.width() - ($mmGrid.outerWidth(true) - $mmGrid.width()));
            }else{
                $mmGrid.width(opts.width);
            }

            if(opts.height !== 'auto'){
                if(browser.isIE6 && (!opts.height || opts.height === 'auto')){
                    $mmGrid.height('100%');
                   // $mmGrid.height($mmGrid.height() - ($mmGrid.outerHeight(true) - $mmGrid.height()));
                    $mmGrid.height('auto');
                }else{
                    // $mmGrid.height(opts.height);
                    $mmGrid.height('auto');
                }

                // $bodyWrapper.height($mmGrid.height() - $headWrapper.outerHeight(true));
                $bodyWrapper.height('auto');
            }

            //调整message
            var $message = $mmGrid.find('.mmg-message');
            if($message.is(':visible')){
                $message.css({
                    'left': ($mmGrid.width() - $message.width()) / 2,
                    'top': ($mmGrid.height() + $headWrapper.height() - $message.height()) / 2
                });
            }
            //调整loading
            var $mask = $mmGrid.find('.mmg-mask');
            if($mask.is(':visible')){
                $mask.width($mmGrid.width()).height($mmGrid.height());
                var $loadingWrapper = $mmGrid.find('.mmg-loading');
                $loadingWrapper.css({
                    'left': ($mmGrid.width() - $loadingWrapper.width()) / 2,
                    'top': ($mmGrid.height() - $loadingWrapper.height()) / 2
                })
            }

            $bodyWrapper.trigger('scroll');

            this._resizeHeight();
        }

        , _resizeHeight: function(){
            var opts = this.opts;
            var $bodyWrapper = this.$bodyWrapper;
            var $body= this.$body;
            if(opts.height === 'auto' && browser.isIE7){
                $bodyWrapper.height('auto');
                if($bodyWrapper.width() < $body.width()){
                    $bodyWrapper.height($bodyWrapper.height() + $bodyWrapper.height() - $bodyWrapper[0].clientHeight  + 1);
                }
            }
        }

            //选中
        , select: function(args){
            var opts = this.opts;
            var $body = this.$body;
            var $head = this.$head;

            if(typeof args === 'number'){
                var $tr = $body.find('tr').eq(args);
                if(!opts.multiSelect){
                    $body.find('tr.selected').removeClass('selected');
                    if(opts.checkCol){
                        $body.find('tr > td').find('.mmg-check').prop('checked','');
                    }
                }
                if(!$tr.hasClass('selected')){
                    $tr.addClass('selected');
                    if(opts.checkCol){
                        $tr.find('td .mmg-check').prop('checked','checked');
                    }
                }
            }else if(typeof args === 'function'){
                $.each($body.find('tr'), function(index){
                    if(args($.data(this, 'item'), index)){
                        var $this = $(this);
                        if(!$this.hasClass('selected')){
                            $this.addClass('selected');
                            if(opts.checkCol){
                                $this.find('td .mmg-check').prop('checked','checked');
                            }
                        }
                    }
                });
            }else if(args === undefined || (typeof args === 'string' && args === 'all')){
                $body.find('tr.selected').removeClass('selected');
                $body.find('tr').addClass('selected');
                $body.find('tr > td').find('.mmg-check').prop('checked','checked');
            }else{
                return;
            }

            if(opts.checkCol){
                var $checks = $body.find('tr > td').find('.mmg-check');
                if($checks.length === $checks.filter(':checked').length){
                    $head.find('th .checkAll').prop('checked','checked');
                }
            }


        }
            //取消选中
        , deselect: function(args){
            var opts = this.opts;
            var $body = this.$body;
            var $head = this.$head;
            if(typeof args === 'number'){
                $body.find('tr').eq(args).removeClass('selected');
                if(opts.checkCol){
                    $body.find('tr').eq(args).find('td .mmg-check').prop('checked','');
                }
            }else if(typeof args === 'function'){
                $.each($body.find('tr'), function(index){
                    if(args($.data(this, 'item'), index)){
                        $(this).removeClass('selected');
                        if(opts.checkCol){
                            $(this).find('td .mmg-check').prop('checked','');
                        }
                    }
                });
            }else if(args === undefined || (typeof args === 'string' && args === 'all')){
                $body.find('tr.selected').removeClass('selected');
                if(opts.checkCol){
                    $body.find('tr > td').find('.mmg-check').prop('checked','');
                }
            }else{
                return;
            }

            $head.find('th .checkAll').prop('checked','');

        }
        , selectedRows: function(){
            var $body = this.$body;
            var selected = [];
            $.each($body.find('tr.selected'), function(index ,item){
                selected.push($.data(this,'item'));
            });
            return selected;
        }

        , selectedRowsIndex: function(){
            var $body = this.$body;
            var $trs = this.$body.find('tr')
            var selected = [];
            $.each($body.find('tr.selected'), function(index){
                selected.push($trs.index(this));
            });
            return selected;
        }

        , rows: function(){
            var $body = this.$body;
            var items = [];
            $.each($body.find('tr'), function(){
                items.push($.data(this,'item'));
            });
            return items;
        }

        , row: function(index){
            var $body = this.$body;
            if(index !== undefined && index >= 0){
                var $tr = $body.find('tr').eq(index);
                if($tr.length !== 0){
                    return $.data($tr[0],'item');
                }
            }
        }

        , rowsLength: function(){
            var $body = this.$body;
            var length = $body.find('tr').length;
            if(length === 1 && $body.find('tr.emptyRow').length === 1){
                return 0;
            }
            return length;
        }

        //添加数据，第一个参数可以为数组
        , addRow: function(item, index){
            var $tbody = this.$body.find('tbody');

            if($.isArray(item)){
                for(var i=item.length-1; i >= 0; i--){
                    this.addRow(item[i], index);
                }
                return ;
            }

            if(!$.isPlainObject(item)){
                return ;
            }

            this._hideMessage();
            this._removeEmptyRow();

            var $tr;

            if(index === undefined || index < 0){
                $tr = $(this._rowHtml(item, this.rowsLength()));
                $tbody.append($tr);
            }else{
                $tr = $(this._rowHtml(item, index));
                if(index === 0){
                    $tbody.prepend($tr);
                }else{
                    var $before = $tbody.find('tr').eq(index-1);
                    //找不到就插到最后
                    if($before.length === 0){
                        $tbody.append($tr);
                    }else{
                        $before.after($($tr));
                    }
                }
            }
            $tr.data('item', item);
            this._setStyle();


            this.$body.triggerHandler('rowInserted', [item, index]);
        }
        //更新行内容，两个参数都必填
        , updateRow: function(item, index){
            var opts = this.opts;
            var $tbody = this.$body.find('tbody');
            if(!$.isPlainObject(item)){
                return ;
            }
            var oldItem = this.row(index);

            var $tr = $tbody.find('tr').eq(index);
            var checked = $tr.find('td:first :checkbox').is(':checked');
            $tr.html(this._rowHtml(item, index).slice(4,-5));
            if(opts.checkCol){
                $tr.find('td:first :checkbox').prop('checked',checked);
            }

            $tr.data('item', item);
            this._setStyle();

            this.$body.triggerHandler('rowUpdated', [oldItem, item, index]);
        }

        , batchRemoveRow: function(ids,index){
            var that = this;
            var $tbody = that.$body.find('tbody');
            for(var i=index.length-1; i >= 0; i--){
              var item = that.row(index[i]);
              $tbody.find('tr').eq(index[i]).remove();
            }
            this.$body.triggerHandler('rowBatchRemoved', [ids]);
            this._setStyle();
            if(this.rowsLength() === 0){
                this._showNoData();
                this._insertEmptyRow(); // TODO
            }
        }
        
        //删除行，参数可以为索引数组
        , removeRow: function(index){
            var that = this;
            var $tbody = that.$body.find('tbody');

            if($.isArray(index)){
                for(var i=index.length-1; i >= 0; i--){
                    that.removeRow(index[i]);
                }
                return ;
            }

            if(index === undefined){
                var $trs = $tbody.find('tr');
                for(var i=$trs.length-1; i >= 0; i--){
                    that.removeRow(i);
                }
            }else{
                var item = that.row(index);
                $tbody.find('tr').eq(index).remove();
                this.$body.triggerHandler('rowRemoved', [item, index]);
            }
            this._setStyle();
            if(this.rowsLength() === 0){
                this._showNoData();
                this._insertEmptyRow(); // TODO
            }
        }
    };

    $.fn.mmGrid = function(){
        if(arguments.length === 0 || typeof arguments[0] === 'object'){
            var option = arguments[0]
                , data = this.data('mmGrid')
                , options = $.extend(true, {}, $.fn.mmGrid.defaults, option);
            if (!data) {
                data = new MMGrid(this, options);
                this.data('mmGrid', data);
            }
            return $.extend(true, this, data);
        }
        if(typeof arguments[0] === 'string'){
            var data = this.data('mmGrid');
            var fn =  data[arguments[0]];
            if(fn){
                var args = Array.prototype.slice.call(arguments);
                return fn.apply(data,args.slice(1));
            }
        }
    };

    $.fn.mmGrid.defaults = {
        width: 'auto'
        , height: '280px'
        , cols: []
        , url: false
        , params: {}
        , method: 'POST'
        , cache: false
        , root: 'items'
        , items: []
        , autoLoad: true
        , remoteSort: false
        , sortName: ''
        , sortStatus: 'asc'
        , loadingText: '正在载入...'
        , noDataText: '你的查询条件错误或查询结果不存在，请重新查询！'
        , loadErrorText: '你的查询条件错误或查询结果不存在，请重新查询！'  //数据加载出现异常
        , multiSelect: false
        , checkCol: false
        , indexCol: false
        , indexColWidth: 30
        , fullWidthRows: false
        , nowrap: false
        , showBackboard: true
        , backboardMinHeight: 125
        , plugins: [] //插件 插件必须实现 init($mmGrid)和params()方法，参考mmPaginator
		, searchParams:''
    };
//  event : loadSuccess(e,data), loadError(e, data), cellSelected(e, item, rowIndex, colIndex)
//          rowInserted(e,item, rowIndex), rowUpdated(e, oldItem, newItem, rowIndex), rowRemoved(e,item, rowIndex)
//


    $.fn.mmGrid.Constructor = MMGrid;


    // see: http://james.padolsey.com/javascript/sorting-elements-with-jquery/
    $.fn.sortElements = (function(){
        var sort = [].sort;
        return function(comparator, getSortable) {
            getSortable = getSortable || function(){return this;};
            var placements = this.map(function(){
                var sortElement = getSortable.call(this),
                    parentNode = sortElement.parentNode,
                    nextSibling = parentNode.insertBefore(
                        document.createTextNode(''),
                        sortElement.nextSibling
                    );
                return function() {
                    if (parentNode === this) {
                        throw new Error(
                            "You can't sort elements if any one is a descendant of another."
                        );
                    }
                    parentNode.insertBefore(this, nextSibling);
                    parentNode.removeChild(nextSibling);
                };
            });
            return sort.call(this, comparator).each(function(i){
                placements[i].call(getSortable.call(this));
            });
        };
    })();
}(window.jQuery);
