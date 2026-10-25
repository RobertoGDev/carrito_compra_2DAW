# AgoodSoup: carrito de compra

Aplicación web de carrito de compra hecha con HTML, CSS y JavaScript nativo. Carga un catálogo local de productos, permite seleccionar cantidades y muestra el subtotal de cada artículo y el resumen de la compra. No necesita instalar dependencias.

## Puesta en marcha

El catálogo se carga con `fetch`, así que la página debe servirse por HTTP; abrir `index.html` directamente como `file://` no permite cargar el JSON en algunos navegadores.

Desde la carpeta del proyecto, inicia un servidor local:

```sh
python3 -m http.server 8000
```

En Windows puedes usar `py -m http.server 8000`. Después abre <http://localhost:8000>.

## Cómo funciona

1. Al terminar de cargar el documento, `index.js` solicita `assets/api.json` con `fetch`.
2. La clase `Carrito` prepara el catálogo, convierte los precios a números y mantiene la cantidad y el subtotal de cada producto.
3. `index.js` crea una fila de tabla por producto y conecta sus botones `+` y `-`.
4. Al pulsar un botón, `actualizarCantidad` aplica un cambio de una unidad. La cantidad no puede bajar de cero.
5. Se actualizan la cantidad y el subtotal de la fila. `getResumenProductos()` proporciona los productos seleccionados y el total que aparece en el resumen.

El estado del carrito solo vive en memoria: al recargar la página, las cantidades vuelven a cero.

## Organización del código

- `index.html`: estructura de la tabla de productos y del resumen.
- `src/css/style.css`: presentación de la página y de los controles.
- `src/js/index.js`: carga el catálogo, crea las filas y conecta los botones con el carrito.
- `src/js/Carrito.js`: guarda el estado y calcula cantidades, subtotales y totales; no manipula el HTML.
- `src/js/utils.js`: contiene las funciones de interfaz para mostrar el indicador de carga, actualizar cantidades y dibujar el resumen.
- `assets/api.json`: catálogo de ejemplo y moneda.

## Datos del catálogo

El archivo JSON contiene una moneda y una lista `productos`. Cada producto incluye un `SKU` único, un título y un precio:

```json
{
  "currency": "€",
  "productos": [
    { "SKU": "A1", "title": "Producto de ejemplo", "price": "10.25" }
  ]
}
```

## Métodos del carrito

- `getProducto(sku)`: obtiene un producto del catálogo por su SKU.
- `setCantidad(sku, cantidad)`: actualiza la cantidad y el subtotal; la cantidad debe ser un entero no negativo.
- `getResumenProductos()`: devuelve los productos con cantidad positiva, el total y la moneda.
- `getTotal()`: devuelve el total actual del carrito.
