Box.Application.addModule('add-categories',function(context){
	'use strict';
	var Category=function(id,name){
		this.id=id;
		this.name=name;
	};
	var moduleElement,categories,db,utilities;
	return {
		init:function(){
			moduleElement=context.getElement();
			db=context.getService('db');
			utilities=context.getService('utilities');
			categories=db.getData('categories');
			if(!categories){
				categories=db.initializeCategories();
			}
		},
		addCategory:function(value){
			if(value!=""){
				categories.count++;
				value=utilities.capitalizeFirstLetter(value);
				var category=new Category(categories.count,value);
				categories.data.push(category);
				db.setData('categories',categories);
				context.broadcast('categoryAdded',category);
			}
		},
		onclick:function(event,element,elementType){
			if(elementType=='btn-add-category'){
				var inputEl=moduleElement.querySelector('[data-type="input-category"]');
				this.addCategory(inputEl.value);
				inputEl.value="";
			}
		},
		onkeydown:function(event,element,elementType){
			if(event.keyCode==13){
				if(elementType=="input-category"){
					this.addCategory(element.value);
					element.value="";
				}
			}
		},
		destroy:function(){
			moduleElement=null;
			db=null;
			categories=null;
		}
	};
});