<script>
    import { async } from "@firebase/util";
    // ES6 Modules or TypeScript
    import Swal from "sweetalert2";

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
    import { Link } from "svelte-routing";
    import { buscar } from "../helpers/helperBusqueda";
    import Cantidad from "./Cantidad.svelte";
    import {
        firebaseAddCliente,
        firebaseAddCredito,
        firebaseAddRecibo,
        firebaseLoadCliente,
    } from "../helpers/helperCliente";
    import { hora } from "../stores/HoraStore";
    import moment from "moment";
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
    let date = new Date();

    const formatter = new Intl.DateTimeFormat("en", {
        hour12: true,
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
    });

    let datos = [];
    let databusqueda = "";
    // $: databusqueda;
    $: busqueda;
    const busqueda = () => {
        // let data = await buscar(databusqueda);
        //  datos = data;
        ///busqueda firebase directo tiempo real
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

        //end tiempo realtiempo real
    };

    let datosCompra = [];

    const comprar = async (r, cantidad) => {
        if (cantidad > r.stock) {
            Toast.fire({
                icon: "error",
                title: "Error de compra",
            });
            return;
        }

        if (cantidad < 1) {
            console.log("Agregar cantidad mayor a 0");
            Toast.fire({
                icon: "error",
                title: "Agregar cantidad mayor a 0",
            });
            return;
        }

        r.cantidad = cantidad;
        datosCompra = [...datosCompra, r];
        Toast.fire({
            icon: "success",
            title: "Agregado con exito",
        });
    };
    const eliminar = async (id) => {
        datosCompra = datosCompra.filter((r) => r.id !== id);
    };
    function total(data) {
        let total = 0;
        data.map((r, i) => {
            total = r.precio * r.cantidad + total;
        });

        return total;
    }
    let dataCliente = {
        ci: "",
        nombre: "",
        direccion: "",
        celular: "",
        estado: true,
        fecha: moment(new Date()).format("yyyy-MM-DD"),
    };
    ////
    const buscandoCliente = async () => {
        const cliente = await firebaseLoadCliente(dataCliente.ci);
        if (cliente.length === 0) {
            console.log("cliente no existente");

            Toast.fire({
                icon: "warning",
                title: "Cliente no existente",
            });

            // dataCliente.nombre = "";
            // dataCliente.direccion = "";
            // dataCliente.celular = "";
        } else {
            console.log("cliente existente");
            Toast.fire({
                icon: "success",
                title: "Cliente existente",
            });
            dataCliente.nombre = cliente[0].nombre;
            dataCliente.direccion = cliente[0].direccion;
            dataCliente.celular = cliente[0].celular;
        }
    };
    let nota = "";
    let idFactura = "";
    let descuento = "";
    let yes = false;

    let credito = {
        fecha: moment(new Date()).format("yyyy-MM-DD"),
        monto: "",
        saldo: "",
        hora: formatter.format($hora),
    };
    const terminarCompra = async () => {
        if (dataCliente.ci === "") {
            console.log("agregar C.I.");
            Toast.fire({
                icon: "error",
                title: "Agregar C.I.",
            });
            return;
        }
        if (dataCliente.nombre === "") {
            console.log("Agregar nombre de Cliente");
            Toast.fire({
                icon: "error",
                title: "Agregar nombre de cliente",
            });
            return;
        }
        if (dataCliente.celular === "") {
            console.log("Agregar celular");
            Toast.fire({
                icon: "error",
                title: "Agregar celular de cliente",
            });
            return;
        }
        if (datosCompra.length === 0) {
            console.log("Agregar productos");
            Toast.fire({
                icon: "error",
                title: "Agregar producto",
            });
            return;
        }
        console.log("terminar compra");
        //Registrar o ver si existe
        //preguntar si existe usuario
        const cliente = await firebaseLoadCliente(dataCliente.ci);
        if (cliente.length === 0) {
            console.log("cliente no existente");
            let cli = await firebaseAddCliente(dataCliente);
            //recibo
            let recibo = {
                numero: 12,
                idCliente: cli.id,
                nombreCliente: cli.nombre,
                celularCliente: cli.celular,
                ciCliente: cli.ci,
                fecha: moment(new Date()).format("yyyy-MM-DD"),
                hora: formatter.format($hora),
                idUsuario: 123,
                total: total(datosCompra),
                nota: nota,
                productos: datosCompra,
                descuento: descuento,
                TotalNeto: total(datosCompra) - descuento,
                tipo: yes,
                estadoCredito: yes,
            };
            const newRecibo = await firebaseAddRecibo(recibo);
            //creditos
            if (yes) {
                credito.idRecibo = newRecibo.id;
                await firebaseAddCredito(credito);
            } else {
                console.log("sin credito");
            }
            idFactura = newRecibo.id;
            /////////////Modificar los stock de los productos comprados
            //modificar stock firebase
            datos.map((r) => {
                datosCompra.map((row) => {
                    if (r.id === row.id) {
                        console.log("Modifico id producto:", r.id);
                        console.log("cantidad:", r.stock, row.cantidad);
                        const washingtonRef = doc(db, "productos", r.id);
                        updateDoc(washingtonRef, {
                            stock: r.stock - row.cantidad,
                        });
                    }
                });
            });

            //modificar stock datosCmpra
            await lim();
            /////////////end estok modificado
            //Alerta de terminar compra
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Compra exitosa!",
                showConfirmButton: false,
                timer: 1500,
            });
            //end alerta de terminar compra
        } else {
            console.log("cliente existente");
            //recibo
            let recibo = {
                numero: 12,
                idCliente: cliente[0].id,
                nombreCliente: cliente[0].nombre,
                celularCliente: cliente[0].celular,
                ciCliente: cliente[0].ci,
                fecha: moment(new Date()).format("yyyy-MM-DD"),
                hora: formatter.format($hora),
                idUsuario: 123,
                total: total(datosCompra),
                nota: nota,
                productos: datosCompra,
                descuento: descuento,
                TotalNeto: total(datosCompra) - descuento,
                tipo: yes,
                estadoCredito: yes,
            };
            const newRecibo = await firebaseAddRecibo(recibo);
            //creditos
            if (yes) {
                credito.idRecibo = newRecibo.id;
                await firebaseAddCredito(credito);
            } else {
                console.log("sin credito");
            }
            idFactura = newRecibo.id;
            /////////////Modificar los stock de los productos comprados
            //modificar stock firebase
            datos.map((r) => {
                datosCompra.map((row) => {
                    if (r.id === row.id) {
                        console.log("Modifico id producto:", r.id);
                        console.log("cantidad:", r.stock, row.cantidad);
                        const washingtonRef = doc(db, "productos", r.id);
                        updateDoc(washingtonRef, {
                            stock: r.stock - row.cantidad,
                        });
                    }
                });
            });

            //modificar stock datosCmpra
            await lim();
            /////////////end estok modificado
            //Alerta de terminar compra
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Compra exitosa!",
                showConfirmButton: false,
                timer: 1500,
            });
            //end alerta de terminar compra
        }
    };

    const lim = () => {
        limpiar = true;
    };

    let limpiar = false;
    const liminarTodo = () => {
        limpiar = false;
        databusqueda = "";
        dataCliente = {
            ci: "",
            nombre: "",
            direccion: "",
            celular: "",
            estado: true,
            fecha: moment(new Date()).format("yyyy-MM-DD"),
        };
        datosCompra = [];
        datos = [];
        nota = "";
        credito = {
            fecha: moment(new Date()).format("yyyy-MM-DD"),
            monto: "",
            saldo: "",
            hora: formatter.format($hora),
        };
        descuento = "";
    };
