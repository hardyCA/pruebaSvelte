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

export const firebaseAddModelo = async (modelo) => {
    try {
        const docRef = await addDoc(collection(db, "modelos"), modelo);
        modelo.id = docRef.id;
        console.log("Document Agregado ID: ", docRef.id);
        return modelo

    } catch (e) {
        console.error("Error adding document: ", e);
    }
}
export const firebaseLoadModelo = async (idMarca) => {
    let data = [];
    const q = query(
        collection(db, "modelos"),
        where("idMarca", "==", idMarca)
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