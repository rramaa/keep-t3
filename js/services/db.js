Box.Application.addService('db',function(application){
	'use strict';
	return{
		getData:function(key){
			var data=localStorage.getItem(key);
			data=JSON.parse(data);
			return data;
		},
		setData:function(key,data){
			localStorage.setItem(key,JSON.stringify(data));
		}
	};
});