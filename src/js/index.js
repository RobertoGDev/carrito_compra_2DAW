import Carrito from './Carrito.js';
import { muestraLoader, updateTablaTotal, redondear, actualizarCantidad } from './utils.js';
const URLAPI = './assets/api.json';

let carrito;
const seccionCarrito = document.getElementById('carrito');
const tablaProductos = document.getElementById('productos');
const listaProductos = document.getElementById('lista-productos');
const amountElement = document.getElementById('total');

const initializeProductos = async () => {
    try {
        const response = await fetch(URLAPI);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const datos = await response.json();
        return datos;
    } catch (error) {
        console.error('Error fetching productos:', error);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    muestraLoader(seccionCarrito, true);

    const datos = await initializeProductos();

    if (!datos || !datos.productos) {
        console.error('No se pudieron cargar los productos.');
        return;
    }

    if (datos) {
        muestraLoader(seccionCarrito, false);
    }

    carrito = new Carrito(datos.productos, datos.currency);

    carrito.productos.forEach((producto) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${producto.title}</td>
            <td id="producto-${producto.SKU}">
                <button class="boton_modificar" id="bajar-${producto.SKU}">-</button>
                <span>${producto.cantidad}</span>
                <button class="boton_modificar" id="subir-${producto.SKU}">+</button>
            </td>
            <td>${producto.price} ${carrito.currency}</td>
            <td id="total-${producto.SKU}">${redondear(producto.price * producto.cantidad, carrito)}</td>
        `;

        tablaProductos.querySelector('tbody').appendChild(row);

        const botonMenos = row.querySelector(`#bajar-${producto.SKU}`);
        const botonMas = row.querySelector(`#subir-${producto.SKU}`);

        botonMas.onclick = () => actualizarCantidad(carrito, listaProductos, producto, 1, amountElement);
        botonMenos.onclick = () => actualizarCantidad(carrito, listaProductos, producto, -1, amountElement);
    });

    updateTablaTotal(carrito, listaProductos, amountElement);
});
