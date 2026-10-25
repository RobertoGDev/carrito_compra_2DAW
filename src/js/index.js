import Carrito from './Carrito.js';
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

const redondear = (num, carrito) => Math.round(num * 100) / 100 + ` ${carrito.currency}`;

const muestraLoader = (mostrar) => {
    let loader = document.getElementById('loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loader';
        loader.textContent = 'Obteniendo los datos de su compra, espere por favor...';
        seccionCarrito.appendChild(loader);
    }
    loader.style.display = mostrar ? 'block' : 'none';
};

const updateTablaTotal = (carrito) => {
    if (!carrito) return;
    listaProductos.innerHTML = '';
    carrito.productos.forEach((producto) => {
        if (producto.cantidad > 0) {
            const li = document.createElement('li');
            li.textContent = `${producto.title} x ${producto.cantidad}`;
            listaProductos.appendChild(li);
        }
    });
    const total = carrito.getTotal();
    amountElement.textContent = redondear(total, carrito);
};

const updateTablaCantidad = (SKU, cantidad, carrito) => {
    const cantidadElemento = document.querySelector(`#producto-${SKU} span`);
    const producto = carrito.getProducto(SKU);
    document.getElementById(`total-${producto.SKU}`).textContent = redondear(producto.price * cantidad, carrito);
    cantidadElemento.textContent = `${cantidad}`;
};

document.addEventListener('DOMContentLoaded', async () => {

    muestraLoader(true);

    const datos = await initializeProductos();

    if (!datos || !datos.productos) {
        console.error('No se pudieron cargar los productos.');
        return;
    }

    if (datos) {
        muestraLoader(false);
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
            <td id="total-${producto.SKU}">${producto.price * producto.cantidad}</td>
        `;

        tablaProductos.querySelector('tbody').appendChild(row);

        const botonMenos = row.querySelector(`#bajar-${producto.SKU}`);
        const botonMas = row.querySelector(`#subir-${producto.SKU}`);

        botonMas.onclick = () => {
            carrito.setCantidad(producto.SKU, producto.cantidad + 1);
            const cantidadActualizada = carrito.productos.find((p) => p.SKU === producto.SKU).cantidad;
            updateTablaCantidad(producto.SKU, cantidadActualizada, carrito);
            updateTablaTotal(carrito);
        };

        botonMenos.onclick = () => {
            carrito.setCantidad(producto.SKU, producto.cantidad > 0 ? producto.cantidad - 1 : 0);
            const cantidadActualizada = carrito.productos.find((p) => p.SKU === producto.SKU).cantidad;
            updateTablaCantidad(producto.SKU, cantidadActualizada, carrito);
            updateTablaTotal(carrito);
        };
    });

    updateTablaTotal(carrito);
});
