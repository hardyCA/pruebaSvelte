import { writable } from 'svelte/store'
import { firebaseLoadModelo } from '../helpers/helperModelo'


const crearModelo = () => {
    const { subscribe, set, update } = writable([])

    return {
        subscribe,
        loadModelo: async (id) => {
            const data = await firebaseLoadModelo(id)
            set(data)
        },
        agregarModelo: (modelo) => {

            update((data) => [...data, modelo]);
        },
        modificarModelo: (id, nombre) => {
            update(modelos => modelos.map((p) => {
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
        eliminarModelo: (id) => {
            update(modelos => modelos.filter((r) => r.id !== id))
        }
    }
}

export const modeloStore = crearModelo()