
$(document).ready(function(){
  // if('serviceWorker' in navigator ){
  //   navigator.serviceWorker.register('../sw.js')
  //   .then(resp => console.log("sw registered"));
  // }

  if( $('#todo-table') ) {
    $('#todo-table').DataTable();
  }

  if( $(".colapse") ) $('.collapse').collapse()  

  if( $("#liquidarFlag") ) {
    let cantNorm = parseInt($("#normCant").val(), 10);
    let cantEsp = parseInt($("#espCant").val(), 10);
    let subtotalEsp = cantEsp * 10;
    let subtotalNorm = cantNorm * 5;
    let totalPrecio = subtotalEsp + subtotalNorm;
    $("#cantidad").attr("disabled", true);
    $("#select").attr("disabled", true);
    
    if( (cantNorm + cantEsp) != 0 ) {
      $('#cantEspecial')[0].innerText = cantEsp
      $('#subEsp')[0].innerText = subtotalEsp
      $('#cantNormal')[0].innerText = cantNorm
      $('#subNormal')[0].innerText = subtotalNorm
      $('#total')[0].innerText = totalPrecio
      $("#cantidad").attr("value", (cantEsp+cantNorm));
    } 

    $("#btnPrint").on("click", function() {
      $("#imprimir").printThis({
        importCSS: true,
        header: "<h1>Liquidacion del dia</h1>"
    })   
    }) 
    
    $("#btnSave").on('click', function(e){
      let btnSave = $("#btnSave")
      let spinner = $('<div>', {
        'html'  : '<span class="sr-only">Loading...</span>',
        'class' : 'spinner-border spinner-border-sm'   ,
        'role'  : 'status'            
      });

      btnSave.attr("disabled", true);
      btnSave.append(spinner);

      //peticion http a pedir liquidacion
      $.get('../pedir-liquidacion')
      .then( function (resp) {        

        let confirmacion = $('<div>', {          
          'class' : ' animate__bounceIn alert'            
        });        
        resp.ok ? confirmacion.addClass(".success") : confirmacion.addClass(".danger");
        confirmacion.append(resp.msg);

        spinner.fadeOut('fast');
        btnSave.attr("disabled", false);
        $("#notificaciones").append(confirmacion);

        //Luego de tres segundos eliminamos la notificacion
        setTimeout(function(){
          confirmacion.fadeOut('fast');
        }, 3000);
        
      })
      

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
                  ${moment(item.createdAt).format('l')}
                </a>
              </h5>
            </div>

            <div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingOne">
              <div class="card-body">
                <div class="row">
                  <div class="col-12">
                  Art. Normales $${item.subTotalNormal}
                </div>                
                <div class="col-12">
                  Art. Editados $${item.subTotalEspecial}
                </div> 
                <div class="col-12">
                  Total $${item.total}
                </div>
                </div>                                                              
              </div>
              
            </div>
          </div>
        </div>`;        
        //<button class="btn btn-block btn-success">imprimir comprobante</button>   
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
