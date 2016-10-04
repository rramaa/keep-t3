
Box.Application.init({debug:true});
$(window).on('hashchange', function(){
	var utilities = Box.Application.getService('utilities');
	var cat = utilities.getCategoryFromHash();
	var id = utilities.getCategoryIdBasedOnHash(cat);
	Box.Application.broadcast("currentCategoryChanged", id);
})