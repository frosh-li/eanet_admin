// uniq array elements, for integer elements only
function uniqIntArr(ary) {
	var tmp = ary;
	ary = [];
	var len = tmp.length;
	var t = 0;
	for(var i = 0; i < len; i++) {
		t = parseInt(tmp[i]);
		if(!isNaN(t)) {
			ary.push(tmp[i]);
		}
	}
	ary = ary.slice().sort();
	
	var i = 0, j, p, l = ary.length;
	for(; i<l; i++) {
		j = i;
		p = parseInt(ary[i]);
		while(j + 1 < l && parseInt(ary[j + 1]) === p) {
			j++;
		}
		if(j - i) {
			j -= i;
			ary.splice(i + 1, j);
			l -= j;
		}
	}
	
	return ary;
}

function uniqStrArr(ary) {
	var tmp = ary;
	ary = [];
	var len = tmp.length;
	for(var i = 0; i < len; i++) {
		if(typeof tmp[i] == 'string' || tmp[i] instanceof String || (typeof tmp[i] == 'number' && tmp[i])) {
			ary.push('' + tmp[i]);
		}
	}
	ary = ary.slice().sort();
	
	var i = 0, j, p, l = ary.length;
	for(; i<l; i++) {
		j = i;
		p = ary[i];
		while(j + 1 < l && ary[j + 1] === p) {
			j++;
		}
		if(j - i) {
			j -= i;
			ary.splice(i + 1, j);
			l -= j;
		}
	}
	
	return ary;
}

function arrayDelValue(arr, toDelete) {
	var tmp = arr;
	arr = [];
	var cnt = tmp.length;
	for(var i = 0; i < cnt; i++) {
		if(tmp[i] != toDelete) {
			arr.push(tmp[i]);
		}
	}
	
	return arr;
}

function arrayDelIndex(arr, toDelete) {
	var tmp = arr;
	arr = [];
	var cnt = tmp.length;
	for(var i = 0; i < cnt; i++) {
		if(i != toDelete) {
			arr.push(tmp[i]);
		}
	}
	
	return arr;
}

// 获取格式化的价格，精确到分
function formartPrice(price)
{
	price = parseFloat(price);
	if(isNaN(price)) {
		return '0.00';
	} else {
		return price.toFixed(2);
	}
	
	return str;
}