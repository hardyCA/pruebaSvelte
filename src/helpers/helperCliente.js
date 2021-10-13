import { async } from "@firebase/util";
import {
    addDoc,
    collection,
    getDocs,
    query,
    where,
    doc,
    orderBy,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";
import db from "../firebase";



export const firebaseLoadCliente = async (ci) => {
    let data = [];
    const q = query(
        collection(db, "clientes"),
        where("ci", "==", ci)
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

export const firebaseAddCliente = async (cliente) => {
    try {
        const docRef = await addDoc(collection(db, "clientes"), cliente);
        cliente.id = docRef.id;
        console.log("Document Agregado cliente ID: ", docRef.id);
        return cliente

    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const firebaseAddRecibo = async (recibo) => {
    try {
        const docRef = await addDoc(collection(db, "recibo"), recibo);
        recibo.id = docRef.id;
        console.log("Document Agregado recibo ID: ", docRef.id);
        return recibo

    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const firebaseAddCredito = async (credito) => {
    try {
        const docRef = await addDoc(collection(db, "credito"), credito);
        credito.id = docRef.id;
        console.log("Document Agregado credito ID: ", docRef.id);
        return credito

    } catch (e) {
        console.error("Error adding document: ", e);
    }
}


export const firebaseLoadCredito = async (idRecibo) => {
    let data = [];
    const q = query(
        collection(db, "credito"),
        where("idRecibo", "==", idRecibo),
        orderBy("fecha", 'asc'),
        orderBy("hora", 'asc'),

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