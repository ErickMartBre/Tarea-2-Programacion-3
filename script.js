const preguntas = [
    {
        pregunta: "¿Cuál es el lenguaje de marcado utilizado para crear páginas web?",
        opciones: ["JavaScript", "HTML", "CSS", "Python"],
        respuesta: "HTML"
    },
    {
        pregunta: "¿Cuál es el símbolo para seleccionar un elemento por clase en CSS?",
        opciones: [".", "#", "*", "&"],
        respuesta: "."
    },
    {
        pregunta: "¿Qué método se utiliza para añadir un elemento al final de un array en JavaScript?",
        opciones: ["push()", "pop()", "shift()", "unshift()"],
        respuesta: "push()"
    },
    {
        pregunta: "¿Qué tipo de extensión de archivo se usa para personalizar una página web?",
        opciones: [".css", ".js", ".html", ".xml"],
        respuesta: ".css"
    },
    {
        pregunta: "¿Cómo puedo adjuntar un archivo de personalización?",
        opciones: ["Etiqueta <meta>", "Etiqueta <link>", "Etiqueta <div>", "Etiqueta <style>"],
        respuesta: "Etiqueta <link>"
    },
    {
        pregunta: "¿Cuál es la etiqueta de mayor tamaño?",
        opciones: ["const", "h2", "p", "title"],
        respuesta: "h2"
    }
];

let preguntasAleatorias = [];

function barajarPreguntas() {
    preguntasAleatorias = preguntas.slice();
    for (let i = preguntasAleatorias.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [preguntasAleatorias[i], preguntasAleatorias[j]] = [preguntasAleatorias[j], preguntasAleatorias[i]];
    }
}

const inicioPantalla = document.getElementById('inicio');
const comenzarBtn = document.getElementById('comenzar-btn');
const preguntasPantalla = document.getElementById('preguntas');
const preguntaTexto = document.getElementById('pregunta-texto');
const opcionesLista = document.getElementById('opciones-lista');
const siguienteBtn = document.getElementById('siguiente-btn');
const resultadosPantalla = document.getElementById('resultados');
const puntajeFinal = document.getElementById('puntaje-final');
const totalPreguntas = document.getElementById('total-preguntas');
const reiniciarBtn = document.getElementById('reiniciar-btn');
const retroalimentacion = document.getElementById('retroalimentacion');
const mensajeFinal = document.getElementById('mensaje-final');

let preguntaActual = 0;
let puntaje = 0;
let opcionSeleccionada = null;

comenzarBtn.addEventListener('click', () => {
    barajarPreguntas();
    inicioPantalla.classList.add('ocultar');
    preguntasPantalla.classList.remove('ocultar');
    mostrarPregunta();
    iniciarTemporizador();
});

const barraProgreso = document.getElementById('barra-progreso');

function actualizarBarraProgreso() {
    const porcentaje = ((preguntaActual) / preguntas.length) * 100;
    barraProgreso.style.width = `${porcentaje}%`;
}

function mostrarPregunta() {
    const pregunta = preguntas[preguntaActual];
    preguntaTexto.textContent = pregunta.pregunta;
    opcionesLista.innerHTML = '';

    pregunta.opciones.forEach(opcion => {
        const li = document.createElement('li');
        li.textContent = opcion;
        li.classList.add('opcion');
        li.addEventListener('click', seleccionarOpcion);
        opcionesLista.appendChild(li);
    });
    actualizarBarraProgreso();
}

function seleccionarOpcion(e) {
    const opciones = document.querySelectorAll('.opcion');
    opciones.forEach(op => op.classList.remove('seleccionado'));
    e.target.classList.add('seleccionado');
    opcionSeleccionada = e.target.textContent;
}

siguienteBtn.addEventListener('click', () => {
    pausarTemporizador();
    verificarRespuesta();
    avanzarPregunta();
});

function verificarRespuesta() {
    const pregunta = preguntas[preguntaActual];
    if (opcionSeleccionada === pregunta.respuesta) {
        puntaje++;
    }
    opcionSeleccionada = null;
}

