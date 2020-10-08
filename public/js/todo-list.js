
$(document).ready(function(){
  // if('serviceWorker' in navigator ){
  //   navigator.serviceWorker.register('../sw.js')
  //   .then(resp => console.log("sw registered"));
  // }

  if( $('#todo-table') ) {
    $('#todo-table').DataTable({
      "language": {
        "sProcessing":    "Procesando...",
        "sLengthMenu":    "Mostrar _MENU_ registros",
        "sZeroRecords":   "No se encontraron resultados",
        "sEmptyTable":    "Ningún dato disponible en esta tabla",
        "sInfo":          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty":     "Mostrando registros del 0 al 0 de un total de 0 registros",
        "sInfoFiltered":  "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix":   "",
        "sSearch":        "Buscar:",
        "sUrl":           "",
        "sInfoThousands":  ",",
        "sLoadingRecords": "Cargando...",
        "oPaginate": {
            "sFirst":    "Primero",
            "sLast":    "Último",
            "sNext":    "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
      },
      dom: 'Bfrtip',
        buttons: [
            'print'
        ],
    });
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
      let btnSave = $("#btnSave");
      let progress = $('#progress');
      //Creamos el elemento progressBar
      let progressBar = $('<progress>', {
        'html'  : '15%',
        'class' : 'progress is-small is-primary'   ,
        'max': '30%'        
      });

      btnSave.attr("disabled", true);
      progressBar.append(progress);

      //peticion http a pedir liquidacion
      $.get('../pedir-liquidacion')
      .then( function (resp) {        

        let confirmacion = $('<div>', {          
          'class' : ' animate__bounceIn notification'            
        });        
        resp.ok ? confirmacion.addClass(".is-success") : confirmacion.addClass(".is-danger");
        confirmacion.append(resp.msg);

        progress.fadeOut('fast');
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
      $(".progress.is-small.is-primary").remove();
      if( resp.length != 0 ) {
        resp.forEach( function(item) {
          var cardL = `
          <div class="column card animate__bounceIn">
            
            <div class="columns">
              <div class="column is-12">
              ${moment(item.createdAt).format('l')}
              </div>
              <div class="column is-12">
              Art. Normales $${item.subTotalNormal}
              </div>

              <div class="column is-12">
              Art. Editados $${item.subTotalEspecial}
              </div> 

              <div class="column is-12">
              Total $${item.total}
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
