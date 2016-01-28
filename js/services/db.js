Box.Application.addService('db',function(application){
	'use strict';
	var Category=function(id,name){
		this.id=id;
		this.name=name;
	};
	var Categories=function(){
		this.count=0;
		this.data=[];
	};
	var Notes=function(){
		this.count=0;
		this.last=0;
		this.data=[];
	};
	var categories,notes;
	return{
		getData:function(key){
			var data=localStorage.getItem(key);
			data=JSON.parse(data);
			return data;
		},
		setData:function(key,data){
			localStorage.setItem(key,JSON.stringify(data));
		},
		initializeCategories:function(){
			categories=new Categories();
			categories.count++;
			categories.data.push(new Category(categories.count,"All"));
			categories.count++;
			categories.data.push(new Category(categories.count,"Home"));
			categories.count++;
			categories.data.push(new Category(categories.count,"Personal"));
			categories.count++;
			categories.data.push(new Category(categories.count,"Work"));
			this.setData("categories",categories);
			return categories;
		},
		initializeNotes:function(){
			notes=new Notes();
			this.setData("notes",notes);
			return notes;
		}
	};
});