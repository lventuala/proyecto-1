# Proyecto 1:  HTML - CSS - Javascript - DOM

**Fecha de entrega:** 14 de Mayo de 2020 (inclusive).

## **Tema seleccionado : Nro. 2 - Juego Online**

El juego implementado es el conocido “juego de memoria” donde se colocan un numero par de cartas boca abajo y se van seleccionando de a dos cartas. Si las dos cartas seleccionadas tienen la misma imagen, entonces se considera un acierto y se suma un punto a favor del jugador (ambas cartas quedan descubiertas y no se vuelven a usar). Si las cartas son distintas, se suma un punto en contra y se vuelven a dar vuelta para la próxima jugada. 

El juego finaliza cuando todas las cartas son descubiertas.

Cantidad de jugadores: se permiten 1, 2 o 3 jugadores. 

### **1 Jugador**

El objetivo es descubrir todas las cartas en el menor tiempo posible y con la menor cantidad de puntos en contra. El resultado se agrega a un historial de jugadas individuales ordenado por la mejor puntuación. 

### **2 o 3 Jugadores**

Los jugadores compiten entre sí por turnos.
El jugador actual selecciona dos cartas:
* Si son iguales suma un punto a favor y sigue jugando.
* Si son distintas, el jugador suma un punto en contra y pierde el turno pasando a jugar el siguiente jugador.

### **Puntaje Ganador**

Al finalizar la jugada, se calcula el puntaje y se guarda en el historial. 

Los datos que se tienen en cuenta para calcular el puntaje son los puntos a favor, los puntos en contra y el tiempo transcurrido, en ese orden. Es decir que si un jugador tienen mas puntos a favor que otro, automáticamente pasa a ser el ganador. En caso de ser iguales los puntos a favor se tienen en cuenta los puntos en contra (a menor numero en contra, mejor). Si los puntos en contra llegaran a ser iguales se tiene en cuenta el tiempo transcurrido (a menor tiempo, mejor). 

Si solo hay un jugador en la jugada, el resultado final se controla con el historial de jugadas individuales y se ubica en la posición correspondiente de acuerdo a la puntuación obtenida (el historial se ordena de mejor puntuación a peor). 

Si hay mas de un jugador, se ordenan los resultados de mejor a peor y se guarda en el historial de acuerdo a la cantidad de jugadores. Es decir, por ejemplo, que va a existir un historial para las jugadas de 2 jugadores y otro historial para las jugadas de 3 jugadores. 

Tener en cuenta que cada historial, cuando se juega de a 2 o mas jugadores, solo guarda la última jugada. Por el contrario, las jugadas de 1 jugador guarda el histórico de jugadas (solo se re-inicia cuando se borra el historial). 

### **Opciones de juego**

Tamaño del tablero: se podrá seleccionar la cantidad de cartas que se ubicarán en el tablero. Se podrá elegir entre 12 (4x3), 16 (4x4), 20 (5x4), 30 (6x5), 36 (6x6) y 42 (7x6) cartas. 

Intercambiar cartas: si se selecciona esta opción, al seleccionar dos cartas distintas estas se intercambiarán entre si antes de darse vuelta. Esto puede producir confusión y dificultar la jugada, sobre todo en tableros grandes. 

No mostrar cartas al inicio: al seleccionar esta opción, al iniciar una jugada las cartas no van a ser vistas. Es decir que el primer jugador no va a tener ningún tipo de ayuda por donde comenzar. 

### **Historial**

Como se mencionó anteriormente, los resultados van a ser guardados en un historial. 

Dicho historial se va a dividir en distintas jugadas. Es decir que, por ejemplo, el historial de las jugadas de 1 jugador va a ser distinto al historial de las jugadas de 2 jugadores, la de 2 jugadores distinta a la de 3 jugadores, etc.

Ademas, las jugadas en un tablero de 4x3  va a ser distinto a una jugada en un tablero de 4x4, y así con cualquier combinación de jugadas mencionadas en los puntos anteriores. 

Para ver el historial de una jugada particular, se deberá seleccionar: 
1. cantidad de cartas en el tablero
2. si se intercambia o no cartas
3. si se muestran cartas al inicio

Seleccionando una combinación de estas tres opciones se va a mostrar el historial para 1, 2 o 3 jugadores. 

### **Estilos de Carta**

Actualmente existen 3 estilos distintos de cartas (solo varía en las imágenes de las cartas, no afecta al juego en si). Es solo una opción decorativa y no se tiene en cuenta en el historial. 


### **Información de documentación y recursos usados en la implementación**

#### Información general de css y javascript: 

* [W3 Schools](https://www.w3schools.com/)
por ejemplo para el efecto de la carta:  https://www.w3schools.com/howto/howto_css_flip_card.asp

* [MDN Web docs](https://developer.mozilla.org/es/)

* [Bootstrap 4](https://getbootstrap.com/docs/4.0/getting-started/introduction/)

Imágenes descargadas desde: https://www.pngocean.com/ 

