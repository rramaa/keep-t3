Box.Application.addService('router',function(application){
	'use strict';
	var categories,utilities;
	return {
		start:function(){
			utilities=application.getService('utilities');
			categories=application.getService('db').getData('categories');
			var cat=utilities.getCategoryFromHash();
			var id = utilities.getCategoryIdBasedOnHash(cat);
			id && application.broadcast("currentCategoryChanged", id);
		},
		changeTo:function(catId,cat){
			categories=cat;
			catId--;
			if(catId==0){
				var state = { 'catId': 1};
				var title = 'All';
				var url = '#unorganised';
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