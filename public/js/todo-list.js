
$(document).ready(function(){
  // if('serviceWorker' in navigator ){
  //   navigator.serviceWorker.register('../sw.js')
  //   .then(resp => console.log("sw registered"));
  // }

  if( $('#todo-table') ) {
    $('#todo-table').DataTable();
  }


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
    // $("#check").on("change", function() {
    //   let value = $("#select").attr("disabled");
    //   $("#total")[0].innerHTML = "Total: $0";
    //   $("#subTotNorm")[0].innerText = "Subtotal: $0";
    //   $("#subTotEsp")[0].innerText  = "Subtotal: $0";
    //   $("#select").attr("disabled", !value);
    //   $("#cantidad").attr("disabled", !value);
    //   $("#cantidad").attr("value", (cantEsp+cantNorm));
    // })

    // let calcBoton = $("#calcular");

    // calcBoton.on("click", () => {
    //   let todoSelected = $("#check").is(':checked')
      
    //   if( todoSelected ) {
    //     let subtotalEsp = cantEsp * 10;
    //     let subtotalNorm = cantNorm * 5;
    //     let totalPrecio = subtotalEsp + subtotalNorm;
  
    //     $("#subTotNorm")[0].innerText = "Subtotal normal: $"+ subtotalNorm.toString(); 
    //     $("#subTotEsp")[0].innerText = "Subtotal especial: $"+ subtotalEsp.toString(); 
    //     $("#total")[0].innerText = "Total: $"+ totalPrecio.toString(); 
    //   } else {
    //     //Si no esta seleccionado liquidar todo, pasamos a liquidar solo lo seleccionado
    //     let cantidadEl = $("#cantidad").val();
    //     let selectEl = $("#select option:selected").val();
    //     var precio = 5

    //     if(selectEl == 'Especial') {
    //       precio = 10;
    //     }
        
    //     $("#total")[0].innerText = "Total: $" + (cantidadEl * precio).toString();
    //   }
    // })

  }

  if( $("#proveedores-tabla") ) {
      $("#proveedores-tabla").DataTable();

      $("table tbody tr").on('click', function(event){
        console.log(event);
      })
  }

});
