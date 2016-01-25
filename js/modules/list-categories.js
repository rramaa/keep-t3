Box.Application.addModule('list-categories',function(context){
	'use strict';
	var moduleElement,categories;
	return{
		messages:['categoryAdded'],
		init:function(){
			moduleElement=context.getElement();
			var db=context.getService('db');
			categories=db.getData('categories');
			if(!categories){
				console.log('No categories');
				var temp=context.getService('initializeDb');
				categories=temp.initializeCategories();
				db.Data('categories',categories);
			}
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
			moduleElement.appendChild(this.createCategoryButton(category));
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
			}
		},
		onmessage:function(name,data){
			if(name='categoryAdded'){
				categories.count++;
				categories.data.push(data);
				this.updateCategoryList(data);
			}
		},
		destroy:function(){

		}
	}
});