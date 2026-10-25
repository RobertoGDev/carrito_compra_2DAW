export default class Carrito {
    constructor(productos, currency) {
        this.productos = productos;
        this.currency = currency;
        this.productos.forEach((producto) => {
            producto.price = Number(producto.price);
            producto.cantidad = 0;
            producto.subtotal = 0;
        });
        console.log(this.productos);
    }

    getProducto(sku) {
        return this.productos.find((el) => el.SKU === sku);
    }

    getTotal() {
        return this.productos.reduce((acumulador, producto) => acumulador + producto.price * producto.cantidad, 0);
    }

    setCantidad(sku, cantidad) {
        let producto = this.getProducto(sku);
        producto.cantidad = cantidad;
        producto.subtotal = Number(producto.price * cantidad);
        return producto;
    }

    getResumenProductos() {
        let totalProductos = 0;
        const productos = this.productos.filter((producto) => producto.cantidad > 0);
        for (const producto in productos) {
            totalProductos += productos[producto].subtotal;
        }
        return { productos, total: Number(totalProductos.toFixed(2)), currency: this.currency };
    }
}
