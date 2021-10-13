import { async } from "@firebase/util";
import {
    addDoc,
    collection,
    getDocs,
    query,
    where,
    doc,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";
import db from "../firebase";


export const firebaseLoadProductos = async (id) => {
    let data = [];
    const q = query(
        collection(db, "productos"),
        where("modelo", "==", id)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        data.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    return data;
}

export const firebaseAddProducto = async (producto) => {
    try {
        const docRef = await addDoc(collection(db, "productos"), producto);
        producto.id = docRef.id;
        return producto
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const firebaseStockProducto = async (id, stock) => {
    const washingtonRef = doc(db, "productos", id);
    await updateDoc(washingtonRef, {
        stock: stock,
    });
}