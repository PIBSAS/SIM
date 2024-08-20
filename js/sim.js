document.getElementById('crearCircuito').addEventListener('click', function() {
    const numEntradas = parseInt(document.getElementById('numEntradas').value);
    const tipoCompuerta = document.getElementById('compuerta').value;
    const entradasDiv = document.getElementById('entradas');
    entradasDiv.innerHTML = ''; // Limpiar entradas anteriores

    // Crear entradas
    for (let i = 0; i < numEntradas; i++) {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = `entrada${i}`;
        input.className = 'entrada';
        input.addEventListener('change', () => actualizarTablaYSalida(tipoCompuerta, numEntradas));
        entradasDiv.appendChild(input);
        entradasDiv.appendChild(document.createTextNode(` Entrada ${i + 1}`));
    }

    // Crear elemento de salida
    const salidaDiv = document.getElementById('salida');
    salidaDiv.innerHTML = `<div class="led" id="salidaLed"></div>`;
    actualizarTablaYSalida(tipoCompuerta, numEntradas); // Actualizar tabla y salida al crear
	
	// **Dibuja la compuerta en el canvas**
    dibujarCompuerta(tipoCompuerta, 50, 50); // Dibuja en una posición fija
	
});

function actualizarTablaYSalida(tipoCompuerta, numEntradas) {
    const salidaLed = document.getElementById('salidaLed');
    const entradas = [];

    // Obtener valores de entrada
    for (let i = 0; i < numEntradas; i++) {
        const entrada = document.getElementById(`entrada${i}`);
        entradas.push(entrada.checked ? 1 : 0);
    }

    // Calcular salida según el tipo de compuerta
    let salida;
    switch (tipoCompuerta) {
        case 'AND':
            salida = entradas.every(val => val === 1) ? 1 : 0;
            break;
        case 'OR':
            salida = entradas.some(val => val === 1) ? 1 : 0;
            break;
        case 'NOT':
            salida = entradas[0] === 0 ? 1 : 0; // Solo un valor
            break;
        case 'IF':
            salida = entradas[0] === 1 ? 1 : 0; // Salida = 1 si la entrada es 1, de lo contrario 0
            break;
        case 'NAND':
            salida = entradas.every(val => val === 1) ? 0 : 1;
            break;
        case 'NOR':
            salida = entradas.every(val => val === 0) ? 1 : 0;
            break;
        case 'XOR':
            salida = entradas.filter(val => val === 1).length % 2 === 1 ? 1 : 0;
            break;
        case 'XNOR':
            salida = entradas.filter(val => val === 1).length % 2 === 0 ? 1 : 0;
            break;
    }

    // Actualizar visualización de salida
    salidaLed.className = `led ${salida === 1 ? 'on' : 'off'}`;

    // Actualizar tabla de verdad
    actualizarTablaVerdad(tipoCompuerta, entradas, salida);
}

function actualizarTablaVerdad(tipoCompuerta, entradas, salida) {
    const tabla = document.getElementById('tabla-verdad');
    tabla.innerHTML = ''; // Limpiar tabla anterior

    // Crear encabezados
    const encabezado = document.createElement('tr');
    for (let i = 0; i < entradas.length; i++) {
        const th = document.createElement('th');
        th.innerText = `Entrada ${i + 1}`;
        encabezado.appendChild(th);
    }
    const thSalida = document.createElement('th');
    thSalida.innerText = 'Salida';
    encabezado.appendChild(thSalida);
    tabla.appendChild(encabezado);

    // Agregar una fila con los valores actuales
    const fila = document.createElement('tr');
    for (let entrada of entradas) {
        const td = document.createElement('td');
        td.innerText = entrada;
        fila.appendChild(td);
    }
    const tdSalida = document.createElement('td');
    tdSalida.innerText = salida;
    fila.appendChild(tdSalida);
    tabla.appendChild(fila);
}

// Dibujar Compuerta con Canvas
function dibujarCompuerta(tipoCompuerta, x, y) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    switch (tipoCompuerta) {
        case 'AND':
            ctx.beginPath();
            ctx.moveTo(x, y + 20); // Punto izquierdo medio
            ctx.lineTo(x + 40, y); // Punto superior derecho
            ctx.lineTo(x + 40, y + 40); // Punto inferior derecho
            ctx.closePath(); // Cierra el camino
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + 40, y + 20); // Salida
            ctx.lineTo(x + 50, y + 20);
            ctx.stroke();
            break;
        case 'OR':
            ctx.beginPath();
            ctx.moveTo(x, y + 20);
            ctx.bezierCurveTo(x + 30, y, x + 30, y + 40, x, y + 20);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            break;
        case 'NOT':
            ctx.beginPath();
            ctx.moveTo(x, y + 10);
            ctx.lineTo(x + 30, y);
            ctx.lineTo(x + 30, y + 40);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 30, y + 20, 5, 0, Math.PI * 2, true); // Círculo para NOT
            ctx.stroke();
            break;
        case 'IF':
            ctx.beginPath();
            ctx.rect(x, y, 60, 40); // Dibuja un rectángulo
            ctx.stroke();
            ctx.fillStyle = 'lightgray';
            ctx.fill(); // Rellena el rectángulo
            ctx.fillStyle = 'black';
            ctx.fillText('IF', x + 20, y + 25); // Texto en el medio
            break;
        case 'NAND':
            ctx.beginPath();
			ctx.lineTo(x + 40, y + 40);
            ctx.moveTo(x, y + 20);
            ctx.lineTo(x + 40, y);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 40, y + 20, 5, 0, Math.PI * 2, true); // Círculo para NAND
            ctx.stroke();
            break;
        case 'NOR':
            ctx.beginPath();
            ctx.moveTo(x, y + 20);
            ctx.bezierCurveTo(x + 30, y, x + 30, y + 40, x, y + 20);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, y + 20, 5, 0, Math.PI * 2, true); // Círculo para NOR
            ctx.stroke();
            break;
        case 'XOR':
            ctx.beginPath();
            ctx.moveTo(x, y + 20);
            ctx.bezierCurveTo(x + 30, y, x + 30, y + 40, x, y + 20);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, y + 20, 5, 0, Math.PI * 2, true); // Círculo para XOR
            ctx.stroke();
            break;
        case 'XNOR':
            ctx.beginPath();
            ctx.moveTo(x, y + 20);
            ctx.bezierCurveTo(x + 30, y, x + 30, y + 40, x, y + 20);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, y + 20, 5, 0, Math.PI * 2, true); // Círculo para XNOR
            ctx.stroke();
            break;
    }
}