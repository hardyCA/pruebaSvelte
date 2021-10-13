import { writable } from 'svelte/store'

const createProducto = () => {
    const { subscribe, set } = writable([])

    return {
        subscribe,
        setUser: (dataReport) => {
            set(dataReport)
        }
    }
}

export const dataReport = createProducto()