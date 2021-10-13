<script>
    import { doc, deleteDoc, updateDoc } from "firebase/firestore";
    import db from "../firebase";
    import Swal from "sweetalert2";
    import { firebaseAddMarca } from "../helpers/helperMarca";
    import {
        firebaseAddModelo,
        firebaseLoadModelo,
    } from "../helpers/helperModelo";
    import { marcasStore } from "../stores/MarcaStore";
    import { modeloStore } from "../stores/ModeloStore";
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
    ///////////////////marca
    let accionMarca = true;
    let marca = { nombre: "", estado: true };
    const addMarca = async () => {
        if (marca.nombre === "") {
            Toast.fire({
                icon: "error",
                title: "Agregar marca",
            });
            return;
        }
        //firebase
        const newMarca = await firebaseAddMarca(marca);
        //store
        await marcasStore.agregarMarca(newMarca);
        //formulario
        marca = { nombre: "", estado: true };
        Toast.fire({
            icon: "success",
            title: "Marca agregado con exito",
        });
    };
    console.log($modeloStore);
    const delMarca = (id) => {
        Toast.fire({
            icon: "success",
            title: "Eliminado con exito",
        });
        //firebase
        deleteDoc(doc(db, "marcas", id));
        //store
        marcasStore.eliminarMarca(id);
    };
    const mostrarMarca = (r) => {
        marca = { id: r.id, nombre: r.nombre, estado: true };
        accionMarca = false;
    };
    const modificarMarca = async () => {
        //firebase
        const washingtonRef = doc(db, "marcas", marca.id);
        await updateDoc(washingtonRef, {
            nombre: marca.nombre,
        });
        //store
        await marcasStore.modificarMarca(marca.id, marca.nombre);
        Toast.fire({
            icon: "success",
            title: "Modificado con exito",
        });
    };
    ////////////////////modelo
    let accionModelo = true;
    let modelo = { nombre: "", estado: true, idMarca: "" };
    const loadModelo = () => {
        modeloStore.loadModelo(modelo.idMarca);
    };
    const addModelo = async () => {
        //validar
        if (modelo.idMarca === "") {
            console.log("Agregar marca");
            Toast.fire({
                icon: "error",
                title: "Seleccionar marca",
            });
            return;
        }
        if (modelo.nombre == "") {
            Toast.fire({
                icon: "error",
                title: "Agregar nombre de modelo",
            });
            return;
        }

        const newModelo = await firebaseAddModelo(modelo);
        await modeloStore.agregarModelo(newModelo);
        modelo = { nombre: "", estado: true };
        Toast.fire({
            icon: "success",
            title: "Modelo agregado con exito",
        });
    };
    const delModelos = async (id) => {
        Toast.fire({
            icon: "success",
            title: "Eliminado con exito",
        });

        await deleteDoc(doc(db, "modelos", id));
        modeloStore.eliminarModelo(id);
    };
    const mostrarModelo = (r) => {
        modelo = { id: r.id, nombre: r.nombre, estado: true };
        accionModelo = false;
    };
    const modificarModelo = async () => {
        Toast.fire({
            icon: "success",
            title: "Modificado con exito",
        });
        const washingtonRef = doc(db, "modelos", modelo.id);
        await updateDoc(washingtonRef, {
            nombre: modelo.nombre,
        });

        modeloStore.modificarModelo(modelo.id, modelo.nombre);
    };
</script>

<div class="container">
    <h5>Marca y Modelo</h5>
    <div class="row">
        <div class="card">
            <div class="card-header bg-warning text-white">Agregar marca</div>
            <div class="card-body">
                <div class="row">
                    <div class="col-4">
                        <div class="mb-3">
                            <label
                                for="exampleFormControlInput1"
                                class="form-label">Marca</label
                            >
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Nombre Marca"
                                bind:value={marca.nombre}
                            />
                        </div>
                        <div class="mb-3">
                            {#if accionMarca}
                                <button
                                    class="btn btn-primary"
                                    on:click={() => addMarca()}
                                    >Registrar</button
                                >
                            {:else}
                                <button
                                    class="btn btn-warning"
                                    on:click={() => modificarMarca()}
                                    >Modificar</button
                                >
                                <button
                                    class="btn btn-success"
                                    on:click={() => {
                                        accionMarca = true;
                                        marca = { nombre: "", estado: true };
                                    }}>+ Nuevo</button
                                >
                            {/if}
                        </div>
                    </div>
                    <div class="col">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Marca</th>
                                    <th scope="col">estado</th>
                                    <th scope="col">accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each $marcasStore as r, i}
                                    <tr>
                                        <th scope="row">{i + 1}</th>
                                        <td>{r.nombre}</td>
                                        <td
                                            >{r.estado
                                                ? "Activo"
                                                : "No activo"}</td
                                        >
                                        <td>
                                            <button
                                                class="btn btn-warning btn-sm"
                                                on:click={() => mostrarMarca(r)}
                                                >Modificar</button
                                            >
                                            <button
                                                class="btn btn-danger btn-sm"
                                                on:click={() => delMarca(r.id)}
                                                >Eliminar</button
                                            >
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row mt-4">
        <div class="card">
            <div class="card-header bg-warning text-white">Agregar Modelo</div>
            <div class="card-body">
                <div class="row">
                    <div class="col-4">
                        <div class="mb-3">
                            {#if accionModelo}
                                <label
                                    for="exampleFormControlInput1"
                                    class="form-label">Marca</label
                                >
                                <select
                                    class="form-select"
                                    aria-label="Default select example"
                                    bind:value={modelo.idMarca}
                                    on:change={loadModelo}
                                >
                                    <option selected>Seleccionar Marca</option>
                                    {#each $marcasStore as r}
                                        <option value={r.id}>{r.nombre}</option>
                                    {/each}
                                </select>
                            {/if}
                        </div>
                        <div class="mb-3">
                            <label
                                for="exampleFormControlInput1"
                                class="form-label">Modelo</label
                            >
                            <input
                                bind:value={modelo.nombre}
                                type="text"
                                class="form-control"
                                id="exampleFormControlInput1"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div class="mb-3">
                            {#if accionModelo}
                                <button
                                    class="btn btn-primary"
                                    on:click={() => addModelo()}
                                    >Registrar</button
                                >
                            {:else}
                                <button
                                    class="btn btn-warning"
                                    on:click={() => modificarModelo()}
                                    >Modificar</button
                                >
                                <button
                                    class="btn btn-success"
                                    on:click={() => {
                                        accionModelo = true;
                                        modelo = {
                                            nombre: "",
                                            estado: true,
                                            idMarca: "",
                                        };
                                    }}>+ nuevo</button
                                >
                            {/if}
                        </div>
                    </div>
                    <div class="col">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Modelo</th>
                                    <th scope="col">estado</th>
                                    <th scope="col">accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each $modeloStore as r, i}
                                    <tr>
                                        <th scope="row">{i + 1}</th>
                                        <td>{r.nombre}</td>
                                        <td
                                            >{r.estado
                                                ? "Activo"
                                                : "No activo"}</td
                                        >
                                        <td>
                                            <button
                                                class="btn btn-warning btn-sm"
                                                on:click={() =>
                                                    mostrarModelo(r)}
                                                >Modificar</button
                                            >
                                            <button
                                                class="btn btn-danger btn-sm"
                                                on:click={() =>
                                                    delModelos(r.id)}
                                                >Eliminar</button
                                            >
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
