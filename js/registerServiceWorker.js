if ("serviceWorker" in navigator){
    window.addEventListener("load", function(){
        navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(function(){
            console.log("Register ServiceWorker success");
        })
        .catch(function(){
            console.log("Register ServiceWoker Failed");
        });
    });
} else {
    console.log("Browser Not Support ServiceWorker");
}

document.addEventListener("DOMContentLoaded", function() {
    getArticles();
});