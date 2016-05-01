Box.Application.addService('router',function(application){
	'use strict';
	var categories,utilities;
	return {
		init:function(){
			utilities=application.getService('utilities');
			categories=application.getService('db').getData('categories');
			var cat=location.href.split("/")[3];
			cat=cat.split("#")[0];
			if(cat=="" || cat=="unorganised"){
				application.broadcast("currentCategoryChanged",1);
			}
			for(var key in categories.data){
				if(cat.toLowerCase()==utilities.changeUrl(categories.data[key].name)){
					application.broadcast("currentCategoryChanged",categories.data[key].id);
				}
			}
		},
		changeTo:function(catId,cat){
			categories=cat;
			catId--;
			if(catId==0){
				var state = { 'catId': 1};
				var title = 'All';
				var url = 'unorganised';
				history.pushState(state, title, url);
			}
			else{
				var state = { "catId": catId,};
				var title = categories.data[catId].name;
				var url = utilities.changeUrl(categories.data[catId].name);
				history.pushState(state, title, url);
			}
		}
	};
})