var cartas = []; // todas las cartas que componen la jugada
var imagenes = []; // todas las imagenes disponibles para cargar en las cartas

var max_img_ls = 36;
for(var i = 1; i<=max_img_ls; i++) {
	imagenes.push({
		dir: './images/los_simpson/img'+i+'.png'
	});
}

selectDificultad(); 

function initCartas() {
	//var item = cartas[Math.floor(Math.random() * cartas.length)];
	var aux_cartas = [];
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
		carta_c1[0].dir = img[0].dir; 
		carta_c2[0].dir = img[0].dir; 

		// agrego a los arreglos auxiliares para no perder la info
		aux_cartas = aux_cartas.concat(carta_c1); 
		aux_cartas = aux_cartas.concat(carta_c2); 
		aux_imagenes = aux_imagenes.concat(img); 

		// configuro la carta en los div's correspondientes
		$("#"+carta_c1[0].id+" .flip-card-front").css('background-image', 'url("'+carta_c1[0].dir+'")');
		$("#"+carta_c2[0].id+" .flip-card-front").css('background-image', 'url("'+carta_c2[0].dir+'")');
	}

	imagenes = imagenes.concat(aux_imagenes); 

	//$(id+" .flip-card-front").css('background-image', 'url("./images/los_simpson/img1.png")');
}

/**
 * Modifica la cantidad de cartas con la que se va a jugar
 */
function selectDificultad() {

	var dificultad = $("#id_dificultad").val(); 

	var nxm = dificultad.split("x");
	n = nxm[0];
	m = nxm[1];

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
			//html += '				<div>'; 
			//html += '					<img src="images/los_simpson/img1.png">';
			//html += '				</div>'; 
			html += '			</div>'; 
			html += '			<div class="card flip-card-back">'; 
			//html += '				<div>'; 
			//html += '					<img src="images/los_simpson/img2.png">'; 
			//html += '				</div>'; 
			html += '			</div>';
			html += '		</div>'; 

			
			html += '</div>';

			html += '</div>'

			// agrego carta al arreglo global
			cartas.push({
				'id' : id, 
				'estado' : 'back',  // back o front
				'dir': ""
			});
		}

		html += '</div>'
	}

	$('#id-tablero').append(html); 

	$('.fila').css('height',height_card+'%'); 
	$('.fila').css('padding','2px'); 
	$('.columna').css('width',width_card+'%'); 
	$('.columna').css('height','100%'); 
	$('.columna').css('padding','2px'); 
	$('.flip-card').css('height','100%'); 

	for(var i = 0; i<cartas.length; i++){
		c = cartas[i];
		$("#"+c.id).css('transform', 'rotateY(180deg)');
		//$(id+" .flip-card-front").css('background-image', 'url("./images/los_simpson/img1.png")');
		$("#"+c.id).click(function () {
			girarCarta(this);
		});
	}

	initCartas(); 
}

function girarCarta(elem) {
	$("#"+elem.id).css('transform', 'rotateY(360deg)');
}