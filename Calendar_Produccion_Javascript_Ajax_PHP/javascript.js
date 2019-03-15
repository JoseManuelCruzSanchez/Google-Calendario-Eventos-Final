let fechaActual = new Date();
let fechaParametroAPI = fechaActual.getFullYear() + '-' + (parseInt(fechaActual.getMonth())+1) + '-' + fechaActual.getDate() + 'T00:00:00Z';
let urlConsultaAPI = 'https://www.centroloyola.org/datos_desde_google.php?fecha=' + fechaParametroAPI;
let dias = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        /*
        * ERRORES:
        * Hay que configurar el id de calendario y la apikey en el php
        * Ejecutar desde htdocs
        */
        respuestaJSON = JSON.parse(this.responseText);
        let cuantos_eventos_mostrar = 6;
        let en_caso_que_no_haya_eventos = cuantos_eventos_mostrar;
        let url_actual = sede_ciudad_basado_en_url();
        let pos_item_evento = 0;
        do{
            switch (url_actual){/*En que página estamos*/

                case 'bilbao':
                    if (respuestaJSON.items[pos_item_evento].summary.toLowerCase().indexOf('bilbao') !== -1){
                        evento_fechas_llamada_insertar(respuestaJSON, pos_item_evento);
                        cuantos_eventos_mostrar--;
                    }
                    break;
                case 'pamplona':
                    if (respuestaJSON.items[pos_item_evento].summary.toLowerCase().indexOf('pamplona') !== -1){
                        evento_fechas_llamada_insertar(respuestaJSON, pos_item_evento);
                        cuantos_eventos_mostrar--;
                    }
                    break;
                case 'san-sebastian':
                    if (respuestaJSON.items[pos_item_evento].summary.toLowerCase().indexOf('donostia') !== -1){
                        evento_fechas_llamada_insertar(respuestaJSON, pos_item_evento);
                        cuantos_eventos_mostrar--;
                    }
                    break;
                case 'vitoria':
                    if (respuestaJSON.items[pos_item_evento].summary.toLowerCase().indexOf('vitoria') !== -1){
                        evento_fechas_llamada_insertar(respuestaJSON, pos_item_evento);
                        cuantos_eventos_mostrar--;
                    }
                    break;
                case 'loyola-azpeitia':
                    if (respuestaJSON.items[pos_item_evento].summary.toLowerCase().indexOf('loyola-azpeitia') !== -1){
                        evento_fechas_llamada_insertar(respuestaJSON, pos_item_evento);
                        cuantos_eventos_mostrar--;
                    }
                    break;
                default:
                    evento_fechas_llamada_insertar(respuestaJSON, pos_item_evento);
                    cuantos_eventos_mostrar--;
            }
            pos_item_evento++;
        }while(cuantos_eventos_mostrar > 0 && pos_item_evento < respuestaJSON.items.length);
        if(en_caso_que_no_haya_eventos !== cuantos_eventos_mostrar){//Si hay al menos 1 evento para esta ciudad
            salidaDatos += '</ul>';
            document.getElementById('contenedor-salida-eventos').innerHTML = salidaDatos;
        }else{
            salidaDatos = '<p style="font-size:16px" id="ciudad_sin_eventos">No hay eventos en las próximas fechas</p>';
            document.getElementById('contenedor-salida-eventos').innerHTML = salidaDatos;
        }
    }
};
xhttp.open("GET", urlConsultaAPI, true);
xhttp.send();
let salidaDatos = '<ul>';
function insertar_al_DOM(fechaInicioEvento, fechaFinEvento, respuestaJSON, posBucle) {
    let fechaInicio = dias[fechaInicioEvento.getDay()] + ', ' + fechaInicioEvento.getDate() + ' de ' + meses[fechaInicioEvento.getMonth()] + ', ' + horas_dos_digitos(fechaInicioEvento) + ':' + minutos_dos_digitos(fechaInicioEvento);
    let fechaFin = dias[fechaFinEvento.getDay()] + ', ' + fechaFinEvento.getDate() + ' de ' + meses[fechaFinEvento.getMonth()] + ', ' + horas_dos_digitos(fechaFinEvento) + ':' + minutos_dos_digitos(fechaFinEvento);
    let provincia = typeof respuestaJSON.items[posBucle].location === 'undefined' ? ciudad_evento(respuestaJSON.items[posBucle]) : respuestaJSON.items[posBucle].location;
    let observaciones = typeof respuestaJSON.items[posBucle].description === 'undefined' ? 'Más información: ' + get_email_segun_ciudad(respuestaJSON.items[posBucle]) : respuestaJSON.items[posBucle].description;
    let enlaceGoogleMaps = '<a class="linkMaps" href="http://maps.apple.com/?q=' + provincia + '" target="_blank">' + provincia + '</a>';
    let innerHTML_POPUP = '<div class="cont-popup-evento"><div onclick="this.parentNode.style.display = \'none\';">x</div> <p>' +
        respuestaJSON.items[posBucle].summary.substring(respuestaJSON.items[posBucle].summary.indexOf(']')+1) + '</p> <div class="direccion_lugar_hora"> <div class="lugar_evento">' +
        '<i class="fa fa-map-marker" aria-hidden="true"></i> ' + enlaceGoogleMaps + '</div> <div class="hora_evento">' +
        '<i class="fa fa-clock-o" aria-hidden="true"></i> ' + fechaInicio + ' - ' + fechaFin +
        '</div> <div class="observaciones_evento">' + observaciones + '</div> </div> </div>';
    salidaDatos += '<li class="evento">' + innerHTML_POPUP +
        '<div class="positivo" onclick="this.previousElementSibling.style.display = \'inline-block\'">' +
        '<p><i class="fa fa-search" aria-hidden="true"></i></p>' +
        '</div>' +
        '<div><div class="fecha"><div class="fecha_dia">' + fechaInicioEvento.getDate() + '  </div>' +
        '<div class="fecha_mes">' + meses[fechaInicioEvento.getMonth()].substring(0,3).toUpperCase() + '</div> ' +
        '</div> <div class="direccion_titulo_evento"> <div class="direccion_evento">' +
        '<i class="fa fa-map-marker" aria-hidden="true"></i> '+ ciudad_evento(respuestaJSON.items[posBucle]) +'</div> <div class="titulo_evento">' +
        respuestaJSON.items[posBucle].summary.substring(respuestaJSON.items[posBucle].summary.indexOf(']')+1) + '</div> </div> </div> </li>';
}
//Si location es IN-definida devolvemos el [ciudad]
function ciudad_evento(evento) {
    let location = evento.location;
    if(typeof location === "undefined"){
        return evento.summary.substring(evento.summary.indexOf('[')+1, evento.summary.indexOf(']'));
    }
    else if(location.toLowerCase().indexOf('pamplona') !== -1){
        return 'Pamplona';
    }
    else if(location.toLowerCase().indexOf('iruña') !== -1){
        return 'Pamplona';
    }
    else if(location.toLowerCase().indexOf('bilbao') !== -1){
        return 'Bilbao';
    }
    else if(location.toLowerCase().indexOf('bilbo') !== -1){
        return 'Bilbao';
    }
    else if(location.toLowerCase().indexOf('vitoria') !== -1){
        return 'Vitoria';
    }
    else if(location.toLowerCase().indexOf('vitoria-gasteiz') !== -1){
        return 'Vitoria';
    }
    else if(location.toLowerCase().indexOf('san sebastián') !== -1){
        return 'San Sebastián';
    }
    else if(location.toLowerCase().indexOf('donostia') !== -1){
        return 'San Sebastián';
    }
    else{/*En caso de que pongan un pueblo u otra ciudad que no esta contemplada*/
        //return location;
        return evento.summary.substring(evento.summary.indexOf('[')+1, evento.summary.indexOf(']')); /******************    CUAL DE LOS DOS    *****************/
    }
}

