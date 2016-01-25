Box.Application.addModule('add-categories',function(context){
	'use strict';
	var Category=function(id,name){
		this.id=id;
		this.name=name;
	};
	var moduleElement,categories,db;
	return {
		init:function(){
			moduleElement=context.getElement();
			db=context.getService('db');
			categories=db.getData('categories');
			if(!categories){
				console.log('No categories');
				var temp=context.getService('initializeDb');
				categories=temp.initializeCategories();
				db.setData('categories',categories);
			}
		},
		addCategory:function(value){
			if(value!=""){
				categories.count++;
				var category=new Category(categories.count,value);
				categories.data.push(category);
				db.setData('categories',categories);
				context.broadcast('categoryAdded',category);
				Box.Application.stopAll(document.getElementById('notes'));
				Box.Application.startAll(document.getElementById('notes'));
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