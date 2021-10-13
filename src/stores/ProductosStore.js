import { writable } from 'svelte/store'
import { firebaseLoadProductos, firebaseStockProducto } from '../helpers/helperProducto'



const crearProducto = () => {
    const { subscribe, set, update } = writable([])

    return {
        subscribe,
        loadProductos: async (id) => {
            const data = await firebaseLoadProductos(id)
            set(data)
        },
        agregarProducto: (producto) => {

            update((data) => [...data, producto]);
        },
        eliminarProducto: (id) => {
            update(producto => producto.filter((r) => r.id !== id))
        },
        modificarProducto: (r) => {
            update(producto => producto.map((p) => {
                if (p.id === r.id) {
                    return {
                        ...p,
                        codigo: r.codigo,
                        nombre: r.nombre,
                        descripcion: r.descripcion,
                        precio: r.precio,
                        costo: r.costo,
                        paquete: r.paquete,
                        estado: r.estado,
                    };
                } else {
                    return p;
                }
            }))
        },
        modificarStock: async (id, stock) => {
            await firebaseStockProducto(id, stock)
            update(producto => producto.map((p) => {
                if (p.id === id) {
                    return {
                        ...p,
                        stock: stock,
                    };
                } else {
                    return p;
                }
            }))
        }
    }
}

export const productoStore = crearProducto()