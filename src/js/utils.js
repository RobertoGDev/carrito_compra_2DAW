const redondear = (num, carrito) => Math.round(num * 100) / 100 + ` ${carrito.currency}`;

const muestraLoader = (seccionCarrito, mostrar) => {
    let loader = document.getElementById('loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loader';
        loader.textContent = 'Obteniendo los datos de su compra, espere por favor...';
        seccionCarrito.appendChild(loader);
    }
    loader.style.display = mostrar ? 'block' : 'none';
};

const updateTablaTotal = (carrito, listaProductos, amountElement) => {
    if (!carrito) return;
    const resumen = carrito.getResumenProductos();
    listaProductos.innerHTML = '';
    resumen.productos.forEach((producto) => {
        const li = document.createElement('li');
        li.textContent = `${producto.title} x ${producto.cantidad}`;
        listaProductos.appendChild(li);
    });
    amountElement.textContent = redondear(resumen.total, carrito);
};

const updateTablaCantidad = (SKU, cantidad, carrito) => {
    const cantidadElemento = document.querySelector(`#producto-${SKU} span`);
    const producto = carrito.getProducto(SKU);
    document.getElementById(`total-${producto.SKU}`).textContent = redondear(producto.price * cantidad, carrito);
    cantidadElemento.textContent = `${cantidad}`;
};

export { redondear, muestraLoader, updateTablaTotal, updateTablaCantidad };