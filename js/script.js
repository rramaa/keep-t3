
Box.Application.init({debug:true});
window.onpopstate=function(e){
    if(e.state){
        console.log(e.state.catId);
        document.querySelector('[data-module="list-categories"]').querySelector('[data-cat-id="'+(e.state.catId+1)+'"]').click();
        e.preventDefault();
    }
};