function avanzarPregunta() {
    preguntaActual++;
    if (preguntaActual < preguntas.length) {
        mostrarPregunta();
    } else {
        mostrarResultados();
    }
}

let tiempoRestante = 30;
let temporizadorInterval;

function iniciarTemporizador() {
    tiempoRestante = 30;
    document.getElementById('tiempo-restante').textContent = tiempoRestante;
    temporizadorInterval = setInterval(() => {
        tiempoRestante--;
        document.getElementById('tiempo-restante').textContent = tiempoRestante;
        if (tiempoRestante <= 0) {
            clearInterval(temporizadorInterval);
            avanzarPregunta();
        }
    }, 1000);
}

function pausarTemporizador() {
    clearInterval(temporizadorInterval);
}

let respuestasUsuario = [];

function verificarRespuesta() {
    const pregunta = preguntas[preguntaActual];
    const esCorrecto = opcionSeleccionada === pregunta.respuesta;
    respuestasUsuario.push({
        pregunta: pregunta.pregunta,
        seleccionada: opcionSeleccionada,
        correcta: pregunta.respuesta,
        esCorrecto: esCorrecto
    });
    if (esCorrecto) {
        puntaje++;
        mostrarRetroalimentacion(true);
    } else {
        mostrarRetroalimentacion(false);
    }
    opcionSeleccionada = null;
}

function mostrarResultados() {
    preguntasPantalla.classList.add('ocultar');
    resultadosPantalla.classList.remove('ocultar');
    puntajeFinal.textContent = puntaje;
    totalPreguntas.textContent = preguntas.length;

    const porcentaje = (puntaje / preguntas.length) * 100;
    if (porcentaje === 100) {
        mensajeFinal.textContent = "¡Excelente! Respondiste todas las preguntas correctamente.";
    } else if (porcentaje >= 70) {
        mensajeFinal.textContent = "¡Muy bien! Tienes un buen conocimiento.";
    } else if (porcentaje >= 40) {
        mensajeFinal.textContent = "Está bien, pero puedes mejorar.";
    } else {
        mensajeFinal.textContent = "Necesitas estudiar más. ¡Inténtalo de nuevo!";
    }

    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    historial.push({
        fecha: new Date().toLocaleString(),
        puntaje: puntaje,
        total: preguntas.length
    });
    localStorage.setItem('historial', JSON.stringify(historial));

    const detalles = respuestasUsuario.filter(res => !res.esCorrecto);
    if (detalles.length > 0) {
        resultadosPantalla.innerHTML += '<h3>Revisa tus respuestas incorrectas:</h3>';
        detalles.forEach(det => {
            resultadosPantalla.innerHTML += `
                <p><strong>Pregunta:</strong> ${det.pregunta}</p>
                <p><strong>Tu respuesta:</strong> ${det.seleccionada}</p>
                <p><strong>Respuesta correcta:</strong> ${det.correcta}</p>
            `;
        });
    }
}

reiniciarBtn.addEventListener('click', reiniciarQuiz);

function reiniciarQuiz() {
    resultadosPantalla.classList.add('ocultar');
    inicioPantalla.classList.remove('ocultar');
    preguntaActual = 0;
    puntaje = 0;
}

function verificarRespuesta() {
    const pregunta = preguntas[preguntaActual];
    if (opcionSeleccionada === pregunta.respuesta) {
        puntaje++;
        mostrarRetroalimentacion(true);
    } else {
        mostrarRetroalimentacion(false);
    }
    opcionSeleccionada = null;
}

function mostrarRetroalimentacion(esCorrecto) {
    retroalimentacion.classList.remove('ocultar');
    if (esCorrecto) {
        retroalimentacion.textContent = "¡Correcto!";
        retroalimentacion.classList.add('correcto');
    } else {
        retroalimentacion.textContent = `Incorrecto. La respuesta correcta era: ${preguntas[preguntaActual].respuesta}`;
        retroalimentacion.classList.add('incorrecto');
    }
    setTimeout(() => {
        retroalimentacion.classList.add('ocultar');
        retroalimentacion.classList.remove('correcto', 'incorrecto');
    }, 2000);
}



