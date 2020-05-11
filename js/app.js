/************************************************
 * Definicion de carta */
//= function(id,dir,estado)
class Carta {
    constructor(id,dir,estado) {
        this.id = id; 
        this.dir = dir; 
        this.estado = estado; 
    }

    getId() {
	   return this.id;
    }

    setId(id) {
	   this.id = id; 
    }

    getDir() {
	   return this.dir; 
    }

    setDir(dir) {
	   this.dir = dir; 
    }

    getEstado() {
	   return this.estado; 
    }

    setEstado(estado) {
	   this.estado = estado; 
    }
}


 /************************************************
 * Definicion de jugador */
class Jugador {
	constructor(numero,id,nombre,border) {
		this.numero = numero; 
		this.id = id; 
		this.nombre = nombre; 
		this.border = border; 
		this.puntos_favor = 0; 
		this.puntos_contra = 0;
		this.tiempo_juego = {'hr':0, 'min':0, 'seg':0, 'mili': 0};
		this.activo = false;

		this.tiempo = null; 
	}

	getNumero() {
		return this.numero; 
	}

	getId() {
		return this.id; 
	}

	getNombre() {
		return this.nombre; 
	}

	setNombre (nombre) {
		this.nombre = nombre; 
	}

	getBorder() {
		return this.border; 
	}

	sumarPuntoFavor() {
		this.puntos_favor++; 
	}

	getPuntosFavor() {
		return this.puntos_favor; 
	}

	sumarPuntoContra() {
		this.puntos_contra++; 
	}

	getPuntosContra() {
		return this.puntos_contra; 
	}

	getTiempoJuego() {
		return this.tiempo_juego; 
	}

	resetTiempoJuego() {
		this.tiempo_juego = {'hr':0, 'min':0, 'seg':0, 'mili': 0};
	}

	isActivo() {
		return this.activo;
	}

	setActivo (activo) {
		this.activo = activo; 
	}

	iniciarTiempo() {
		var jugador = this; 
		this.tiempo = setInterval(function() {
			jugador.getTiempoJuego().mili += 10; 
			if (jugador.getTiempoJuego().mili == 1000) {
				jugador.getTiempoJuego().mili = 0; 
				jugador.getTiempoJuego().seg++; 
			}

			if (jugador.getTiempoJuego().seg == 60) {
				jugador.getTiempoJuego().seg = 0; 
				jugador.getTiempoJuego().min++; 
			}

			if (jugador.getTiempoJuego().min == 60) {
				jugador.getTiempoJuego().min = 0; 
				jugador.getTiempoJuego().hr++; 
			}

			var html = 'Tiempo : <span>'; 
			html += (jugador.getTiempoJuego().hr > 9?'':'0')+jugador.getTiempoJuego().hr + ':'
			html += (jugador.getTiempoJuego().min > 9?'':'0') + jugador.getTiempoJuego().min + ':'; 
			html += (jugador.getTiempoJuego().seg > 9?'':'0') + jugador.getTiempoJuego().seg + '.';
			html += (jugador.getTiempoJuego().mili <= 9?'00': (jugador.getTiempoJuego().mili <= 99?'0':'') ) + jugador.getTiempoJuego().mili;
			html += '</span>';
			$('#id_tiempo_juego_'+jugador.getNumero()).html(html);
		}, 10);
	}

	pararTiempo() {
		clearInterval(this.tiempo);
	}

	reset() {
		this.puntos_favor = 0; 
		this.puntos_contra = 0;
		this.tiempo_juego = {'hr':0, 'min':0, 'seg':0, 'mili': 0};
		this.activo = false;

		clearInterval(this.tiempo);

		this.tiempo = null; 
	}
}
/************************************************/

