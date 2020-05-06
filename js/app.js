/************************************************
 * Definicion de carta */

 var Carta = function(id,dir,estado) {
	this.id = id; 
	this.dir = dir; 
	this.estado = estado; 
 }

 Carta.prototype.getId = function() {
	 return this.id;
 }

 Carta.prototype.setId = function(id) {
	 this.id = id; 
 }

 Carta.prototype.getDir = function() {
	 return this.dir; 
 }

 Carta.prototype.setDir = function(dir) {
	 this.dir = dir; 
 }

 Carta.prototype.getEstado = function() {
	 return this.estado; 
 }

 Carta.prototype.setEstado = function(estado) {
	 this.estado = estado; 
 }


 /************************************************
 * Definicion de jugador */
var Jugador = function(id,name,puntos,border) {
	this.id = id; 
	this.name = name; 
	this.puntos = puntos; 
	this.border = border; 
}

Jugador.prototype.getId = function() {
	return this.id; 
}

Jugador.prototype.sumarPunto = function() {
	this.puntos++; 
}

Jugador.prototype.getBorder = function() {
	return this.border; 
}

/************************************************/

var cartas = new Map(); // todas las cartas que componen la jugada
var imagenes = []; // todas las imagenes disponibles para cargar en las cartas
var carta_1 = null; 
var carta_2 = null; 
var mostrar_segunda_carta = true; 
var cant_cartas_pendientes = 0; 

// la cantidad de colores determina la cantidad maxima de jugadores
var jugadores = new Map();
var color_jugadores = ['orange', 'blue', 'green']; 
var id_jugador_activo = null; 

// variable para determinar si el juego se inicio 
var juego_iniciado = false; 

// grupo de imagens
var grupo_imagenes = new Map(); 
grupo_imagenes.set('id_los_simpson',{'id':'id_los_simpson', 'descripcion':'Los Simpson', 'dir':'./images/los_simpson/', 'max_img': 40})
grupo_imagenes.set('id_marvel',{'id':'id_marvel', 'descripcion':'Marvel', 'dir':'./images/marvel/', 'max_img': 43})

// cargo cantidad de jugadores de acuerdo a la cantidad de colores
for(var j = 1; j<=color_jugadores.length; j++) {
	$('#id_select_jugadores').append('<option value="'+j+'">'+j+' '+(j==1?'jugador':'jugadores')+'</option>'); 
}

// cargo grupos de imagenes 
grupo_imagenes.forEach( gi => {
	$('#id_grupo_imagenes').append('<option value="'+gi.id+'">'+gi.descripcion+'</option>'); 
} ); 

reset();

function selectImagenes() {
	var id = $('#id_grupo_imagenes').val();
	
	// cargo imagenes 
	var max_img = grupo_imagenes.get(id).max_img;
	imagenes = [];
	for(var i = 1; i<=max_img; i++) {
		imagenes.push({
			dir: grupo_imagenes.get(id).dir+'/img'+i+'.png'
		});
	}	

	selectDificultad(); 
}

function reset() {
	$('#id_btn_iniciar').click(iniciarJuego); 

	selectJugadores(); 

	selectImagenes(); 
}

function selectJugadores() {
	$('#id_bloque_jugadores').empty();
	var cant = $('#id_select_jugadores').val(); 

	for(var j = 0; j<cant; j++) {
		var id = 'id_jugador_'+j;

		var border = '4px solid '+color_jugadores[j];
		jugadores.set(id, new Jugador(id,'',0,border)); 

		$('#id_bloque_jugadores').append('<div id="'+id+'" class="bloque-jugador col-12"></div>'); 
		$('#'+id).css('border',border);
	}
}

function setJugadorActivo() {
	if (id_jugador_activo == null) {
		id_jugador_activo = 'id_jugador_0';
	} else {
		var str_id = id_jugador_activo.split('_');
		var id = str_id[2];
		if (id >= jugadores.size-1) {
			id = 0; 
		} else {
			id++; 
		}

		id_jugador_activo = 'id_jugador_'+id; 
	}
}

function iniciarJuego() {
	if (!juego_iniciado) {
		$('#id_btn_iniciar').prop('disabled', true);
		$('.flip-card .flip-card-inner').css('transform', 'rotateY(180deg)');
		
		// activo jugador 1
		setJugadorActivo(); 

		setTimeout(function() {
			$('.flip-card .flip-card-inner').css('transform', 'rotateY(360deg)');
			$('.flip-card .flip-card-inner').css('transform', '');

			juego_iniciado = true;
		}, 
		3000 );
	}
}

function finalizarJuego() {

}

/**
 * Si carta_1 y carta_2 son null -> la jugada fue perdida
 * Sino, sumo punto para jugador activo y pinto las cartas
 * del color correspondiente 
 */
function actualizarJugada(carta_1,carta_2) {
	if (carta_1 == null || carta_2 == null) {
		// selecciono proxumo jugador
		setJugadorActivo(); 
	} else {
		// sumo punto al jugador y sigue jugando
		jugadores.get(id_jugador_activo).sumarPunto();
		$('#'+carta_1.getId()).css('border',jugadores.get(id_jugador_activo).getBorder());
		$('#'+carta_2.getId()).css('border',jugadores.get(id_jugador_activo).getBorder());
	}
}

/**
 * Modifica la cantidad de cartas con la que se va a jugar
 */
