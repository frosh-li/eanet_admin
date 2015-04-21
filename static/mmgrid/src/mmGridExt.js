
  // 获取localStorge
  function setGridConf(key, value){
   return window.localStorage.setItem(key, value);
  }

  // 设置localStorge
  function getGridConf(key){
    return  window.localStorage.getItem(key);
  }

  // 清除localStorge
  function removeGridConf(key){
    return  window.localStorage.removeItem(key);
  }

  // get pagelimit
  function GridPageLimitKey(){
	var localStorageName = catch_key;
  	return localStorageName+'_pagelimit';  
  }

  // get sort
  function GridSortKey(){
	var localStorageName = catch_key;
  	return localStorageName+'_sort';  
  }

  // get hidden cols
  function GridHiddenColsKey(){
	var localStorageName = catch_key;
  	return localStorageName+'_hidden_cols';  
  }

  function  deleteAllSet(reload){
    removeGridConf(GridPageLimitKey()); 
    removeGridConf(GridSortKey());
    removeGridConf(GridHiddenColsKey());
	if(reload){
	  location.reload();
	}
  }

  // 恢复默认布局按钮change
  function changeGridBtn(){
    $('.pgbtn').attr('class','btn btn-info pgbtn');
	$('.pgbtn').attr('id','btnResetLocal');
	$('#btnResetLocal').on('click',function(){ // 恢复默认布局
      deleteAllSet(true);
    });
  }