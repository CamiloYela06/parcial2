/**
 * Universidad - Facultad de Ingeniería
 * Asignatura: Introducción a la Computación Gráfica
 * * Estudiante: ________________
 * * Tarea: Implementar los algoritmos de rasterización manual.
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Función de apoyo para dibujar un píxel individual
function drawPixel(ctx, x, y, color = "#000000") {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

/*Implementación del algoritmo de Bresenham para líneas.
Soporta todos los octances:
m > 1
m < 0
m < -1 */
function bresenhamLine(x0, y0, x1, y1, color ="#000000") {
    // Desarrollo del estudiante
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);

    let sx = (x0 < x1) ? 1 : -1; // dirección en X
    let sy = (y0 < y1) ? 1 : -1; // dirección en Y
    /*
    Parámetro de decisión (error acumulado).
    Representa qué tan lejos está el pixel actual
    de la línea ideal continua.
    */
    let err = dx - dy;

    while (true) {

        drawPixel(ctx, x0, y0, color);

        // condición de parada
        if (x0 === x1 && y0 === y1) break;
        /*
        Se multiplica por 2 para evitar trabajar con fracciones.
        Permite decidir si el siguiente paso debe ser horizontal,
        vertical o diagonal.
        */
        let e2 = 2 * err;

        // movimiento en X
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }

        // movimiento en Y
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

//Calcula los vértices de un polígono regular.

function getPolygonVertices(centerX, centerY, sides, radius) {
    // Desarrollo del estudiante (Uso de Math.sin/Math.cos y retorno de datos)
    let vertices = [];

    for (let i = 0; i < sides; i++) {
                /*
        Se calcula el ángulo correspondiente a cada vértice
        usando división uniforme del círculo (2π).
        */

        let angle = (2 * Math.PI * i) / sides;

        let x = centerX + radius * Math.cos(angle);
        let y = centerY + radius * Math.sin(angle);

        vertices.push({
            x: Math.round(x),
            y: Math.round(y)
        });
    }

    return vertices;
}

/**
 * Dibuja el polígono conectando los vértices
 */
function drawPolygon(vertices, color = "#000000") {

    for (let i = 0; i < vertices.length; i++) {
        /*
        Se calcula el angulo corespondiente a cada vertice usando division uniforme del circulo (2PI)
        */
        let p1 = vertices[i];
        let p2 = vertices[(i + 1) % vertices.length];

        bresenhamLine(p1.x, p1.y, p2.x, p2.y, color);
    }
}

//Dibujar los 8 puntos simetricos de la circunferencia (8 octantes)
function plotCirclePoints(cx, cy, x, y, color) {

    let points = [
        [cx + x, cy + y], [cx - x, cy + y],
        [cx + x, cy - y], [cx - x, cy - y],
        [cx + y, cy + x], [cx - y, cy + x],
        [cx + y, cy - x], [cx - y, cy - x]
    ];

    points.forEach(p => drawPixel(ctx, p[0], p[1], color));
}

/**
 * Algoritmo de punto medio para circunferencias.
 */
function midpointCircle(cx, cy, r, color = "#000000") {

    let x = 0;
    let y = r;
        /*
    Parámetro de decisión inicial.
    Evalúa si el punto medio está dentro o fuera del círculo.
    */
    let p = 1 - r;

    while (x <= y) {

        plotCirclePoints(cx, cy, x, y, color);

        if (p < 0) {
            p += 2 * x + 3;
        } else {
            p += 2 * (x - y) + 5;
            y--;
        }

        x++;
    }
}


/**
 * FUNCIÓN PRINCIPAL
 */
function main() {

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Número aleatorio entre 5 y 10
    let sides = Math.floor(Math.random() * 6) + 5;

    let cx = canvas.width / 2;
    let cy = canvas.height / 2;

    let R = 150;

    let vertices = getPolygonVertices(cx, cy, sides, R);

    drawPolygon(vertices);

    // Radio de los círculos (R/4)
    let r = Math.floor(R / 4);

    vertices.forEach(v => {
        midpointCircle(v.x, v.y, r);
    });

    // Mostrar info
    document.getElementById("info").innerText =
        "Número de lados: " + sides;
}

// BOTON
function generarNuevo(){
    main();
}


// Ejecutar automáticamente
window.onload = main;

