import { writable } from 'svelte/store'


const crearVenta = () => {
    const { subscribe, set, update } = writable(null)

    return {
        subscribe,
        loadVenta: (productos) => {
            set(productos)
        },
        eliminarVenta: (id) => {
            update(productos => productos.filter((r) => r.id !== id))
        }
    }
}

export const productoStore = crearVenta()