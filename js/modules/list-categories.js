Box.Application.addModule('list-categories',function(context){
	'use strict';
	var moduleElement,categories,router;
	return{
		messages:['categoryAdded',"ready"],
		init:function(){
			moduleElement=context.getElement();
			var db=context.getService('db');
			categories=db.getData('categories');
			// if(!categories){
			// 	categories=db.initializeCategories();
			// }
			router=context.getService('router');
			//router.changeTo(1);
			this.populateCategoryList();
		},
		createCategoryButton:function(category){
			var button=document.createElement('button');
			button.setAttribute('data-type','btn-category');
			button.setAttribute('data-cat-id',category.id);
			button.innerHTML=category.name;
			return button;
		},
		updateCategoryList:function(category){
			var btn=this.createCategoryButton(category);
			moduleElement.appendChild(btn);
			$(btn).hide();
			$(btn).fadeIn();
		},
		populateCategoryList:function(){
			for(var key in categories.data){
				this.updateCategoryList(categories.data[key]);
			}
		},
		onclick:function(event,element,elementType){
			if(elementType=="btn-category"){
				var id=element.getAttribute("data-cat-id");
				context.broadcast("currentCategoryChanged",id);
				console.log(id);
				router.changeTo(id);
			}
		},
		onmessage:function(name,data){
			if(name=='categoryAdded'){
				categories.count++;
				categories.data.push(data);
				this.updateCategoryList(data);
			}
			else if(name=="ready"){
				router.init();
			}
		},
		destroy:function(){

		}
	}
});