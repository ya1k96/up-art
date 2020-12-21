
$(document).ready(function() {
    let content = $("#content");
    let pagination = $("#pagination");        
    let progressBar = $('#progressBar');
    let buscarInput = $("#buscarInput");
    let tagZone = $("#tagZone");
    let closeTag = $("#closeTag");

    cargarImagenes();
    buscarInput.keyup(function(event) {        

        if( event.key === 'Enter' ) {
            buscarImagen( this.value );                        
        }
        
    });

    closeTag.click(function() {
        tagZone.fadeOut('fast');
        $('#tagName').html('');
        cargarImagenes();
    });

    function cargarImagenes(pagina = 1)  {                
        //Limpiamos la pantalla del contenido anterior
        pagination.html('');
        content.html('');                
        progressBar.fadeIn('fast');        
        
        //Peticion
        $.get( '/api/lista-imagenes/'+ pagina )
        .then( resp => {
            drawItems(resp.result);
        });
        
    }

    function buscarImagen( query ) {
        //Limpiamos la pantalla del contenido anterior
        pagination.html('');
        content.html('');        
        progressBar.fadeIn('fast');
        tagZone.fadeIn('fast');
        $('#tagName').html(query);
        buscarInput.val('');

        $.get( '/api/buscar-imagen?keyword=' + query )
        .then(resp => {
            drawItems(resp, false);
        });
        
    }

    function drawItems( items, paginationMode = true ) {

        if(items.docs.length === 0) {
            const noResults = $(`<p class="subtitle is-4 has-text-centered">No hay resultados</p>`);
            content.append(noResults);
        }

        items.docs.forEach( doc => {
                
            let item = `<div class="column is-3">
                <div class="card">
                    <div class="card-image">
                        <figure class="image is-square">
                            <img src="${doc.img_url}">                        
                        </figure>
                    </div>
                    
                    <div class="card-content">
                        <div class="content">
                            <p><strong>
                            ${doc.code_name}
                            </strong></p>
                            <br>
                            <time>${moment(doc.createdAt).fromNow()}</time>
                        </div>
                        </div>
                        <!-- <footer class="card-footer">
                            <a href="#" class="card-footer-item">Bien</a>
                            <a href="#" class="card-footer-item">Mal</a>
                        </footer> -->
                    </div>
        
                </div>
            </div>`;

            content.append(item);
                                            
        });
        

        //quitamos el progressbar 
        progressBar.fadeOut('fast');

        if( paginationMode ) {
            const pageInfo = items;

            let paginationElement = $(`<nav class="pagination is-rounded" role="navigation" aria-label="pagination" id="pagination"></nav>`);

            // let siguienteAnterior = $(`
            // <a class="pagination-previous"${ pageInfo.hasPrevPage ? '' : 'disabled'}>Previous</a>
            // <a class="pagination-next" ${ pageInfo.hasNextPage ? '' : 'disabled'} >Next page</a>`);
            
            // paginationElement.append(siguienteAnterior);

            let listItems = $(`<ul class="pagination-list"></ul>`);
            
            
            //let dots = $(`<li><span class="pagination-ellipsis">&hellip;</span></li>`);
            
            // listItems.append($(`<li><a class="pagination-link" aria-label="Goto page 1"
            // ${pagina === 1 ? 'disabled' : ''}>${1}</a></li>`));  
            
            

            if(pageInfo.hasPrevPage) {
                listItems.append($(`<li><a class="pagination-link">${pageInfo.prevPage}</a></li>`) );    

            }

            listItems.append($(`<li><a class="pagination-link is-current" aria-label="Goto" aria-current="page">${pageInfo.page}</a></li>`) );     
            
            if(pageInfo.hasNextPage) {
                listItems.append($(`<li><a class="pagination-link">${pageInfo.nextPage}</a></li>`) );            

            }


            // listItems.append($(`<li><a class="pagination-link" aria-label="Goto page 1"
            // ${pageInfo.totalPages === pagina ? 'disabled' : ''}>${pageInfo.totalPages}</a></li>`) );            

            paginationElement.append(listItems);
            
            
            pagination.append(paginationElement);
            $('.pagination-link').click('click', function(event) {
                let page = parseInt($(event.target).text(), 10 );

                cargarImagenes(page);
            });
        
        }

    }

});
