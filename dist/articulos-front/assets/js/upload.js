$(document).ready(function() {
    let formaNuevos = $('#formaNuevos');
    let formadescripcion = $('#formaDescripciones');

    $('.tab-per').on('click', function() {
        
        //Obtenemos su hermano li
        let el = $(this).siblings('li');
        const type = $(this).text().trim();
        
        //Cambiamos el estados de las pestañas
        $(el[0]).removeClass('is-active');
        $(this).addClass('is-active');
        if( type === 'Nuevos' ) {
            formaNuevos.fadeIn('fast');
            formadescripcion.hide()
        } else {
            formadescripcion.fadeIn('fast');
            formaNuevos.hide()
        }
        
    })

});