function get_email_segun_ciudad(evento) {
    let ciudad = ciudad_evento(evento);
    if(ciudad.toLowerCase().indexOf('pamplona') !== -1){
        return 'centroloyola.pa@sjloyola.org';
    }
    else if(ciudad.toLowerCase().indexOf('iruña') !== -1){
        return 'centroloyola.pa@sjloyola.org';
    }
    else if(ciudad.toLowerCase().indexOf('bilbao') !== -1){
        return 'centroloyola.bi@sjloyola.org';
    }
    else if(ciudad.toLowerCase().indexOf('bilbo') !== -1){
        return 'centroloyola.bi@sjloyola.org';
    }
    else if(ciudad.toLowerCase().indexOf('vitoria') !== -1){
        return 'centroloyola.vg@sjloyola.org';
    }
    else if(ciudad.toLowerCase().indexOf('vitoria-gasteiz') !== -1){
        return 'centroloyola.vg@sjloyola.org';
    }
    else if(ciudad.toLowerCase().indexOf('san sebastián') !== -1){
        return 'centroloyoladonostia7@gmail.com';
    }
    else if(ciudad.toLowerCase().indexOf('donostia') !== -1){
        return 'centroloyoladonostia7@gmail.com';
    }
    else{
        //return 'contacto@centroloyola.org';
        return ' loiolazentroa@loyola.global';              /******************    CUAL DE LOS DOS    *****************/
    }
}
function minutos_dos_digitos(fecha) {
    return (fecha.getMinutes() < 10 ? '0' : '') + fecha.getMinutes();
}
function horas_dos_digitos(fecha) {
    return (fecha.getHours() < 10 ? '0' : '') + fecha.getHours();
}
function sede_ciudad_basado_en_url(){
    let url_sitio = window.location.href;
    if(url_sitio.indexOf('bilbao') !== -1){
        return 'bilbao';
    }
    else if(url_sitio.indexOf('pamplona') !== -1){
        return 'pamplona';
    }
    else if(url_sitio.indexOf('san-sebastian') !== -1){
        return 'san-sebastian';
    }
    else if(url_sitio.indexOf('vitoria') !== -1){
        return 'vitoria';
    }
    else if(url_sitio.indexOf('loyola-azpeitia') !== -1){
        return 'loyola-azpeitia';
    }
    else{
        return 'loyola';
    }
}
function evento_fechas_llamada_insertar(respuestaJSON, pos_item_evento) {
    if(respuestaJSON.items[pos_item_evento].start.dateTime !== undefined){/*Si es de tipo dateTime...*/
        let fechaInicioEvento = new Date(respuestaJSON.items[pos_item_evento].start.dateTime);
        let fechaFinEvento = new Date(respuestaJSON.items[pos_item_evento].end.dateTime);
        insertar_al_DOM(fechaInicioEvento, fechaFinEvento, respuestaJSON, pos_item_evento);
    }
    else if(respuestaJSON.items[pos_item_evento].start.date !== undefined){/*Si es de tipo date...*/
        let fechaInicioEvento = new Date(respuestaJSON.items[pos_item_evento].start.date);
        let fechaFinEvento = new Date(respuestaJSON.items[pos_item_evento].end.date);
        insertar_al_DOM(fechaInicioEvento, fechaFinEvento, respuestaJSON, pos_item_evento);
    }
}