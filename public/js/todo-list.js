
$(document).ready(function(){
  // if('serviceWorker' in navigator ){
  //   navigator.serviceWorker.register('../sw.js')
  //   .then(resp => console.log("sw registered"));
  // }

  if( $('#todo-table') ) {
    $('#todo-table').DataTable();
  }

  //if( $(".colapse") ) $('.collapse').collapse()  

  if( $("#liquidarFlag") ) {
    let cantNorm = parseInt($("#normCant").val(), 10);
    let cantEsp = parseInt($("#espCant").val(), 10);
    let subtotalEsp = cantEsp * 10;
    let subtotalNorm = cantNorm * 5;
    let totalPrecio = subtotalEsp + subtotalNorm;

    $('#cantEspecial')[0].innerText = cantEsp
    $('#subEsp')[0].innerText = subtotalEsp
    $('#cantNormal')[0].innerText = cantNorm
    $('#subNormal')[0].innerText = subtotalNorm
    $('#total')[0].innerText = totalPrecio
    $("#cantidad").attr("disabled", true);
    $("#select").attr("disabled", true);
    $("#cantidad").attr("value", (cantEsp+cantNorm));

    $("#btnPrint").on("click", function() {
      $("#imprimir").printThis({
        importCSS: true,
        header: "<h1>Liquidacion del dia</h1>"
    })   
    }) 
    
    $("#btnSave").on('click', function(e){
      let btnSave = $("#btnSave")
      let spinner = `<div class="spinner-border spinner-border-sm" role="status">
                    <span class="sr-only">Loading...</span>`;
      btnSave.attr("disabled", true);
      btnSave.append(spinner);

      //Hacer la peticion http a pedir liquidacion
    })
    
    //Lista que genera las liquidaciones hechas por el usuario
    $.get('../liquidacion-list')        
    .then(function(resp) {
      $("#spinner").remove();
      if( resp.length != 0 ) {
        resp.forEach( function(item) {
          var cardL = `<div id="accordion" role="tablist">
          <div class="card animate__bounceIn">
            <div class="card-header" role="tab" id="heading${item._id}">
              <h5 class="mb-0">
                <a data-toggle="collapse" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  ${moment(item.createdAt).fromNow()}
                </a>
              </h5>
            </div>

            <div id="collapseOne" class="collapse show" role="tabpanel" aria-labelledby="headingOne">
              <div class="card-body">
                <div class="row">
                  <div class="col-12">
                  $${item.subTotalNormal} Art. Normales
                </div>                
                <div class="col-12">
                  $${item.subTotalEspecial} Art. Editados
                </div> 
                <div class="col-12">
                  Total $${item.total}
                </div>
                </div>                                                              
              </div>
              <button class="btn btn-block btn-success">imprimir comprobante</button>  
            </div>
          </div>

        </div>`; 
        $("#liquidaciones").append(cardL);  
        })
      } else {
        $("#liquidaciones").append(`<div class="card">
          <div class="d-flex justify-content-center p-4">
            <p>No tenes liquidaciones</p>
          </div>
          </div>`)
      }
    })
  }

  if( $("#proveedores-tabla") ) {
      $("#proveedores-tabla").DataTable();

      $("table tbody tr").on('click', function(event){
        console.log(event);
      })
  }

});
