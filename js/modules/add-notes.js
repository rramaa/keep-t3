Box.Application.addModule('add-notes',function(context){
	'use strict';
	var Note=function(id,content,cat){
		this.id=id;
		this.content=content;
		this.category=cat;
		this.color=Math.floor(Math.random()*8)+1;
		this.checkboxStatus=false;
		this.checkboxData=[];
	}
	var moduleElement,notes,db,utilities,selectedCategory;
	return {
		messages:['noteDeleted',"currentCategoryChanged"],
		init:function(){
			moduleElement=context.getElement();
			db=context.getService('db');
			notes=db.getData('notes');
			if(!notes){
				var temp=context.getService('initializeDb');
				notes=temp.initializeNotes();
				db.setData('notes',notes);
			}
			utilities=context.getService('utilities');
			selectedCategory=1;
		},
		updateNoteList:function(note){
			context.broadcast('newNoteAdded',note);
		},
		createNewNote:function(content){
			if(content=="")
				return;
			content=utilities.cleanUp(content);
			notes.last++;
			notes.count++;
			var note=new Note(notes.last,content,selectedCategory);
			notes.data.push(note);
			console.log(note);
			db.setData('notes',notes);
			this.updateNoteList(note);
		},
		onkeydown:function(event,element,elementType){
			if(elementType=="input-note"){
				if(event.keyCode==13 && !event.shiftKey){
					var value=element.value;
					this.createNewNote(value);
					element.value="";
					event.preventDefault();
				}
			}
		},
		onclick:function(event,element,elementType){
			if(elementType=="btn-add-note"){
				var textElement=moduleElement.querySelector('[data-type="input-note"]');
				var value=textElement.value;
				this.createNewNote(value);
				textElement.value="";
				event.preventDefault();
			}
		},
		onmessage:function(name,data){
			if(name=="noteDeleted"){
				notes=data;
			}
			else if(name="currentCategoryChanged"){
				selectedCategory=data;
			}
		},
		destroy:function(){
			moduleElement=null;
			db=null;
			notes=null;
		}
	};
});