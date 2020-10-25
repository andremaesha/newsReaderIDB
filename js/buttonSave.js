document.addEventListener("DOMContentLoaded", (_) => {
    const urlParams = new URLSearchParams(window.location.search);
    const isFromSaved = urlParams.get("saved");

    const btnSave = document.getElementById("save");

    if (isFromSaved){
        // hide fab jika dimuat dari indexed db
        btnSave.style.display = "none";

        // ambil article lalu tampilkan
        getSavedArticles();
    } else {
        var item = getArticleById();
    }

    btnSave.onclick = (_) => {
        console.log("Button fab is push");

        item.then(article => {
            saveForLater(article);
        })
    }
});