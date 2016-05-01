Box.Application.addModule('list-categories',function(context){
	'use strict';
	var moduleElement,categories,router,utilities,list;
	return{
		messages:['categoryAdded',"ready"],
		init:function(){
			moduleElement=context.getElement();
			var db=context.getService('db');
			categories=db.getData('categories');
			utilities=context.getService('utilities');
			list=utilities.createElement('ul');
			moduleElement.appendChild(list);
			// if(!categories){
			// 	categories=db.initializeCategories();
			// }
			router=context.getService('router');
			//router.changeTo(1);
			this.populateCategoryList();
		},
		createCategoryButton:function(category){
			var li=utilities.createElement('li');
			var i=utilities.createElement('i',null,null,'fa fa-dot-circle-o');
			var span=document.createElement('span');
			li.setAttribute('data-type','btn-category');
			li.setAttribute('data-cat-id',category.id);
			span.innerHTML=category.name;
			li.appendChild(i);
			li.appendChild(span);
			return li;
		},
		updateCategoryList:function(category){
			var listElem=this.createCategoryButton(category);
			list.appendChild(listElem);
			$(listElem).hide();
			$(listElem).fadeIn();
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
				router.changeTo(id,categories);
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