var cartas = new Map(); // todas las cartas que componen la jugada
var imagenes = []; // todas las imagenes disponibles para cargar en las cartas
var carta_1 = null; 
var carta_2 = null; 
var mostrar_segunda_carta = true; 
var filas = 0;
var columnas = 0; 
var cant_cartas_pendientes = 0; 
var no_mostrar_cartas_iniciales = false; 
var intercambiar_cartas = false; 

// la cantidad de colores determina la cantidad maxima de jugadores
var jugadores = new Map();
var color_jugadores = ['orange', 'blue', 'green']; 
var id_jugador_activo = null; 

// variable para determinar si el juego se inicio 
var juego_iniciado = false; 

// grupo de imagens (agregando aca la info de una nueva carpeta -> recupera las imagenes)
var grupo_imagenes = new Map(); 
grupo_imagenes.set('id_los_simpson',{'id':'id_los_simpson', 'descripcion':'Los Simpson', 'dir':'./images/los_simpson/', 'max_img': 40})
grupo_imagenes.set('id_marvel',{'id':'id_marvel', 'descripcion':'Marvel', 'dir':'./images/marvel/', 'max_img': 43})
grupo_imagenes.set('id_animales',{'id':'id_animales', 'descripcion':'Animales', 'dir':'./images/animales/', 'max_img': 44})

// cargo cantidad de jugadores de acuerdo a la cantidad de colores
for(var j = 1; j<=color_jugadores.length; j++) {
	$('#id_select_jugadores').append('<option value="'+j+'">'+j+' '+(j==1?'jugador':'jugadores')+'</option>'); 
}

// cargo grupos de imagenes 
grupo_imagenes.forEach( gi => {
	$('#id_grupo_imagenes').append('<option value="'+gi.id+'">'+gi.descripcion+'</option>'); 
} ); 


selectJugadores(); 
selectImagenes();

/**
 * Carga las imagenes de acuerdo al grupo seleccionado por el usuario y 
 * setea la dificultad. 
 */
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
	cant_cartas_pendientes = filas*columnas; // reinicio jugadas

	var cant = jugadores.size
	for(var j = 1; j<=cant; j++) {
		var jugador = jugadores.get('id_jugador_'+j); 
		jugador.reset();

		$('#id_puntos_favor_'+j).html('Puntos a favor : 00'); 
		$('#id_puntos_contra_'+j).html('Puntos en contra : 00'); 
		$('#id_tiempo_juego_'+j).html('Tiempo : 00:00:00.000');
	}
}

function selectJugadores() {
	jugadores = new Map();
	$('#id_jugador_name').empty();
	$('#id_bloque_jugadores').empty();

	var cant = $('#id_select_jugadores').val(); 

	for(var j = 1; j<=cant; j++) {
		var id = 'id_jugador_'+j;

		var border = '4px solid '+color_jugadores[j-1];
		jugadores.set(id, new Jugador(j,id,'',border)); 

		$('#id_jugador_name').append('<div id="'+id+'_nombre"></div>'); 
		
		var html = '';
		html += '<div>';
		html += '<div class="form-group">';
		html += '<input type="text" class="form-control font-info" id="id_nombre_'+j+'" placeholder="Nombre Jugador '+j+'">';
		html += '</div>';
		html += '</div>';
		$('#'+id+'_nombre').append(html);

		$('#id_bloque_jugadores').append('<div id="'+id+'" class="bloque-jugador col-12"></div>'); 
		
		var html = '';
		html += '<div>';
		html += '<div class="form-group">';
		html += '<span class="form-control font-info" id="id_block_nombre_'+j+'"></span>';
		html += '</div>';
		html += '<div class="form-group">';
		html += '<span class="form-control font-info" id="id_puntos_favor_'+j+'">Puntos a favor : 00</span>';
		html += '</div>';
		html += '<div class="form-group">';
		html += '<span class="form-control font-info" id="id_puntos_contra_'+j+'">Puntos en contra : 00</span>';
		html += '</div>';
		html += '<div class="form-group">';
		html += '<span class="form-control font-info" id="id_tiempo_juego_'+j+'">Tiempo : 00:00:00.000</span>';
		html += '</div>';
		html += '</div>';
		$('#'+id).html(html);

		$('#'+id).css('border',border);
	}
}

