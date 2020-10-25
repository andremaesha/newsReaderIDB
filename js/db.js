let dbPromise = idb.open("news-reader", 1, upgradeDB => {
    let articleObjectStore = upgradeDB.createObjectStore("articles", {
        keyPath: "ID"
    });
    articleObjectStore.createIndex("post_title", "post_title", {unique: false});
});

//block function for saved new article.
const saveForLater = article => {
    dbPromise
    .then(db => {
        let tx = db.transaction("articles", "readwrite");
        let store = tx.objectStore("articles");

        console.log(article);
        store.add(article.result);

        return tx.complete;
    }).then((_) => {
        console.log("Article is Save");
    })
}

/* Saat halaman saved.html di muat kita ingin mengambil seluruh data yang tersimpan di Indexed DB lalu menampilkannya sebagaimana kita menampilkan data dari server di halaman home.html. Tambahkan fungsi getAll() */
const getAll = (_) => {
    return new Promise((resolve, reject) => {
        dbPromise.then(db => {
            let tx = db.transaction("articles", "readonly");
            let store = tx.objectStore("articles");

            return store.getAll();
        }).then(article => {
            resolve(article);
        }).catch(error => {
            reject(error);
        });
    });
}

// fungsi getById untuk mengambil satu data dari database berdasarkan id
const getById = id => {
    return new Promise((resolve, reject) => {
        dbPromise.then(db => {
            let tx = db.transaction("articles", "readonly");
            let store = tx.objectStore("articles");

            return store.get(id);
        }).then(article => {
            resolve(article);
        })
    })
}