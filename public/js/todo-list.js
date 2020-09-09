$(document).ready(function(){
  if( $('#todo-table') ) {
    $('#todo-table').DataTable();
  }


  if( $("#liquidarFlag") ) {
    let cantNorm = parseInt($("#normCant").val(), 10);
    let cantEsp = parseInt($("#espCant").val(), 10);
    
    $("#check").on("change", function() {
      let value = $("#select").attr("disabled");
      $("#total")[0].innerHTML = "Total: $0";
      $("#subTotNorm")[0].innerText = "Subtotal: $0";
      $("#subTotEsp")[0].innerText  = "Subtotal: $0";
      $("#select").attr("disabled", !value);
      $("#cantidad").attr("disabled", !value);
      $("#cantidad").attr("value", (cantEsp+cantNorm));
    })

    let calcBoton = $("#calcular");

    calcBoton.on("click", () => {
      let todoSelected = $("#check").is(':checked')
      
      if( todoSelected ) {
        let subtotalEsp = cantEsp * 10;
        let subtotalNorm = cantNorm * 5;
        let totalPrecio = subtotalEsp + subtotalNorm;
  
        $("#subTotNorm")[0].innerText = "Subtotal normal: $"+ subtotalNorm.toString(); 
        $("#subTotEsp")[0].innerText = "Subtotal especial: $"+ subtotalEsp.toString(); 
        $("#total")[0].innerText = "Total: $"+ totalPrecio.toString(); 
      } else {
        //Si no esta seleccionado liquidar todo, pasamos a liquidar solo lo seleccionado
        let cantidadEl = $("#cantidad").val();
        let selectEl = $("#select option:selected").val();
        var precio = 5

        if(selectEl == 'Especial') {
          precio = 10;
        }
        
        $("#total")[0].innerText = "Total: $" + (cantidadEl * precio).toString();
      }
    })

  }
});
