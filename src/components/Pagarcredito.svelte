<script>
    import {
        addDoc,
        collection,
        getDocs,
        query,
        where,
        doc,
        deleteDoc,
        updateDoc,
        orderBy,
    } from "firebase/firestore";
    import db from "../firebase";
    import { firebaseLoadCredito } from "../helpers/helperCliente";
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
        buscarCreditos();
    });
    //end session
    let date = new Date();

    const formatter = new Intl.DateTimeFormat("en", {
        hour12: true,
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
    });

    let dataCliente = [];
    let ci = "";
    const buscar = async () => {
        let data = [];
        const q = query(
            collection(db, "recibo"),
            where("ciCliente", "==", ci),
            orderBy("fecha")
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            data.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        console.log(data);
        dataCliente = data;
    };

    function totalSaldo(data) {
        let total = 0;
        data.map((r, i) => {
            total = total + r.saldo;
        });

        return total;
    }
    function totalMonto(data) {
        let total = 0;
        data.map((r, i) => {
            total = total + r.monto;
        });

        return total;
    }
    $: totalSaldo;
    $: totalMonto;
    let creditoData = [];
    let totalDelCredito = "";
    let idDeCredito = "";
    const verCredito = async (id, total) => {
        totalDelCredito = total;
        idDeCredito = id;

        creditoData = await firebaseLoadCredito(id);
    };

    let datosPago = {
        fecha: moment(new Date()).format("yyyy-MM-DD"),

        monto: "",
        saldo: "",
    };

    $: datosPago;
    const pagar = async () => {
        datosPago.idRecibo = idDeCredito;
        datosPago.hora = formatter.format($hora);
        console.log("entro");
        try {
            const docRef = await addDoc(collection(db, "credito"), datosPago);
            datosPago.id = docRef.id;
            console.log("Document Agregado credito ID: ", docRef.id);
            console.log(datosPago);
            creditoData = [...creditoData, datosPago];
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        //terminar credito
        if (datosPago.saldo === 0) {
            //cambiar estado de pago
            const washingtonRef = doc(db, "recibo", idDeCredito);
            await updateDoc(washingtonRef, {
                tipo: false,
            });

            dataCliente = dataCliente.map((p) => {
                if (p.id === idDeCredito) {
                    return {
                        ...p,
                        tipo: false,
                    };
                } else {
                    return p;
                }
            });
        }
    };

    //fecha

    let yes = true;

    //buscar crditos
    const buscarCreditos = async () => {
        let data = [];
        const q = query(
            collection(db, "recibo"),
            where("tipo", "==", true),
            orderBy("fecha")
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            data.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        console.log(data);
        dataCliente = data;
    };
    //calcular saldo
    const calcularSaldo = async (id, total) => {
        console.log(id);
        const datos = await firebaseLoadCredito(id);

        await console.log(datos);
        let suma = 0;
        datos.map((r) => {
            suma = suma + r.monto;
        });
        console.log(total - suma);

        let div = document.getElementById(id);
        await div.insertAdjacentText("afterbegin", total - suma);
        return ".";
    };
</script>

<div class="container">
    <h5 class="mt-5">Pagar creditos</h5>
    <div class="row">
        <div class="col">
            {formatter.format($hora)}

            <div class="input-group mb-3">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Buscar..."
                    aria-label="Recipient's username"
                    aria-describedby="button-addon2"
                    bind:value={ci}
                />
                <button
                    class="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                    on:click={buscar}>Buscar</button
                >
            </div>

            <div class="mb-3">
                <button class="btn btn-primary" on:click={buscarCreditos}>
                    Buscar todos creditos
                </button>
            </div>
            <label>
                <input type="checkbox" bind:checked={yes} />
                Mostrar cretidos pagados
            </label>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <table class="table">
                <thead>
                    <tr class="table-warning">
                        <th scope="col">Fecha</th>
                        <th scope="col">c.i. cliente</th>
                        <th scope="col">nombre cliente</th>
                        <th scope="col">Celular</th>
                        <th scope="col">Descuento</th>
                        <th scope="col">Total</th>
                        <th scope="col">Total Neto</th>
                        <th scope="col">Saldo</th>
                        <th scope="col">acción</th>
                    </tr>
                </thead>
                <tbody>
                    {#each dataCliente as r}
                        {#if r.tipo === yes}
                            <tr>
                                <th scope="row">{r.fecha}</th>
                                <td>{r.ciCliente}</td>
                                <td>{r.nombreCliente}</td>
                                <td>{r.celularCliente}</td>
                                <td>{r.descuento}</td>
                                <td>{r.total}</td>
                                <td>{r.TotalNeto}</td>
                                <td id={r.id}
                                    ><p class="des">
                                        {calcularSaldo(r.id, r.TotalNeto)}
                                    </p></td
                                >

                                <td>
                                    {#if r.tipo}
                                        <button
                                            class="btn btn-sm btn-primary"
                                            data-bs-toggle="modal"
                                            data-bs-target="#modalrecibo"
                                            on:click={() =>
                                                verCredito(r.id, r.TotalNeto)}
                                            >pagar</button
                                        >
                                    {:else}
                                        <h6>Pagado</h6>
                                    {/if}
                                </td>
                            </tr>
                        {/if}
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>
<!-- Modal -->

<div
    class="modal fade"
    id="modalrecibo"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
>
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                    Total:{totalDelCredito}
                </h5>

                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                />
            </div>
            <div class="modal-body">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">fecha</th>
                            <th scope="col">hora</th>
                            <th scope="col">monto</th>
                            <th scope="col">saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each creditoData as row}
                            <tr>
                                <th scope="row">{row.fecha}</th>
                                <td>{row.hora}</td>
                                <td>{row.monto}</td>
                                <td>{row.saldo}</td>
                            </tr>
                        {/each}
                        <tr class="table-secondary">
                            <th scope="row">TOTAL</th>
                            <td>-</td>
                            <td>{totalMonto(creditoData)}</td>
                            <td>-</td>
                        </tr>
                    </tbody>
                </table>
                <div class="mb-3 mt-2">
                    <label for="exampleFormControlInput1" class="form-label"
                        >Pagar Monto</label
                    >
                    <input
                        type="number"
                        class="form-control"
                        placeholder="Pagar..."
                        bind:value={datosPago.monto}
                    />
                    <small
                        >Saldo:{(datosPago.saldo =
                            totalDelCredito -
                            totalMonto(creditoData) -
                            datosPago.monto)}</small
                    >
                </div>
            </div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">Cerrar</button
                >
                <button
                    type="button"
                    class="btn btn-primary"
                    data-bs-dismiss="modal"
                    on:click={pagar}>Pagar credito</button
                >
            </div>
        </div>
    </div>
</div>

<style>
    .des {
        visibility: hidden;
        display: none;
    }
</style>
