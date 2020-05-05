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

/************************************************/


var cartas = new Map(); // todas las cartas que componen la jugada
var imagenes = []; // todas las imagenes disponibles para cargar en las cartas
var carta_1 = null; 
var carta_2 = null; 
var mostrar_segunda_carta = true; 
var cant_cartas_pendientes = 0; 

var max_img_ls = 36;
for(var i = 1; i<=max_img_ls; i++) {
	imagenes.push({
		dir: './images/los_simpson/img'+i+'.png'
	});
}

selectDificultad(); 

function iniciarJuego() {
	//console.log("iniciar juego");
	$(".flip-card .flip-card-inner").css('transform', 'rotateY(180deg)');
	/*
	cartas.forEach(c => {
		console.log(); 
		$("#"+c.getId()).css('transform', 'rotateY(180deg)');
	});*/

	setTimeout(function() {
		$(".flip-card .flip-card-inner").css('transform', 'rotateY(360deg)');
		$(".flip-card .flip-card-inner").css('transform', '');
	}, 
	3000 // si se eligio la opcion de mostrar segunda carta -> espero unos segundos
	);
}


/**
 * Modifica la cantidad de cartas con la que se va a jugar
 */
function selectDificultad() {
	var dificultad = $("#id_dificultad").val(); 

	var nxm = dificultad.split("x");
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
	$('#id-tablero').empty(); 

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

	$('#id-tablero').append(html); 

	// seteo el alto de las filas y el ancho de las columnas
	$('.fila').css('height',height_card+'%'); 
	$('.fila').css('padding','2px'); 
	$('.columna').css('width',width_card+'%'); 
	$('.columna').css('height','100%'); 
	$('.columna').css('padding','2px'); 
	$('.flip-card').css('height','100%'); 

	//for(var i = 0; i<cartas.length; i++) {
	cartas.forEach(c => {
		//$("#"+c.getId()).css('transform', 'rotateY(180deg)');
		$("#"+c.getId()).click(function () {
			seleccionarCarta(this, c);
		});
	});

	initRandomCartas(); 
}

/**
 * Evento al hacer click en una carta
 */
function seleccionarCarta(elem, c) {
	var carta_seleccionada = cartas.get(elem.id); 
	if (carta_seleccionada.getEstado() === 'back' && (carta_1 === null || carta_2 == null ) ) {
		carta_seleccionada.setEstado('front');
		$("#"+carta_seleccionada.getId()).css('transform', 'rotateY(180deg)');

		if (carta_1 === null) {
			carta_1 = carta_seleccionada; 
		} else if (carta_2 === null) {
			carta_2 = carta_seleccionada; 

			// controlo las dos cartas seleccioandas
			if ( carta_1.getDir() !== carta_2.getDir() ) {
				
					
				setTimeout(function() {
					$("#"+carta_1.getId()).css('border', '5px solid red');
					$("#"+carta_2.getId()).css('border', '5px solid red');
					setTimeout(function() {
						$("#"+carta_1.getId()).css('border', 'none');
						$("#"+carta_2.getId()).css('border', 'none');
						$("#"+carta_1.getId()).css('transform', 'rotateY(360deg)');
						$("#"+carta_2.getId()).css('transform', 'rotateY(360deg)');

						carta_1.setEstado('back');
						carta_2.setEstado('back');

						carta_1 = null; 
						carta_2 = null; 
						},
						(mostrar_segunda_carta?1000:0), // si se eligio la opcion de mostrar segunda carta -> espero unos segundos
						carta_1, carta_2);
				}, 
				500, // si se eligio la opcion de mostrar segunda carta -> espero unos segundos
				carta_1, carta_2, mostrar_segunda_carta);
			} else {
				cant_cartas_pendientes -= 2; 
				carta_1 = null; 
				carta_2 = null; 

				if (cant_cartas_pendientes == 0) {
					console.log("FIN DEL JUEGO!!");
				}
			}
		}
	}
}

function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
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
				console.log("ID_C = ", id_c);
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

		// asigno imagen a las cartas
		carta_c1.setDir(img[0].dir); 
		carta_c2.setDir(img[0].dir); 

		// configuro la carta en los div's correspondientes
		$("#"+carta_c1.getId()+" .flip-card-front").css('background-image', 'url("'+carta_c1.getDir()+'")');
		$("#"+carta_c2.getId()+" .flip-card-front").css('background-image', 'url("'+carta_c2.getDir()+'")');
	}

	cartas =  aux_cartas;

	/*
	//var item = cartas[Math.floor(Math.random() * cartas.length)];
	var aux_cartas = new Map(cartas);
	var aux_imagenes = [];
	while (cartas.length > 0) {
		// recupero carta 1
		var indice_c1 = Math.floor(Math.random() * cartas.length); 
		var carta_c1 = cartas.splice(indice_c1,1); 

		// recupero carta 2
		var indice_c2 = Math.floor(Math.random() * cartas.length); 
		var carta_c2 = cartas.splice(indice_c2,1); 

		// recupero imagen
		var indice_img = Math.floor(Math.random() * imagenes.length); 
		var img = imagenes.splice(indice_img, 1);

		// asigno imagen a las cartas
		carta_c1[0].setDir(img[0].dir); 
		carta_c2[0].setDir(img[0].dir); 

		// agrego a los arreglos auxiliares para no perder la info
		//aux_cartas = aux_cartas.concat(carta_c1); 
		//aux_cartas = aux_cartas.concat(carta_c2); 
		//aux_imagenes = aux_imagenes.concat(img); 

		// configuro la carta en los div's correspondientes
		$("#"+carta_c1[0].getId()+" .flip-card-front").css('background-image', 'url("'+carta_c1[0].dir+'")');
		$("#"+carta_c2[0].getId()+" .flip-card-front").css('background-image', 'url("'+carta_c2[0].dir+'")');
	}

	//imagenes = imagenes.concat(aux_imagenes); 

	console.log(cartas); 
	console.log(aux_cartas); 

	//$(id+" .flip-card-front").css('background-image', 'url("./images/los_simpson/img1.png")');
	*/
}