function selectDificultad() {
	var dificultad = $('#id_dificultad').val(); 

	var nxm = dificultad.split('x');
	n = nxm[0];
	m = nxm[1];

	cant_cartas_pendientes = n*m; 

	cargarCartas(n,m);
}

/**
 * Carga las cartas en el tablero de nxm
 * @param {*} n : cantidad de filas del tablero
 * @param {*} m : cantidad de columnas del tablero 
 */
function cargarCartas(n,m) {
	$('#id_tablero').empty(); 

	var width_card = 100 / n; 
	var height_card = 100 / m; 

	var html = '';
	for(var f = 0; f<m; f++) {
		html += '<div id="id-fila+'+f+'" class="fila">'; 

		for(var c = 0; c<n; c++) {
			var id = 'id_c'+f+c; 

			html += '<div id="id-columna-"'+c+' class="columna">'; 

			html += '<div class="flip-card">';
			html += '		<div id="'+id+'" class="flip-card-inner">';
			html += '			<div class="card flip-card-front">'; 
			html += '			</div>'; 
			html += '			<div class="card flip-card-back">'; 
			html += '			</div>';
			html += '		</div>'; 

			html += '</div>';

			html += '</div>'

			// agrego carta al arreglo global
			cartas.set(id,new Carta(id,'','back'));
		}

		html += '</div>'
	}

	$('#id_tablero').append(html); 

	// seteo el alto de las filas y el ancho de las columnas
	$('.fila').css('height',height_card+'%'); 
	$('.columna').css('width',width_card+'%'); 
	$('.columna').css('height','100%');

	//for(var i = 0; i<cartas.length; i++) {
	cartas.forEach(c => {
		//$('#'+c.getId()).css('transform', 'rotateY(180deg)');
		$('#'+c.getId()).click(function () {
			seleccionarCarta(this, c);
		});
	});

	initRandomCartas(); 
}

/**
 * Evento al hacer click en una carta
 */
function seleccionarCarta(elem, c) {
	if (juego_iniciado) {
		var carta_seleccionada = cartas.get(elem.id); 
		if (carta_seleccionada.getEstado() === 'back' && (carta_1 === null || carta_2 == null ) ) {
			carta_seleccionada.setEstado('front');
			$('#'+carta_seleccionada.getId()).css('transform', 'rotateY(180deg)');

			if (carta_1 === null) {
				carta_1 = carta_seleccionada; 
			} else if (carta_2 === null) {
				carta_2 = carta_seleccionada; 

				// controlo las dos cartas seleccioandas
				if ( carta_1.getDir() !== carta_2.getDir() ) {
					setTimeout(function() {
						$('#'+carta_1.getId()).css('border', '5px solid red');
						$('#'+carta_2.getId()).css('border', '5px solid red');
						setTimeout(function() {
							$('#'+carta_1.getId()).css('border', 'none');
							$('#'+carta_2.getId()).css('border', 'none');
							$('#'+carta_1.getId()).css('transform', 'rotateY(360deg)');
							$('#'+carta_2.getId()).css('transform', 'rotateY(360deg)');

							carta_1.setEstado('back');
							carta_2.setEstado('back');

							carta_1 = null; 
							carta_2 = null;

							actualizarJugada(carta_1,carta_2);
						},
						(mostrar_segunda_carta?1000:0), // si se eligio la opcion de mostrar segunda carta -> espero unos segundos
						carta_1, carta_2);
					}, 
					500, // si se eligio la opcion de mostrar segunda carta -> espero unos segundos
					carta_1, carta_2, mostrar_segunda_carta);
				} else {
					cant_cartas_pendientes -= 2; 
					actualizarJugada(carta_1,carta_2);

					carta_1 = null; 
					carta_2 = null; 

					if (cant_cartas_pendientes == 0) {
						finalizarJuego();
					}
				}
			}
		}
	}
}

/**
 * Inicializa con imagenes random las cartas. 
 */
function initRandomCartas() {
	var aux_cartas = new Map(cartas);
	var aux_imagenes = [];

	while ( cartas.size > 0 ) {
		// recupero carta 1
		var indice_c1 = Math.floor(Math.random() * cartas.size); 
		var pos = 0; 
		var carta_c1 = null; 
		for (var id_c of cartas.keys()) {
			if (pos == indice_c1) {
				carta_c1 = cartas.get(id_c);
				cartas.delete(id_c);
				break;
			} else {
				pos++;
			}
		}

		// recupero carta 2
		var indice_c2 = Math.floor(Math.random() * cartas.size); 
		var pos = 0; 
		var carta_c2 = null; 
		for (var id_c of cartas.keys()) {
			if (pos == indice_c2) {
				carta_c2 = cartas.get(id_c);
				cartas.delete(id_c);
				break;
			} else {
				pos++;
			}
		}

		// recupero imagen
		var indice_img = Math.floor(Math.random() * imagenes.length); 
		var img = imagenes.splice(indice_img, 1);
		aux_imagenes.push(img[0]);

		// asigno imagen a las cartas
		carta_c1.setDir(img[0].dir); 
		carta_c2.setDir(img[0].dir); 

		// configuro la carta en los div's correspondientes
		$('#'+carta_c1.getId()+' .flip-card-front').css('background-image', 'url("'+carta_c1.getDir()+'")');
		$('#'+carta_c2.getId()+' .flip-card-front').css('background-image', 'url("'+carta_c2.getDir()+'")');
	}

	cartas =  aux_cartas;
	imagenes = imagenes.concat(aux_imagenes);

}