/**
 * Setea el primer jugador o el siguiente si ya hay un jugador activo. 
 */
function setJugadorActivo() {
	if (id_jugador_activo == null) {
		id_jugador_activo = 'id_jugador_1';
	} else {
		jugadores.get(id_jugador_activo).pararTiempo(); 

		var id = jugadores.get(id_jugador_activo).getNumero();
		if (id >= jugadores.size) {
			id = 1; 
		} else {
			id++; 
		}

		id_jugador_activo = 'id_jugador_'+id; 
	}

	// informo jugador activo
	var jugador = jugadores.get(id_jugador_activo); 
	$('#id_turno').html('Turno Actual : <span>'+jugador.getNombre()+'</span>');
	jugador.setActivo(true);
	jugador.iniciarTiempo(); 
}

/**
 * 
 */
function mostrarJuego() {
	// controlo y configuro nombre de los jugdores
	var cant = $('#id_select_jugadores').val(); 
	for(var j = 1; j<=cant; j++) {
		var nombre = $('#id_nombre_'+j).val();
		if ( nombre === '' ) {
			alert('Ingrese el nombre del jugador '+j);
			return; 
		}

		jugadores.get('id_jugador_'+j).setNombre(nombre); 

		$('#id_block_nombre_'+j).html(nombre); 
		$('#id_block_nombre_'+j).css('text-decoration','underline'); 
		$('#id_block_nombre_'+j).css('font-size','1.6em'); 
	}

	// oculto panel de iniciar jugada y muestro juego
	$('#block-inicio').css('display','none');
	$('#block-juego').css('display','block');

	// habilito botones
	$('#id_btn_iniciar').prop('disabled', false);
	$('#id_btn_configurar').prop('disabled', false);

	cargarCartas(); 
}

/**
 * Inicia una jugada -> ya estan cargadas las cargas y los jugadores
 */
function iniciarJuego() {
	if (juego_iniciado) {
		reset(); 
		cargarCartas(); 
	}

	// mostrar cartas iniciales
	this.no_mostrar_cartas_iniciales = $('#id_no_mostrar_cartas').is(':checked'); 
	this.intercambiar_cartas = $('#id_intercambiar_cartas').is(':checked');

	$('#id_turno').html('');

	$('#id_btn_iniciar').prop('disabled', true);
	$('#id_btn_configurar').prop('disabled', true);
	$('#id_btn_iniciar').html('Re-iniciar'); 
	$('.flip-card .flip-card-inner').css('transform', 'rotateY(180deg)');

	// set tiempo juego
	setTimeout(function() {
		$('.flip-card .flip-card-inner').css('transform', 'rotateY(360deg)');
		$('.flip-card .flip-card-inner').css('transform', '');

		var seg = 5; 
		var tiempoInicial = setInterval(function() {
			seg--;
			if (seg == 0) { 
				$('#id_inicio').html(''); 
				clearInterval(tiempoInicial);
				juego_iniciado = true;

				// activo jugador 1
				setJugadorActivo(); 
	
				$('#id_btn_configurar').prop('disabled', false);
				
			} else {
				$('#id_inicio').html('Inicia en 0'+seg); 
			}
		}, 1000);

		
	}, 
	(no_mostrar_cartas_iniciales?0:3000) );
}

/**
 * Funcion que se llama cuando finaliza la jugada (se seleccionan las ultimas dos cargas iguales)
 */
function finalizaJuego() {
	// freno tiempo del jugador actual
	jugadores.get(id_jugador_activo).pararTiempo(); 
	$('#id_btn_iniciar').prop('disabled', false);
	$('#id_btn_configurar').prop('disabled', false);
	id_jugador_activo = null; 
}

