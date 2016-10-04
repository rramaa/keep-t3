Box.Application.addModule('list-notes',function(context){
	'use strict';
	var moduleElement,db,notes,selectedCategory,utilities,timer;
	return {
		messages:["currentCategoryChanged","newNoteAdded","categoryAdded"],
		init:function(){
			moduleElement=context.getElement();
			db=context.getService('db');
			notes=db.getData('notes');
			// if(!notes){
			// 	notes=db.initializeNotes();
			// }
			utilities=context.getService('utilities');
			selectedCategory=0;
			context.broadcast("ready");
			// this.populateNotes();
			//this.updateCategoryDropdown();
		},
		createNoteTemplate:function(){
			var noteTemplate=document.createDocumentFragment();
			var textarea=utilities.createElement('textarea',null,null,null,'note-editing');
			noteTemplate.appendChild(textarea);
			return noteTemplate;
		},
		createNote:function(note){
			var frag=document.createDocumentFragment();
			var div=utilities.createElement('div',null,null,null,'note',note.id);
			frag.appendChild(div);
			var content=this.format(note);
			var span=utilities.createElement('span',content,null,null,'note-content');
			div.appendChild(span);
			div.appendChild(this.createNoteTemplate());
			var encDiv=utilities.createElement('div',null,null,'all-buttons');

			var span=utilities.createElement('i',null,null,"fa fa-trash-o");
			var button=utilities.createElement('button',null,null,null,'btn-delete');
			button.appendChild(span);
			encDiv.appendChild(button);
			var span=utilities.createElement('i',null,null,"fa fa-check-square-o");
			var button=utilities.createElement('button',null,null,null,'btn-checkbox');
			button.appendChild(span);
			encDiv.appendChild(button);
			// var catDropdown=utilities.createCategoryDropdown(note.category);
			var catDropdown=utilities.createDropdownElement(note.category,"cat");
			encDiv.appendChild(catDropdown);
			// var colorDropdown=utilities.createColorDropdown(note.color);
			var colorDropdown=utilities.createDropdownElement(note.color,"color");
			encDiv.appendChild(colorDropdown[0]);
			div.appendChild(encDiv);
			div.style.backgroundColor=colorDropdown[1];
			frag.appendChild(div);
			return frag;
		},
		addNoteToList:function(note){
			var node=this.createNote(note);
			moduleElement.appendChild(node);
			// console.log(node);
			$(moduleElement.lastChild).hide();
			$(moduleElement.lastChild).fadeIn();
		},
		clearModuleChildren:function(){
			while(moduleElement.hasChildNodes()){
				moduleElement.removeChild(moduleElement.firstChild);
			}
		},
		populateNotes:function(){
			var obj=this;
			$(moduleElement).fadeOut("fast",function(){
				obj.clearModuleChildren();
				for(var key in notes.data){
					if(notes.data[key])
					if(notes.data[key].category==selectedCategory || selectedCategory==1){
						obj.addNoteToList(notes.data[key]);
					}
				}
			});
			$(moduleElement).fadeIn("slow");
		},
		updateCategoryDropdown:function(category){
			var catDropdowns=moduleElement.querySelectorAll('[data-type="change-cat"]');
			for(var key in catDropdowns){
				if(catDropdowns[key]){
					var ul=catDropdowns[key].querySelector('[class="dropdown-menu"]');
					var li=utilities.createElement('li');
					var a=utilities.createElement('a',category.name,null,null,category.id);
					a.setAttribute("href","#");
					li.appendChild(a);
					ul.appendChild(li);
				}
			}
		},
		removeNoteFromList:function(id){
			var node=moduleElement.querySelector('[data-note-id="'+id+'"]');
			$(node).animate({height:"0px",opacity:"0"},1000,function(){
				moduleElement.removeChild(node);
			});
		},
		deleteNote:function(id){
			delete notes.data[id-1];
			notes.count--;
			this.removeNoteFromList(id);
			db.setData('notes',notes);
			context.broadcast('noteDeleted',notes);
		},
		onmessage:function(name,data){
			if(name=="currentCategoryChanged"){
				if(selectedCategory!=data)
				{	
					selectedCategory=data;
					this.populateNotes();
				}
			}
			else if(name=="newNoteAdded"){
				this.addNoteToList(data);
				notes=db.getData('notes');
			}
			else if(name="categoryAdded"){
				utilities.updateCategory();
				this.updateCategoryDropdown(data);
			}
		},
		changeCategory:function(noteId,catId){
			notes.data[noteId-1].category=catId;
			var cat=moduleElement.querySelector('[data-note-id="'+noteId+'"]').querySelector('[data-type="change-cat"]').querySelector('[data-toggle="dropdown"]');
			db.setData('notes',notes);
			cat.removeChild(cat.firstChild);
			cat.insertBefore(document.createTextNode(utilities.getCategory(catId-1)),cat.firstChild);
			context.broadcast('noteDeleted',notes);
		},
		changeColor:function(noteId,colorId){
			notes.data[noteId-1].color=colorId;
			var color=utilities.getColor(colorId);
			console.log(notes);
			// moduleElement.querySelector('[data-note-id="'+noteId+'"]').style.backgroundColor="#"+color;
			$(moduleElement.querySelector('[data-note-id="'+noteId+'"]')).animate({backgroundColor:"#"+color});
			db.setData('notes',notes);
		},
		format:function(note){
			if(note.checkboxStatus){
				return this.checkboxFormat(note);
			}
			else{
				return this.normalFormat(note);
			}
		},
		checkboxFormat:function(note){
			var data=note.content.split("\n");
			var checked="",unchecked="";
			for(var key in data){
				if(note.checkboxData[key])
					checked+="<input type=checkbox checked data-type=btn-checkbox-flip id="+key+"><span class=checked>"+data[key]+"</span><br>";
				else
					unchecked+="<input type=checkbox data-type=btn-checkbox-flip id="+key+"><span class=unchecked>"+data[key]+"</span><br>";
			}
			if(checked=="")
				return unchecked;
			else
				return unchecked+"<u>Completed Tasks</u><br>"+checked;
		},
		normalFormat:function(note){
			return note.content.replace(/(\n)/g,"<br>");
		},
		addCheckboxes:function(note){
			var span=moduleElement.querySelector('[data-note-id="'+note.id+'"]').querySelector('[data-type="note-content"]');
			for(var key in note.content.split("\n")){
				note.checkboxData[key]=false;
				console.log(key);
			}
			span.innerHTML=this.checkboxFormat(note);
		},
		removeCheckboxes:function(note){
			var span=moduleElement.querySelector('[data-note-id="'+note.id+'"]').querySelector('[data-type="note-content"]');
			span.innerHTML=this.normalFormat(note);
		},
		invertCheckboxStatus:function(noteId){
			var note=notes.data[noteId-1];
			if(note.checkboxStatus){
				note.checkboxStatus=false;
				note.checkboxData=[];
				this.removeCheckboxes(note);
			}
			else{
				note.checkboxStatus=true;
				this.addCheckboxes(note);
			}
			console.log(note.checkboxData);
			db.setData('notes',notes);
		},
		flipCheckbox:function(noteId,key){
			var note=notes.data[noteId-1];
			note.checkboxData[key]=note.checkboxData[key]?false:true;
			db.setData('notes',notes);
			var span=moduleElement.querySelector('[data-note-id="'+note.id+'"]').querySelector('[data-type="note-content"]');
			span.innerHTML=this.checkboxFormat(note);
			console.log(key);
		},
		onclick:function(event,element,elementType){
			if(elementType=="btn-delete"){
				var id=element.parentNode.parentNode.getAttribute("data-note-id");
				this.deleteNote(id);
			}
			else if(elementType=="btn-checkbox"){
				var id=element.parentNode.parentNode.getAttribute("data-note-id");
				this.invertCheckboxStatus(id);
			}
			else if(elementType=="btn-checkbox-flip"){
				var noteId=element.parentNode.parentNode.getAttribute("data-note-id");
				this.flipCheckbox(noteId,element.id);
			}
			else if(parseInt(elementType))
			{
				event.preventDefault();
				var parent=element.parentNode.parentNode.parentNode;
				if(parent.getAttribute("data-type")=="change-cat"){
					if(elementType!=1)
						this.changeCategory(parent.parentNode.parentNode.getAttribute("data-note-id"),elementType);
				}
				else if(parent.getAttribute("data-type")=="change-color"){
					this.changeColor(parent.parentNode.parentNode.getAttribute("data-note-id"),elementType);
				}
			}
		},
		startEditing:function(noteId){
			var node=moduleElement.querySelector('[data-note-id="'+noteId+'"]');
			node.setAttribute("class","editing");
			var textarea=node.querySelector('[data-type="note-editing"]');
			textarea.value=utilities.parseAsHTML(notes.data[noteId-1].content);
			textarea.setAttribute("rows",(textarea.value.split("\n").length>3)?3:textarea.value.split("\n").length);
			textarea.select();
			textarea.focus();
		},
		ondblclick:function(event,element,elementType){
			if(elementType=="note-content"){
				this.startEditing(element.parentNode.getAttribute("data-note-id"));
			}
		},
		quitEditing:function(noteId){
			var node=moduleElement.querySelector('[data-note-id="'+noteId+'"]');
			console.log("ds");
			node.setAttribute("class","");
		},
		stopEditing:function(noteId,value){
			var node=moduleElement.querySelector('[data-note-id="'+noteId+'"]');
			node.setAttribute("class","");
			
			notes.data[noteId-1].content=utilities.cleanUp(value);
			db.setData("notes",notes);
			node.querySelector('[data-type="note-content"]').innerHTML=this.format(notes.data[noteId-1]);
			console.log(noteId,value);
		},
		onkeydown:function(event,element,elementType){
			if(elementType=="note-editing"){
				if(!utilities.checkMobile()){
					if(event.keyCode==13 && !event.shiftKey){
						var value=element.value;
						this.stopEditing(element.parentNode.getAttribute("data-note-id"),value);
						event.preventDefault();
					}
					else if(event.keyCode==27){
						this.startEditing(element.parentNode.getAttribute("data-note-id"));
						this.quitEditing(element.parentNode.getAttribute("data-note-id"));
					}
				}
			}
		},
		onfocusout:function(event,element,elementType){
			if(elementType=="note-editing"){
				var value=element.value;
				this.stopEditing(element.parentNode.getAttribute("data-note-id"),value);
				//event.preventDefault();
			}
		},
		onmousedown:function(event,element,elementType){
			if(elementType=='note-content'){
				if(utilities.checkMobile()){
					var obj=this;
					timer=setTimeout(function(){
						obj.startEditing(element.parentNode.getAttribute("data-note-id"));
					},1000);
				}
			}
		},
		onmouseup:function(event,element,elementType){
			if(elementType=='note-content'){
				if(utilities.checkMobile()){
					clearTimeout(timer);
				}
			}
		},
		destroy:function(){
			moduleElement=null;
			db=null;
			notes=null;
		}
	};
});