</script>

<div class="container">
    <div class="row mt-5">
        <!-- registro cliente -->
        <div class="col-4">
            <div class="card">
                <div class="card-header bg-warning text-white">
                    Registro cliente
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label"
                            >Nro. Carnet / Buscador</label
                        >
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Nro. Carnet / Buscador"
                            bind:value={dataCliente.ci}
                            on:change={buscandoCliente}
                        />
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label"
                            >Nombre completo</label
                        >
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Nombre completo"
                            bind:value={dataCliente.nombre}
                        />
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label"
                            >Dirección</label
                        >
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Dirección"
                            bind:value={dataCliente.direccion}
                        />
                    </div>
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label"
                            >Celular</label
                        >
                        <input
                            type="number"
                            class="form-control"
                            placeholder="Celular"
                            bind:value={dataCliente.celular}
                        />
                    </div>
                </div>
            </div>
        </div>
        <!-- Buscar producto -->
        <div class="col">
            <div class="card">
                <div class="card-header bg-warning text-white">Producto</div>
                <div class="card-body">
                    <div class="input-group mb-3 mt-3">
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Buscar producto..."
                            aria-label="Recipient's username"
                            aria-describedby="button-addon2"
                            bind:value={databusqueda}
                            on:change={busqueda}
                        />
                        <button
                            class="btn btn-outline-secondary"
                            type="button"
                            id="button-addon2"
                            on:click={busqueda}>Buscar</button
                        >
                    </div>

                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Codigo</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Descripcion</th>
                                <th scope="col">Stock</th>
                                <th scope="col">Cantidad</th>
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
                                    <td>{r.stock}</td>

                                    <Cantidad {r} {comprar} />
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-header bg-warning text-white">
            Señor(es): {dataCliente.nombre} - C.I.:{dataCliente.ci}<br />
            fecha:{moment(new Date()).format("yyyy-MM-DD")} - Hora:{formatter.format(
                $hora
            )}
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Codigo </th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Descripción</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">P.Unit</th>
                                <th scope="col">P.Sub total</th>
                                <th scope="col">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each datosCompra as r, i}
                                <tr>
                                    <th scope="row">{r.codigo}</th>
                                    <td>{r.nombre}</td>
                                    <td>{r.descripcion}</td>
                                    <td>{r.cantidad}</td>
                                    <td>{r.precio}</td>
                                    <td>{r.cantidad * r.precio}</td>
                                    <td
                                        ><button
                                            class="btn btn-sm btn-danger"
                                            on:click={() => eliminar(r.id)}
                                            >x</button
                                        ></td
                                    >
                                </tr>
                            {/each}
                            <tr>
                                <td colspan="5">TOTAL</td>
                                <td>{total(datosCompra)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="row">
                <div class="mb-3">
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Agregar Nota..."
                        bind:value={nota}
                    />
                </div>
                <div class="col">
                    <div class="mb-3">
                        <input
                            type="number"
                            class="form-control"
                            placeholder="Descuento"
                            bind:value={descuento}
                        />
                    </div>
                </div>
                <div class="col">
                    <h5>TOTAL:{total(datosCompra) - descuento}</h5>
                </div>
                <div class="col">
                    <label>
                        <input type="checkbox" bind:checked={yes} />
                        Dar credito.
                    </label>
                </div>
                <div class="col">
                    {#if yes}
                        <input
                            type="number"
                            placeholder="Monto a cancelar"
                            bind:value={credito.monto}
                        />
                    {:else}
                        <p />
                    {/if}
                </div>
                <div class="col">
                    <h5>
                        Saldo:{(credito.saldo =
                            total(datosCompra) - descuento - credito.monto)}
                    </h5>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    {#if limpiar}
                        <button class="btn btn-primary" on:click={liminarTodo}
                            >+ Nuevo venta</button
                        >

                        <Link to="/factura/{idFactura}">
                            <button class="btn btn-success">Factura</button>
                        </Link>
                    {:else}
                        <button
                            class="btn btn-primary "
                            on:click={terminarCompra}>Terminar compra</button
                        >
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>
