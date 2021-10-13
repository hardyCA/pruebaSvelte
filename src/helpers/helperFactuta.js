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




// export const firebaseLoadFactura = async (id) => {
//     let data = [];
//     const q = query(
//         collection(db, "clientes"),
//         where("ci", "==", id)
//     );

//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//         data.push({
//             id: doc.id,
//             ...doc.data(),
//         });
//     });
//     return data;
// }