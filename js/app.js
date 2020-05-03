


selectDificultad(); 

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
			html += '<div id="id-columna-"'+c+' class="columna">'; 

			html += '<div class="flip-card">';

			html += '		<div id="id_c'+f+c+'" class="flip-card-inner">';
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

	for(var f = 0; f<m; f++) {
		for(var c= 0; c<n; c++) {
			$('#id_c'+f+c).css('transform', 'rotateY(180deg)');
		}
	}
}