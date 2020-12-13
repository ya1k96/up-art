$(document).ready(function(){

  if( $("#liquidarFlag") ) {

    $("#cantidad").attr("disabled", true);
    $("#select").attr("disabled", true);
    $("#cantidad").attr("value", (cantidadNormal() + cantidadEspecial() ));
    
    //Lista que genera las liquidaciones hechas por el usuario
    $.get('../liquidacion-list')        
    .then(function(resp) {
      $(".progress.is-small.is-primary").remove();
      if( resp.length != 0 ) {
        let article = `<div class="columns card animate__bounceIn">
        <div class="column is-12">
        <article id="liquidaciones" class="panel is-primary">
        <p class="panel-heading">
          Liquidaciones
        </p>
        `;
        
        resp.forEach( function(item) {
          article += `
          <a class="panel-block liquidacion">
            <input class="id-liq" type="hidden" value="${item._id}">
            <span class="panel-icon">
              <i class="fas fa-calendar-check" aria-hidden="true"></i>
            </span>
            ${moment(item.createdAt).format('l')}
          </a>`;        
        //<button class="btn btn-block btn-success">imprimir comprobante</button>   
      })
      article += `</article></div></div>`;

      $("#liquidaciones").append(article);  

      $('.liquidacion').on('click', verLiquidacion);

      } else {
        $("#liquidaciones").append(`<div class="card">
          <div class="d-flex justify-content-center p-4">
            <p>No tenes liquidaciones</p>
          </div>
          </div>`)
      }
    })
  }

});

 function tablaFactura(cantE, subE, cantN, subN, total, titulo, fecha) {
   return `
        <p class="title is-5">${titulo} - <span class="subtitle is-5">${fecha}</span></p>          
        <div class="columns">
          <div class="">
            <table class="table liqui">
            <thead class="">
              <tr>          
                <th>Total Articulos</th>
                <th>Precio</th>
                <th>SubTotal</th>
              </tr>
            </thead>
            <tfoot>
              <tr>          
                <th></th>
                <th></th>
                <th colspan="3">Total $<span class="subtitle is-6" id="total">${total}</span></th>
              </tr>
            </tfoot>
            <tbody>
              <tr>
                <th><span id="cantEspecial">${cantE}</span> x Editados</th>
                <td>10</td>
                <td><span class="title is-6" id="subEsp">${subE}</span></td>
              </tr>
              <tr>
                <th scope><span class="title is-6" id="cantNormal">${cantN}</span> x Normal</th>
                <td>5</td>
                <td><span class="title is-6" id="subNormal">${subN}</span></td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
     `;

}

function reporteGral() {  
  let cantNorm = cantidadNormal();
  let cantEsp = cantidadEspecial();
  let subtotalEsp = cantEsp * 10;
  let subtotalNorm = cantNorm * 5;
  let totalPrecio = subtotalEsp + subtotalNorm;
  
  if( (cantNorm + cantEsp) != 0 ) {
    let tabla = tablaFactura(cantEsp, subtotalEsp, cantNorm, subtotalNorm, totalPrecio, 'Reporte al dia', moment().format('l'));

    $("#imprimir").append(tabla);
  } 

  $("#btnPrint").on("click", function() {
    $("#imprimir").printThis({
      importCSS: true,
      header: "<p class="+ "text-center" +">Up - Art Gest. </p>"
    })   
  });
  
  $("#btnSave").on('click', guardarRequest);
}

function guardarRequest(){

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

}

function verLiquidacion() {
  let element = $(this);
  
  element.attr('disabled', true);

  $("#btnSave").attr('disabled', true);

  let imprimirEl = $("#imprimir");
  imprimirEl.empty();

  let progressBar = $('<progress>', {
    'html'  : '15%',
    'class' : 'progress is-small is-primary'   ,
    'max': '30%'        
  });

  imprimirEl.append(progressBar);

  let id_liquidacion = element.children('.id-liq')[0].value;

  $.get('../liquidacion/' + id_liquidacion )
  .then(data => {

      let subE = data.subTotalEspecial,
          subN = data.subTotalNormal,
          cantE = parseInt(subE, 10)/10,
          cantN = parseInt(subN, 10)/5,
          total = data.total;
      
      let detalle = $(tablaFactura(cantE, subE, cantN, subN, total, 'Liquidacion', moment(data.createdAt).format('l'))).hide();

      setTimeout(function() {
        progressBar.fadeOut('slow');
      }, 500)

      imprimirEl.append(detalle);
      
      setTimeout(function() {
        detalle.fadeIn('slow');
      }, 500)

      abrirModal();

      element.attr('disabled', false);
  });

}

function cantidadNormal() {
  return parseInt($("#normCant").val(), 10);
}

function cantidadEspecial() {
  return parseInt($("#espCant").val(), 10);
}

function abrirModal() {
  $('.modal').addClass('is-active');  
}

function cerrarModal() {
  $('.modal').removeClass('is-active');
  //Solo para activar el boton desactivado para ver liquidaciones anteriores
  $("#btnSave").attr('disabled', false);
  $("#imprimir").empty();
}

//mostrar calculo de liquidacion
$('#btnModal').on('click', mostrarAcumulado);

//cerrar modal
$('.delete').on('click', cerrarModal);

function mostrarAcumulado() {
  reporteGral();
  abrirModal();  
}