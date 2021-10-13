<script>
    import { doc, getDoc } from "firebase/firestore";
    import db from "../firebase";
    import { onMount } from "svelte";
    import QRCode from "./QRJS.svelte";
    import { firebaseLoadCredito } from "../helpers/helperCliente";
    export let id;

    console.log(id);
    let data = {};
    let productos = [];
    let creditosnew = [];
    let stadoCredito = "";
    const ver = async () => {
        const docRef = doc(db, "recibo", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            data = docSnap.data();
            stadoCredito = data.estadoCredito;
            productos = data.productos;

            // if (data.tipo) {
            //     creditosnew = await firebaseLoadCredito(id);
            //     console.log(creditosnew);
            // }
            creditosnew = await firebaseLoadCredito(id);
            //     console.log(creditosnew);
            //creditosnew = [...creditosnew, data.credito];
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    };

    onMount(() => {
        ver();
    });

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
</script>

<div class="container">
    <div class="row mt-5">
        <div class="col">
            <div class="row mt-5">
                <div class="col">
                    <h1 class="text-warning"><b>G A C I A</b></h1>
                </div>
                <div class="col-5 text-center">
                    <h3>GACIA BOLIVIA</h3>
                    <small>La Paz Av. Cochabamba No. 352</small>
                    <small>Telf.:2834619 Cel.:71522611 - 71522615</small>
                    <small
                        >Santa Cruz: 2do. Anillo, Galeria La Casona -3er. Piso</small
                    >
                    <small>Telf.:3454566 Cel.:71522600 - 71522601</small>
                </div>
                <div class="col ">
                    <QRCode
                        codeValue="https://gacia-sistema.web.app/{id}"
                        squareSize="160"
                    />codigo QR
                </div>
                <div class="col-12">
                    <b> Señor(es): </b>{data.nombreCliente} - <b> C.I.:</b>
                    {data.ciCliente}
                </div>
                <div class="col-12 mb-3"><b>Fecha:</b> {data.fecha}</div>
            </div>
            <div class="row">
                <div class="col">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">Codigo </th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Descripción</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">P.Unit</th>
                                <th scope="col">P.Sub total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each productos as r, i}
                                <tr>
                                    <th scope="row">{r.codigo}</th>
                                    <td>{r.nombre}</td>
                                    <td>{r.descripcion}</td>
                                    <td>{r.cantidad}</td>
                                    <td>{r.precio}</td>
                                    <td>{r.cantidad * r.precio}</td>
                                </tr>
                            {/each}
                            <tr>
                                <th scope="row">Total</th>
                                <td />
                                <td />
                                <td />
                                <td />
                                <td>{data.total}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    Nota: {data.nota}
                </div>
            </div>
            <div class="row">
                <div class="col">
                    Tota: {data.total} Bs.<br />
                    Descuento:{data.descuento} Bs.<br />
                    <b>TOTAL:{data.TotalNeto} Bs.</b>
                </div>
            </div>

            <div class="row">
                <div class="col mt-3">
                    <button class="btn btn-success">Imprimir</button>
                </div>
            </div>
        </div>
    </div>
    {#if stadoCredito}
        <div class="row">
            <h5>Creditos</h5>
            <div class="col">
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
                        {#each creditosnew as row}
                            <tr>
                                <th scope="row">{row.fecha}</th>
                                <td>{row.hora}</td>
                                <td>{row.monto}</td>
                                <td>{row.saldo}</td>
                            </tr>
                        {/each}
                        <tr>
                            <th scope="row">TOTAL</th>
                            <td>-</td>
                            <td>{totalMonto(creditosnew)}</td>
                            <td>-</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
</div>
