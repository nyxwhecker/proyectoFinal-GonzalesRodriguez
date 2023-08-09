//  cargar datos de vehículos desde el archivo JSON local

function cargarDatosVehiculosDesdeJSON() {
    return fetch('datos_vehiculos.json')
        .then((respuesta) => {
            return respuesta.json();
        })
        .catch((err) => {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                showConfirmButton: false,
                timer: 1500
              })
        })
}

const datos = {
    nombre: document.getElementById('nombreUsuario'),
    apellido: document.getElementById('apellidoUsuario'),
    email: document.getElementById('mailUsuario')
};

// Convertir el objeto a JSON y almacenarlo en el Local Storage
const datosJSON = JSON.stringify(datos);
localStorage.setItem("datosUsuario", datosJSON);

// Recuperar los datos del Local Storage y convertirlos de nuevo a un objeto JavaScript
const datosAlmacenadosJSON = localStorage.getItem("datosUsuario");
const datosAlmacenados = JSON.parse(datosAlmacenadosJSON);

function buscarPrecio(tipoVehiculo, edad) {
    return cargarDatosVehiculosDesdeJSON()  // Devuelve la promesa
        .then(vehiculos => {
            let vehiculo = vehiculos.find(v => v.tipo === tipoVehiculo);
            if (vehiculo) {
                let precio = (edad < 15) ? vehiculo.precioMenor15 : vehiculo.precioMayor15;

                return precio;
            } else {
                return 0;
            }
        })
        .catch(error => {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                showConfirmButton: false,
                timer: 1500
              })
            
        });
}


// Variables para el carrito de compras
let carrito = [];
const listaSeguros = document.getElementById('listaSeguros');
const limpiarCarritoButton = document.getElementById('limpiarCarritoButton');

// Función para agregar un seguro al carrito de compras

function agregarAlCarrito(seguro, cuotasSeleccionadas) {
    seguro.cuotas = cuotasSeleccionadas;
    carrito.push(seguro);
    actualizarCarrito();

}


// Función para actualizar el carrito en el HTML

function actualizarCarrito() {
    listaSeguros.innerHTML = '';
    carrito.forEach(seguro => {
        const li = document.createElement('li');
        if (seguro.cuotas > 1) {
            li.textContent = `Tipo de vehículo: ${seguro.tipo}, ${seguro.cuotas} cuotas de $${seguro.precio}`;
        } else {
            li.textContent = `Tipo de vehículo: ${seguro.tipo}, Precio al Contado: $${seguro.precio}`;
        }

        listaSeguros.appendChild(li);
    });
}



// Función para limpiar el carrito de compras
function limpiarCarrito() {
    carrito = [];
    actualizarCarrito();
}

// Función para calcular las cuotas del seguro
function calcularCuotas(precio, cantidadCuotas) {
    let valorCuotas;

    if (cantidadCuotas == 3) {
        valorCuotas = (precio + (precio * 0.05)) / 3;
    } else if (cantidadCuotas == 6) {
        valorCuotas = (precio + precio * 0.05) / 6;
    } else if (cantidadCuotas == 12) {
        valorCuotas = (precio + precio * 0.05) / 12;
    }

    return valorCuotas;
}

// Función para calcular el pago al contado del seguro
function calcularPagoContado(precio) {
    return precio;
}

// Función para validar el formulario antes de calcular el seguro
function validarFormulario() {
    let edad = parseInt(document.getElementById('age').value);
    let tipoVehiculo = document.getElementById('car').value;

    // Validar edad
    if (isNaN(edad) || edad <= 0) {
        document.getElementById('errorAge').innerText = "Por favor, ingresa una edad válida.";
    } else {
        document.getElementById('errorAge').innerText = "";
    }

    if (tipoVehiculo === "") {
        document.getElementById('errorCar').innerText = "Por favor, selecciona un tipo de vehículo.";
    } else {
        document.getElementById('errorCar').innerText = "";
    }

    if (!isNaN(edad) && edad > 0 && tipoVehiculo !== "") {
        calcularSeguro();
    }
}

