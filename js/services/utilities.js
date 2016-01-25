Box.Application.addService('utilities',function(application){
	'use strict';
	var Color=function(name,hash){
	this.name=name;
	this.hash=hash;
	}
	var Colors=[];
	Colors.push(new Color("Select Color","undefined"));
	Colors.push(new Color("Lavender","e5e5ff"));
	Colors.push(new Color("Lavender Blush","ffe5f6"));
	Colors.push(new Color("Green","c6ecc6"));
	Colors.push(new Color("Yellow","ffffb3"));
	Colors.push(new Color("Cosmos","ffcccc"));
	Colors.push(new Color("Blue Chalk","ebccff"));
	Colors.push(new Color("Oasis","fff2cc"));
	Colors.push(new Color("Hawkes Blue","ccd9ff"));
	var db=application.getService('db');
	var categories=db.getData('categories');
	return {
		cleanUp:function(content){
			return this.parseAsText(content.trim());
		},
		parseAsText:function(content){
			return content.replace(/(&)/g,"&amp;").replace(/(<)/g,"&lt;").replace(/(>)/g,"&gt;").replace(/(")/g,"&quot;").replace(/(')/g,"&#039;");
		},
		parseAsHTML:function(content){
			return content.replace(/(&lt;)/g,'<').replace(/(&gt;)/g,'>').replace(/(&amp;)/g,'&').replace(/(&quot;)/g,'\"').replace(/(&#039;)/g,'\'');
		},
		getColor:function(id){
			return Colors[id].hash;
		},
		getCategory:function(id){
			return categories.data[id].name;
		},
		updateCategory:function(){
			categories=db.getData('categories');
		},
		createElement:function(type,innerHTML,id,Class,dataType,dataNoteId){
			var element=document.createElement(type);
			if(innerHTML)
				element.innerHTML=innerHTML;
			if(id)
				element.setAttribute('id',id);
			if(Class)
				element.setAttribute('class',Class);
			if(dataType)
				element.setAttribute('data-type',dataType);
			if(dataNoteId)
				element.setAttribute('data-note-id',dataNoteId);
			return element;
		},
		createColorDropdown:function(id){
			var frag=document.createDocumentFragment();
			var div=this.createElement('div',null,null,"dropdown","change-color");
			frag.appendChild(div);
			var button=this.createElement('button',"Select Color",null,"btn btn-primary dropdown-toggle");
			button.setAttribute("type","button");
			button.setAttribute("data-toggle","dropdown");
			div.appendChild(button);
			var span=this.createElement('span',null,null,'caret');
			button.appendChild(span);
			var ul=this.createElement('ul',null,null,"dropdown-menu");
			div.appendChild(ul);
			for(var key in Colors){
				var li=this.createElement('li');
				var a=this.createElement('a',Colors[key].name,null,null,key);
				a.setAttribute("href","#");
				a.setAttribute("data-color-id",Colors[key].hash);
				li.style.backgroundColor="#"+Colors[key].hash;
				li.appendChild(a);
				ul.appendChild(li);
			}
			return [frag,"#"+Colors[id].hash];
		},
		createCategoryDropdown:function(catId){
			var frag=document.createDocumentFragment();
			var div=this.createElement('div',null,null,"dropdown","change-cat");
			frag.appendChild(div);
			if(catId==1)
				var button=this.createElement('button',"Select Category",null,"btn btn-primary dropdown-toggle");
			else
				var button=this.createElement('button',categories.data[catId-1].name,null,"btn btn-primary dropdown-toggle");
			button.setAttribute("type","button");
			button.setAttribute("data-toggle","dropdown");
			div.appendChild(button);
			var span=this.createElement('span',null,null,'caret');
			button.appendChild(span);
			var ul=this.createElement('ul',null,null,"dropdown-menu");
			div.appendChild(ul);
			for(var key in categories.data){
				var li=this.createElement('li');
				var a=this.createElement('a',categories.data[key].name,null,null,categories.data[key].id);
				a.setAttribute("href","#");
				a.setAttribute("data-cat-id",categories.data[key].id);
				li.appendChild(a);
				ul.appendChild(li);
			}
			return frag;
		}
	};
});