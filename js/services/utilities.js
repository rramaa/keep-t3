Box.Application.addService('utilities',function(application){
	'use strict';
	var Color=function(name,hash){
	this.name=name;
	this.hash=hash;
	}
	var Colors=[];
	Colors.push(new Color("Select Color","undefined"));
	Colors.push(new Color("","e5e5ff"));
	Colors.push(new Color("","ffe5f6"));
	Colors.push(new Color("","c6ecc6"));
	Colors.push(new Color("","ffffb3"));
	Colors.push(new Color("","ffcccc"));
	Colors.push(new Color("","ebccff"));
	Colors.push(new Color("","fff2cc"));
	Colors.push(new Color("","ccd9ff"));
	var db=application.getService('db');
	var categories=db.getData('categories');
	return {
		checkMobile:function(){
			var isMobile=( navigator.userAgent.match(/Android/i)
		 || navigator.userAgent.match(/webOS/i)
		 || navigator.userAgent.match(/iPhone/i)
		 || navigator.userAgent.match(/iPad/i)
		 || navigator.userAgent.match(/iPod/i)
		 || navigator.userAgent.match(/BlackBerry/i)
		 || navigator.userAgent.match(/Windows Phone/i))?true:false;
			return isMobile;
			// return true;
		},
		capitalizeFirstLetter:function(text){
			return text.charAt(0).toUpperCase() + text.slice(1);
		},
		changeUrl:function(URL){
			return URL.toLowerCase().replace(" ","-");
		},
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
		createDropdownElement:function(id,type){
			var frag=document.createDocumentFragment();
			var div,button,data;
			if(type=="color"){
				div=this.createElement('div',null,null,"dropdown","change-color");
				button=this.createElement('button',"Select Color",null,"btn btn-primary dropdown-toggle");
				data=Colors;
			}
			else if(type=="cat"){
				div=this.createElement('div',null,null,"dropdown","change-cat");
				if(id==1)
					button=this.createElement('button',"Select Category",null,"btn btn-primary dropdown-toggle");
				else
					button=this.createElement('button',categories.data[id-1].name,null,"btn btn-primary dropdown-toggle");
				data=categories.data;
			}
			frag.appendChild(div);
			button.setAttribute("type","button");
			button.setAttribute("data-toggle","dropdown");
			div.appendChild(button);
			var span=this.createElement('span',null,null,'caret');
			button.appendChild(span);
			var ul=this.createElement('ul',null,null,"dropdown-menu");
			div.appendChild(ul);
			for(var key in data){
				var li=this.createElement('li');
				var a;
				
				if(type=="color"){
					a=this.createElement('a',data[key].name,null,null,key);
					a.setAttribute("data-color-id",data[key].hash);
					li.style.backgroundColor="#"+data[key].hash;
				}
				else if(type=="cat"){
					a=this.createElement('a',data[key].name,null,null,data[key].id);
					a.setAttribute("data-cat-id",data[key].id);
				}
				a.setAttribute("href","#");
				li.appendChild(a);
				ul.appendChild(li);
			}
			if(type=="color"){
				return [frag,"#"+Colors[id].hash];
			}
			else if(type=="cat"){
				return frag;
			}
		}
	};
});