// Función para calcular el seguro y mostrar el resultado según las cuotas seleccionadas
function calcularSeguro() {

    let edad = parseInt(document.getElementById('age').value);
    let tipoVehiculo = document.getElementById('car').value;
    let cuotasSeleccionadas = parseInt(document.getElementById('cuotasx').value);

    buscarPrecio(tipoVehiculo, edad)
        .then(precio => {
            if (cuotasSeleccionadas == 1) {
                document.getElementById('resultado1').innerText = "";
                document.getElementById('resultado2').innerText = "";
                document.getElementById('resultado3').innerText = "";
                document.getElementById('resultadoContado').innerText = "Pago al contado: $" + calcularPagoContado(precio);

            } else if (cuotasSeleccionadas == 3) {
                document.getElementById('resultado2').innerText = "";
                document.getElementById('resultado3').innerText = "";
                document.getElementById('resultadoContado').innerText = "";
                document.getElementById('resultado1').innerText = cuotasSeleccionadas + " cuotas: $" + calcularCuotas(precio, cuotasSeleccionadas);

            } else if (cuotasSeleccionadas == 6) {
                document.getElementById('resultado1').innerText = "";
                document.getElementById('resultado3').innerText = "";
                document.getElementById('resultadoContado').innerText = "";
                document.getElementById('resultado2').innerText = cuotasSeleccionadas + " cuotas: $" + calcularCuotas(precio, cuotasSeleccionadas);
            } else if (cuotasSeleccionadas == 12) {
                document.getElementById('resultado1').innerText = "";
                document.getElementById('resultado2').innerText = "";
                document.getElementById('resultadoContado').innerText = "";
                document.getElementById('resultado3').innerText = cuotasSeleccionadas + " cuotas: $" + calcularCuotas(precio, cuotasSeleccionadas);
            }

        })
        .catch(error => {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                showConfirmButton: false,
                timer: 1500
              })
        });


}

// Eventos a los elementos del formulario y botones
document.getElementById('calcularButton').addEventListener('click', calcularSeguro);
document.getElementById('convertToDollarsButton').addEventListener('click', calcularSeguroDolares);
document.getElementById('age').addEventListener('input', validarFormulario);
document.getElementById('car').addEventListener('change', validarFormulario);


// seguros al carrito
document.getElementById('añadirCarritoButton').addEventListener('click', function () {
    let tipoVehiculo = document.getElementById('car').value;
    let cuotasSeleccionadas = parseInt(document.getElementById('cuotasx').value);

    let elemento1 = document.getElementById('resultado1').textContent;
    let elemento2 = document.getElementById('resultado2').textContent;
    let elemento3 = document.getElementById('resultado3').textContent;
    let elemento4 = document.getElementById('resultadoContado').textContent;
    let contenidoTexto;
    let numerosEnTexto;

    //verificacion cn if que los divs no esten vacios y luego extraer sus numeros

    if (elemento1.trim() !== '') {
        contenidoTexto = elemento1;
        numerosEnTexto = contenidoTexto.match(/\d+/g);

        if (numerosEnTexto !== null) {
            const valoresNumericos = numerosEnTexto.map(numero => parseInt(numero));
            let precio = valoresNumericos[1]
            let seguro = { tipo: tipoVehiculo, precio: precio }
            agregarAlCarrito(seguro, cuotasSeleccionadas);
        }

    } else if (elemento2.trim() !== '') {
        contenidoTexto = elemento2;
        numerosEnTexto = contenidoTexto.match(/\d+/g);

        if (numerosEnTexto !== null) {
            const valoresNumericos = numerosEnTexto.map(numero => parseInt(numero));
            let precio = valoresNumericos[1];
            let seguro = { tipo: tipoVehiculo, precio: precio }
            agregarAlCarrito(seguro, cuotasSeleccionadas);
        }
        
    } else if (elemento3.trim() !== '') {
        contenidoTexto = elemento3;
        numerosEnTexto = contenidoTexto.match(/\d+/g);

        if (numerosEnTexto !== null) {
            const valoresNumericos = numerosEnTexto.map(numero => parseInt(numero));
            let precio = valoresNumericos[1];
            let seguro = { tipo: tipoVehiculo, precio: precio }
            agregarAlCarrito(seguro, cuotasSeleccionadas);
        }

    } else if (elemento4 !== '') {
        contenidoTexto = elemento4;
        numerosEnTexto = contenidoTexto.match(/\d+/g);

        if (numerosEnTexto !== null) {
            const valoresNumericos = numerosEnTexto.map(numero => parseInt(numero));
            let precio = valoresNumericos[0];
            let seguro = { tipo: tipoVehiculo, precio: precio }
            agregarAlCarrito(seguro, cuotasSeleccionadas);
        }
    }

});

//  limpiar el carrito
limpiarCarritoButton.addEventListener('click', limpiarCarrito);

function compraFinal() {
    let montoTotal = 0;

    for (let i = 0; i < carrito.length; i++) {

        if (carrito[i].cuotas === 1) {
            montoTotal = montoTotal + carrito[i].precio;
        } else if (carrito[i].cuotas === 3) {
            montoTotal = montoTotal + (3 * carrito[i].precio);
        } else if (carrito[i].cuotas === 6) {
            montoTotal = montoTotal + (6 * carrito[i].precio);
        } else {
            montoTotal = montoTotal + (12 * carrito[i].precio);
        }
    }

    return montoTotal;
}

document.getElementById('comprar').addEventListener('click', function () {
    document.getElementById('montoFinal').innerText = "Monto Final = $" + compraFinal();
})

// conversor a dolares 

function calcularSeguroDolares() {
    let compraFinalEnDolares = (compraFinal() / 500)
    document.getElementById('compraEnDolares').innerText = "USD " + compraFinalEnDolares
}

document.getElementById('convertToDollarsButton').addEventListener('click', function () {
    calcularSeguroDolares();
})


