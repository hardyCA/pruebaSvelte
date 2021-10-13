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


export const firebaseLoadMarca = async () => {
    let data = [];
    const querySnapshot = await getDocs(collection(db, "marcas"));
    querySnapshot.forEach((doc) => {
        data.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    return data;
}

export const firebaseAddMarca = async (marca) => {
    try {
        const docRef = await addDoc(collection(db, "marcas"), marca);
        marca.id = docRef.id;
        console.log("Document written with ID: ", docRef.id);
        return marca
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}
export const firebaseModMarca = async (id, nombre) => {
    const washingtonRef = doc(db, "marcas", id);
    await updateDoc(washingtonRef, {
        nombre: nombre,
    });
}