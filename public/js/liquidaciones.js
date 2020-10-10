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

 function tablaFactura(cantE, subE, cantN, subN, total) {
   return `<div class="columns">
       <div class="column">
         <!-- <p class="subtitle is-6">Total Articulos</p> -->
       </div>                        
       <div class="column">
         
       </div>                      
       <div class="column">
         <p class="title is-6">Precio</p>
       </div>                        
       <div class="column">
         <p class="title is-6">Sub Total</p>
       </div>                      
     </div>
   
     <!-- Cuerpo -->
   
     <!-- Primera fila -->
     <div class="columns">
       <div class="column is-6">
         <p class="subtitle is-6">
         <span id="cantEspecial">${cantE}</span> x Editados
         </p>
       </div>                        
       
       <div class="column">
         <p class="subtitle is-6">
           $10
         </p>
       </div>                        
       <div class="column">
         <span class="title is-6" id="subEsp">${subE}</span>
       </div>                      
     </div>
   
     <hr>
   
     <!-- Segunda fila -->
     <div class="columns">
       <div class="column is-6">
         <p class="subtitle is-6">
           <span class="title is-6" id="cantNormal">${cantN}</span> x Normal
         </p>
       </div>                        
                             
       <div class="column">
         <p class="subtitle is-6">
           $5
         </p>
       </div>                        
       <div class="column">
         <span class="title is-6" id="subNormal">${subN}</span>
       </div>                      
     </div>
   
     <hr>
     <!-- Ultima Fila (TOTAL) -->
     <div class="columns">
       <div class="column is-2 is-offset-9">
         <p class="title is-6">Total $<span class="subtitle is-6" id="total">${total}</span></p>
       </div>
     </div>`;

}

function reporteGral() {  
  let cantNorm = cantidadNormal();
  let cantEsp = cantidadEspecial();
  let subtotalEsp = cantEsp * 10;
  let subtotalNorm = cantNorm * 5;
  let totalPrecio = subtotalEsp + subtotalNorm;
  
  if( (cantNorm + cantEsp) != 0 ) {
    let tabla = tablaFactura(cantEsp, subtotalEsp, cantNorm, subtotalNorm, totalPrecio);

    $("#imprimir").append(tabla);
  } 

  $("#btnPrint").on("click", function() {
    $("#imprimir").printThis({
      importCSS: true,
      header: "<h1>Liquidacion del dia</h1>"
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
      
      let detalle = $(tablaFactura(cantE, subE, cantN, subN, total)).hide();

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