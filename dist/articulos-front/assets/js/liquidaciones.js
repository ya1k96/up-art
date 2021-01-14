function imprimirFactura() {
  $("#imprimir").printThis({
    importCSS: true,
    header: "<p class="+ "text-center" +">Up - Art Gest. </p>"
  })   
};
