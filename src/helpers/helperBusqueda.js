
import {
    collection,
    query,
    orderBy,
    startAt,
    getDocs,
    endBefore,
    onSnapshot,
} from "firebase/firestore";
import { subscribe } from "svelte/internal";
import db from "../firebase";

export const buscar = async (databusqueda) => {
    let data = []
    const q = query(
        collection(db, "productos"),
        orderBy("codigo"),
        orderBy("nombre"),
        startAt(databusqueda),
        endBefore(databusqueda + "\uf8ff")
    );

    onSnapshot(q, (querySnapshot) => {
        const productos = [];
        querySnapshot.forEach((doc) => {
            productos.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        console.log("DENTRO suscribete", productos);
        data = productos;
    });
    return data
    // me canse...🥱🥱🥱🥱 mas tarde seguire viendo y haber que se puede hacer //
}

