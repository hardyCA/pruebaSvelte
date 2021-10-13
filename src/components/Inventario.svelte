<script>
    import {
        addDoc,
        collection,
        getDocs,
        orderBy,
        endBefore,
        onSnapshot,
        startAt,
        query,
        where,
        doc,
        deleteDoc,
        updateDoc,
    } from "firebase/firestore";
    import db from "../firebase";
    import Swal from "sweetalert2";
    import { buscar } from "../helpers/helperBusqueda";
    import { productoStore } from "../stores/ProductosStore";
    import Agregarpaquete from "./Agregarpaquete.svelte";
    //cession
    import { user } from "../stores/User";
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    onMount(() => {
        if (!$user) {
            navigate("/login", { replace: true });
        }
    });
    //end session
    //alertas
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });
    //end alertas
    let datos = [];
    let databusqueda = "";
    const busqueda = () => {
        // let data = await buscar(databusqueda);
        // datos = data;
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
            datos = productos;
        });
    };

    const agregarStock = (r, cantidad) => {
        console.log(r.id);
        Toast.fire({
            icon: "success",
            title: "Agregado con exito",
        });
        productoStore.modificarStock(r.id, r.stock + cantidad * r.paquete);
        console.log("completo");
    };
</script>

<div class="container">
    <h5>Agregar stock</h5>
    <div class="row mt-5">
        <div class="col">
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label"
                    >Bucar producto...</label
                >
                <input
                    type="text"
                    class="form-control"
                    placeholder="Buscar producto"
                    bind:value={databusqueda}
                />
            </div>

            <div class="mb-3">
                <button class="btn btn-primary" on:click={busqueda}
                    >Buscar</button
                >
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <table class="table">
                <thead>
                    <tr class="table-warning">
                        <th scope="col">#</th>
                        <th scope="col">Codigo</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Descripcion</th>
                        <th scope="col">Caja=paquetes</th>
                        <th scope="col">Caja</th>
                        <th scope="col">Stock</th>
                        <th scope="col">Cantidad por cajas</th>
                        <th scope="col">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {#each datos as r, i}
                        <tr>
                            <th scope="row">1</th>
                            <td>{r.codigo}</td>
                            <td>{r.nombre}</td>
                            <td>{r.descripcion}</td>
                            <td>
                                Caja={r.paquete} paquetes
                            </td>
                            <td>{r.stock / r.paquete}</td>

                            <td>{r.stock}</td>
                            <Agregarpaquete {r} {agregarStock} />
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