/**
 * Muestra interface para configurar el juego - sale de la jugada actual
 */
function configurar() {
	reset(); 
	if (juego_iniciado && id_jugador_activo != null) {
		jugadores.get(id_jugador_activo).pararTiempo(); 
	}

	juego_iniciado = false; 

	selectJugadores(); 
	selectImagenes();
	id_jugador_activo = null; 	

	$('#id_btn_iniciar').html('Iniciar'); 

	$('#block-inicio').css('display','block');
	$('#block-juego').css('display','none');

	$('#id_turno').html('');
}

/**
 * Si carta_1 y carta_2 son null -> la jugada fue perdida
 * Sino, sumo punto para jugador activo y pinto las cartas
 * del color correspondiente 
 */
function actualizarJugada(carta_1,carta_2) {
	if (id_jugador_activo != null) {
		if (carta_1 == null || carta_2 == null) {
			// selecciono proxumo jugador
			jugadores.get(id_jugador_activo).sumarPuntoContra();
			var puntos = jugadores.get(id_jugador_activo).getPuntosContra(); 
			var html = 'Puntos en contra : '+(puntos > 9?'':'0')+puntos; 
			$('#id_puntos_contra_'+jugadores.get(id_jugador_activo).getNumero()).html(html);

			setJugadorActivo(); 
		} else {
			// sumo punto al jugador y sigue jugando
			jugadores.get(id_jugador_activo).sumarPuntoFavor();
			$('#'+carta_1.getId()).css('border',jugadores.get(id_jugador_activo).getBorder());
			$('#'+carta_2.getId()).css('border',jugadores.get(id_jugador_activo).getBorder());

			var puntos = jugadores.get(id_jugador_activo).getPuntosFavor(); 
			var html = 'Puntos a favor : '+(puntos > 9?'':'0')+puntos; 
			$('#id_puntos_favor_'+jugadores.get(id_jugador_activo).getNumero()).html(html);
		}
	}
}

/**
 * Modifica la cantidad de cartas con la que se va a jugar
 */
function selectDificultad() {
	var dificultad = $('#id_dificultad').val(); 

	var nxm = dificultad.split('x');
	filas = nxm[0];
	columnas = nxm[1];

	cant_cartas_pendientes = filas*columnas; 
}

/**
 * Carga las cartas en el tablero de filasXcolumnas
 */
function cargarCartas() {
	
	$('#id_tablero').empty(); 

	var width_card = 100 / filas; 
	var height_card = 100 / columnas; 

	var html = '';
	for(var c = 0; c<columnas; c++) {
		html += '<div id="id-fila+'+c+'" class="fila">'; 

		for(var f = 0; f<filas; f++) {
			var id = 'id_c'+f+c; 

			html += '<div id="id-columna-"'+f+' class="columna">'; 

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
		$('#'+c.getId()).click(function() {
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
							$('#'+carta_1.getId()).css('transform', 'rotateY(360deg)');
							$('#'+carta_2.getId()).css('transform', 'rotateY(360deg)');

							setTimeout(function() {
								if (intercambiar_cartas) {
									var dir_aux = carta_1.getDir(); 
									carta_1.setDir(carta_2.getDir()); 
									carta_2.setDir(dir_aux); 

									$('#'+carta_1.getId()+' .flip-card-front').css('background-image', 'url("'+carta_1.getDir()+'")');
									$('#'+carta_2.getId()+' .flip-card-front').css('background-image', 'url("'+carta_2.getDir()+'")');
								}

								$('#'+carta_1.getId()).css('transform', 'rotateY(180deg)');
								$('#'+carta_2.getId()).css('transform', 'rotateY(180deg)');

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
								}, (intercambiar_cartas?500:0), 
								carta_1, carta_2);
							},(intercambiar_cartas?500:0), 
							carta_1,carta_2);
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
						finalizaJuego();
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

