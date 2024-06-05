const fecha = document.querySelector('#fecha');
const lista = document.querySelector('#lista');
const input = document.querySelector('#input');
const botonEnter = document.querySelector('#boton-enter');
const check = 'fa-check-circle';
const uncheck = 'fa-circle';
const lineThrough = 'line-through';
let LIST;
let id;

// Obtener referencia al modal y sus elementos
const modal = document.getElementById('modal-container'); // Cambiado de 'modal-container' a 'modal'
const modalContent = document.querySelector('.modal-content');
const closeBtn = document.querySelector('.close');
const productoInput = document.getElementById('productoInput');
const cantidadInput = document.getElementById('cantidadInput');
const lugarInput = document.getElementById('lugarInput');
const agregarCompraBtn = document.getElementById('agregarCompra');

// Función para abrir el modal
function abrirModal() {
    modal.style.display = 'block';
}

// Función para cerrar el modal
function cerrarModal() {
    modal.style.display = 'none';
}

// Asignar eventos a los botones del modal
botonEnter.addEventListener('click', abrirModal);
closeBtn.addEventListener('click', cerrarModal);

// Función para agregar la compra a la lista
function agregarCompra(producto, cantidad, lugar) {
    agregarTarea(producto + ' - ' + cantidad + ' - ' + lugar, id, false, false);
    LIST.push({
        nombre: producto,
        cantidad: cantidad,
        lugar: lugar,
        id: id,
        realizado: false,
        eliminado: false
    });
    localStorage.setItem('TODO', JSON.stringify(LIST));
    id++;
}

// Asignar evento al botón 'Agregar Compra' en el modal
agregarCompraBtn.addEventListener('click', function() {
    const producto = productoInput.value;
    const cantidad = cantidadInput.value;
    const lugar = lugarInput.value;
    if (producto.trim() && cantidad.trim() && lugar.trim()) {
        agregarCompra(producto, cantidad, lugar);
        cerrarModal();
        productoInput.value = '';
        cantidadInput.value = '';
        lugarInput.value = '';
    }
});

// Función para agregar tarea
function agregarTarea(tarea, id, realizado, eliminado) {
    if (eliminado) {
        return; // si existe eliminado es true si no es false 
    }

    const REALIZADO = realizado ? check : uncheck; // si realizado es verdadero check si no uncheck
    const LINE = realizado ? lineThrough : '';

    const elemento = `
        <li id="elemento">
            <i class="far ${REALIZADO}" data="realizado" id="${id}"></i>
            <p class="text ${LINE}">${tarea}</p>
            <i class="fas fa-trash de" data="eliminado" id="${id}"></i> 
        </li>
    `;
    lista.insertAdjacentHTML("beforeend", elemento);
}


// Función para marcar una tarea como realizada o no realizada
function tareaRealizada(element) {
    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    element.parentNode.querySelector('.text').classList.toggle(lineThrough);
    LIST[element.id].realizado = !LIST[element.id].realizado; // Cambiar el estado de realizado
}

// Función para eliminar una tarea
function tareaEliminada(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].eliminado = true;
}

// Crear un evento para escuchar el enter y para habilitar el botón 
botonEnter.addEventListener('click', () => {
    const tarea = input.value;
    if (tarea) {
        agregarTarea(tarea, id, false, false);
        LIST.push({
            nombre: tarea,
            id: id,
            realizado: false,
            eliminado: false
        });
        localStorage.setItem('TODO', JSON.stringify(LIST));
        id++;
        input.value = '';
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key == 'Enter') {
        const tarea = input.value;
        if (tarea) {
            agregarTarea(tarea, id, false, false);
            LIST.push({
                nombre: tarea,
                id: id,
                realizado: false,
                eliminado: false
            });
            localStorage.setItem('TODO', JSON.stringify(LIST));
            id++;
            input.value = '';
        }
    }
});

// Escuchar eventos de clic en la lista
lista.addEventListener('click', function(event) {
    const element = event.target;
    const elementData = element.getAttribute('data');
    
    if (elementData == 'realizado') {
        tareaRealizada(element);
    } else if (elementData == 'eliminado') {
        tareaEliminada(element);
    }
    localStorage.setItem('TODO', JSON.stringify(LIST));
});

// Cargar lista desde localStorage al cargar la página
let data = localStorage.getItem('TODO');
if (data) {
    LIST = JSON.parse(data);
    id = LIST.length;
    cargarLista(LIST);
} else {
    LIST = [];
    id = 0;
}

// Función para cargar la lista de tareas
function cargarLista(array) {
    array.forEach(function(item) {
        agregarTarea(item.nombre, item.id, item.realizado, item.eliminado);
    });
}

// Mostrar la fecha actual
const fechaActual = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
fecha.innerHTML = fechaActual.toLocaleDateString('es-ES', options);