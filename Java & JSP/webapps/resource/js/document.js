{
    let menuList = document.querySelectorAll(".lnb > a");

    for(let i = 0; i < menuList.length; i++){
        menuList[i].addEventListener('click', menuClickEventListener);
    }
    lnbStateChangeCurrent();

    window.addEventListener('popstate', function(event){
        event.stopImmediatePropagation();
        replaceDocument(location.href, false);
    });




    function lnbStateChange(url){
        for(let i = 0; i < menuList.length; i++){
            if(menuList[i].href == url) menuList[i].setAttribute("active", '');
            else menuList[i].removeAttribute("active");
        }
    }

    function lnbStateChangeCurrent(){
        lnbStateChange(location.href);
    }

    function replaceDocument(url, pushState) {
        const targetSelector = ".document-fomatter";
        majax.replaceInnerHTML(url, document.querySelector(targetSelector), targetSelector, pushState, lnbStateChangeCurrent, function(xhr, exception) {
            location.reload();
        });
    }

    function menuClickEventListener(e){
        e.preventDefault();
        if(e.target.target == "_blank") location.href = e.target.href;
        else replaceDocument(e.target.href, true);
    }
}