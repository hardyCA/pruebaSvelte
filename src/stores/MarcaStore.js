import { writable } from 'svelte/store'


const crearMarcas = () => {
    const { subscribe, set, update } = writable(null)

    return {
        subscribe,
        loadMarca: (marcas) => {
            set(marcas)
        },
        agregarMarca: (marca) => {

            update((data) => [...data, marca]);
        },
        modificarMarca: (id, nombre) => {
            update(marcas => marcas.map((p) => {
                if (p.id === id) {
                    return {
                        ...p,
                        nombre: nombre,
                    };
                } else {
                    return p;
                }
            }))
        },
        eliminarMarca: (id) => {
            update(marcas => marcas.filter((r) => r.id !== id))
        }
    }
}

export const marcasStore = crearMarcas()