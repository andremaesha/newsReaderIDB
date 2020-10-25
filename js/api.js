let base_url = "https://readerapi.codepolitan.com/";

// Blok kode yang akan di panggil jika fetch berhasil
function status(response){
    if (response.status !== 200){
        console.log(`Error: ${response.status}`);
        //Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

//Blok kode untuk memparsing json menjadi array JavaScript
function json(response){
    return response.json();
}

//Blok kode untuk meng-handle kesalahan di blok catch
function error(error){
    console.log(`Error: ${error}`);
}

//Blok kode untuk melakukan request data json
function getArticles(){
    if ('caches' in window) {
        caches.match(base_url + "articles").then(function(response) {
          if (response) {
            response.json().then(function (data) {
              let articlesHTML = "";
              data.result.forEach(function(article) {
                articlesHTML += `
                      <div class="card">
                        <a href="./article.html?id=${article.id}">
                          <div class="card-image waves-effect waves-block waves-light">
                            <img src="${article.thumbnail}" />
                          </div>
                        </a>
                        <div class="card-content">
                          <span class="card-title truncate">${article.title}</span>
                          <p>${article.description}</p>
                        </div>
                      </div>
                    `; 
              });
              // Sisipkan komponen card ke dalam elemen dengan id #content
              document.getElementById("articles").innerHTML = articlesHTML;
            })
          }
        })
      }

    fetch(base_url + "articles")
        .then(status)
        .then(json)
        .then(data => {
            // Objek/array JavaScript dari response.json() masuk lewat data.

            // Menyusun komponen card artikel secara dinamis

            let articlesHTML = "";
            data.result.forEach(article => {
                articlesHTML += `
                <div class="card">
                <a href="./article.html?id=${article.id}">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img src="${article.thumbnail}" />
                  </div>
                </a>
                <div class="card-content">
                  <span class="card-title truncate">${article.title}</span>
                  <p>${article.description}</p>
                </div>
              </div>`;
            });

            document.getElementById("articles").innerHTML = articlesHTML;
        })
        .catch(error);
}

function getArticleById(){
    return new Promise(resolve => {

        // amil nilai query parameter (?id=)
        let urlParams = new URLSearchParams(window.location.search);
        let idParams = urlParams.get("id");

        if ("caches" in window){
            caches.match(base_url + "article/" + idParams).then(function(response){
                if (response){
                    response.json().then(function(data){
                        let articleHTML = `
                        <div class="card">
                            <div class="card-image waves-effect waves-block waves-light">
                                <img src="${data.result.cover}"/>
                            </div>
                            <div class="card-content">
                                <span class="card-title">${data.result.post_title}</span>
                                ${snarkdown(data.result.post_content)}
                            </div>
                        </div>`;

                        document.getElementById("body-content").innerHTML = articleHTML;

                        // kirim object data hasil parsing json agar bisa disimpan ke indexed db
                        resolve(data);
                    });
                }
            })
        }


        fetch(base_url + "article/" + idParams)
        .then(status)
        .then(json)
        .then(data => {
            //object javascript dari response.json() masuk lewat variable data
            console.log(data);
            //menyusun komponen card article secara dinamis
            let articleHTML = `
            <div class="card hoverable">
                <div class="card-image waves-effect waves-block waves-light">
                    <img src="${data.result.cover}">
                </div>
                <div class="card-content">
                    <span class="card-title">${data.result.post_title}</span>
                    ${snarkdown(data.result.post_content)}
                </div>
            </div>`;

            //sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = articleHTML;

            //kirim object data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
        })
    });
}

/* getSavedArticles() yang akan mengambil seluruh artikel di Indexed DB melalui fungsi getAll() lalu menampilkannya. */
function getSavedArticles(){
    getAll().then(articles => {
        console.log(articles);

        //menyusun komponen card articles secara dinamis
        let articlesHTML = "";
        articles.forEach(article => {
            let description = article.post_content.substring(0, 100);
            articlesHTML += `
            <div class="card">
                <a href="./article.html?id=${article.ID}&saved=true">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img src="${article.cover}"/>
                    </div>
                </a>
                <div class="card-content">
                    <span class="card-title truncate">${article.post_title}</span>
                    <p>${description}</p>
                </div>
            </div>`;
        });
        // sisipkan component card ke dalam element dengan id #body-content
        document.getElementById("body-content").innerHTML = articlesHTML;
    })
}

// fungsi getSavedArticleById yang mengambil data dari database dan menampilkannya di halaman detail.
function getSavedArticlesById(){
    const urlParams = new URLSearchParams(window.location.search);
    const idParams = urlParams.get("id");
    let articleHTML = "";

    getById(idParams).then(article => {
        articleHTML += `
        <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
                <img src="${article.cover}"/>
            </div>
            <div class=""card-content>
                <span class="card-title">${artilce.post_title}</span>
                ${snarkdown(article.post_content)}
            </div>
        </div>`;

        // sisipkan component card ke dalam element dengan id #content
        document.getElementById("body-content").innerHTML = articleHTML;
    })
}