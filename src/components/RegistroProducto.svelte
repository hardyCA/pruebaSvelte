<script>
    import { deleteDoc, doc, updateDoc } from "firebase/firestore";
    import db from "../firebase";
    import Swal from "sweetalert2";
    import { firebaseAddProducto } from "../helpers/helperProducto";
    import { marcasStore } from "../stores/MarcaStore";
    import { modeloStore } from "../stores/ModeloStore";
    import { productoStore } from "../stores/ProductosStore";
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
    let accion = true;
    let alerta = "";
    let producto = {
        marca: "",
        modelo: "",
        codigo: "",
        nombre: "",
        descripcion: "",
        precio: "",
        costo: "",
        paquete: "",
        estado: true,
        stock: 0,
    };
    const loadProductos = () => {
        console.log(producto.modelo);
        productoStore.loadProductos(producto.modelo);
    };

    //load modelo
    const loadModelos = () => {
        console.log(producto.marca);
        modeloStore.loadModelo(producto.marca);
    };

    //Registrar producto
    $: console.log(alerta);
    const addProductos = async () => {
        //validar
        if (producto.marca === "") {
            alerta = "Seleccionar Marca";
            Toast.fire({
                icon: "error",
                title: "Selecionar marca",
            });
            return alerta;
        }
        if (producto.modelo === "") {
            alerta = "Seleccionar Modelo";
            Toast.fire({
                icon: "error",
                title: "Selecionar modelo",
            });
            return alerta;
        }
        if (producto.codigo === "") {
            alerta = "Agregar modelo";
            Toast.fire({
                icon: "error",
                title: "Agregar Codigo",
            });
            return alerta;
        }
        if (producto.nombre == "") {
            Toast.fire({
                icon: "error",
                title: "Agregar nombre",
            });
            return;
        }
        if (producto.descripcion == "") {
            Toast.fire({
                icon: "error",
                title: "Agregar descripción",
            });
            return;
        }
        if (producto.precio == "") {
            Toast.fire({
                icon: "error",
                title: "Agregar precio",
            });
            return;
        }
        if (producto.paquete == "") {
            Toast.fire({
                icon: "error",
                title: "Agregar cantidad de paquetes",
            });
            return;
        }

        //firebase
        const data = await firebaseAddProducto(producto);
        //store
        productoStore.agregarProducto(data);
        //alert
        Toast.fire({
            icon: "success",
            title: "Agregar con exito",
        });
        //Limpiar campos
        producto = {
            marca: "",
            modelo: "",
            codigo: "",
            nombre: "",
            descripcion: "",
            precio: "",
            costo: "",
            paquete: "",
            estado: true,
            stock: 0,
        };
    };
    //eliminar producto
    const EliminarProductos = async (id) => {
        await deleteDoc(doc(db, "productos", id));
        productoStore.eliminarProducto(id);
        Toast.fire({
            icon: "success",
            title: "Eliminado con exito",
        });
    };

    //modificar producto
    let yes = false;
    const modProducto = (p) => {
        //validar modificar
        yes = true;
        producto = {
            id: p.id,
            marca: p.marca,
            modelo: p.modelo,
            codigo: p.codigo,
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: p.precio,
            costo: p.costo,
            paquete: p.paquete,
            estado: true,
        };
        accion = false;
    };

    const modificar = async () => {
        //firebase
        const washingtonRef = doc(db, "productos", producto.id);
        await updateDoc(washingtonRef, {
            codigo: producto.codigo,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            costo: producto.costo,
            paquete: producto.paquete,
            estado: producto.estado,
        });
        //store
        productoStore.modificarProducto(producto);

        Toast.fire({
            icon: "success",
            title: "Modificado con exito",
        });
    };
    console.log($marcasStore);
    console.log($modeloStore);
    console.log($productoStore);
</script>

<div class="container">
    <div class="row mt-5">
        <div class="col">
            <div class="card">
                <div class="card-header bg-warning text-white">
                    Registrar producto
                </div>
                <div class="card-body">
                    <div class="col">
                        <div class="mb-3">
                            <label
                                for="exampleFormControlInput1"
                                class="form-label">Marca de Producto</label
                            >
                            <select
                                class="form-select"
                                aria-label="Default select example"
                                bind:value={producto.marca}
                                on:change={loadModelos}
                                disabled={yes}
                            >
                                {#each $marcasStore as r}
                                    <option value={r.id}>{r.nombre}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label
                                for="exampleFormControlInput1"
                                class="form-label">Modelo</label
                            >
                            <select
                                class="form-select"
                                aria-label="Default select example"
                                bind:value={producto.modelo}
                                on:change={loadProductos}
                                disabled={yes}
                            >
                                <option selected>Seleccionar Modelo</option>
                                {#each $modeloStore as r}
                                    <option value={r.id}>{r.nombre}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label
                                for="exampleFormControlInput1"
                                class="form-label">Codigo producto</label
                            >
                            <input
                                bind:value={producto.codigo}
                                type="text"
                                class="form-control"
                                placeholder="Codigo de producto"
                            />
                        </div>
                        <div class="mb-3">
                            <label
                                for="exampleFormControlInput1"
                                class="form-label">Nombre producto</label
                            >
                            <input
                                bind:value={producto.nombre}
                                type="text"
                                class="form-control"
                                placeholder="Nombre de producto"
                            />
                        </div>
                        <div class="mb-3">
                            <label
                                for="exampleFormControlInput1"
                                class="form-label">Descripcion</label
                            >
                            <input
                                bind:value={producto.descripcion}
                                type="text"
                                class="form-control"
                                placeholder="Descripción de producto"
                            />
                        </div>

                        <div class="mb-3">
                            <label
                                for="exampleFormControlInput1"
                                class="form-label">Precio</label
                            >
                            <input
                                bind:value={producto.precio}
                                type="number"
                                class="form-control"
                                placeholder="Precio"
                            />
                        </div>

                        <div class="mb-3">
                            <label
                                for="exampleFormControlInput1"
                                class="form-label">Caja por paquete</label
                            >
                            <input
                                bind:value={producto.paquete}
                                type="number"
                                class="form-control"
                                placeholder="Caja por paquete"
                            />
                        </div>
                        <div class="mb-3">
                            {#if accion}
                                <button
                                    class="btn btn-primary"
                                    on:click={() => {
                                        addProductos();
                                    }}>Registrar</button
                                >
                            {:else}
                                <button
                                    class="btn btn-warning"
                                    on:click={() => {
                                        modificar();
                                    }}>Modificar</button
                                >
                                <button
                                    class="btn btn-success"
                                    on:click={() => {
                                        yes = false;
                                        producto = {
                                            marca: "",
                                            modelo: "",
                                            codigo: "",
                                            nombre: "",
                                            descripcion: "",
                                            precio: "",
                                            costo: "",
                                            paquete: "",
                                            estado: true,
                                            stock: 0,
                                        };
                                        accion = true;
                                    }}
                                >
                                    + Nuevo</button
                                >
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-8">
            <div class="card">
                <div class="card-header">Lista de productos</div>
                <div class="card-body">
                    <table class="table ">
                        <thead>
                            <tr class="table-warning">
                                <th scope="col">#</th>
                                <th scope="col">Codigo</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Descripcion</th>
                                <th scope="col">Precio</th>

                                <th scope="col">Caja por paquete</th>
                                <th scope="col">Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each $productoStore as r, i}
                                <tr>
                                    <th scope="row">{i + 1}</th>
                                    <td>{r.codigo}</td>
                                    <td>{r.nombre}</td>
                                    <td>{r.descripcion}</td>
                                    <td>{r.precio}</td>

                                    <td>{r.paquete}</td>
                                    <td>
                                        <button
                                            class="btn btn-warning"
                                            on:click={() => {
                                                modProducto(r);
                                            }}>M</button
                                        >
                                        <button
                                            class="btn btn-danger"
                                            on:click={() => {
                                                EliminarProductos(r.id);
                                            }}>E</button
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
