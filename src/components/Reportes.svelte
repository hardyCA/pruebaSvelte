<script>
    import { async } from "@firebase/util";
    import { marcasStore } from "../stores/MarcaStore";
    import { modeloStore } from "../stores/ModeloStore";
    import { productoStore } from "../stores/ProductosStore";
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
    import moment from "moment";
    import { onMount } from "svelte";
    import Grafico from "./Grafico.svelte";
    import { dataReport } from "../stores/ReporteStore";
    import Graficodos from "./Graficodos.svelte";

    let fechadesde = moment(new Date()).format("yyyy-MM-DD");
    let fechaasta = moment(new Date()).format("yyyy-MM-DD");

    let datos = [];
    const reporteRecibo = async () => {
        console.log(fechadesde, fechaasta);
        let data = [];
        const q = query(
            collection(db, "recibo"),
            where("fecha", ">=", fechadesde),
            where("fecha", "<=", fechaasta)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            data.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        console.log(data);
        datos = data;
        await ver();
        await agrupar();
    };
    ///////////////////////////////////////////////
    let productos = [];
    const ver = () => {
        productos = [];
        //nuevo array
        datos.map((r) => {
            r.productos.map((p) => {
                productos = [...productos, p];
            });
        });
        console.log(productos);
        //end array
    };
    let newProducto = [];
    let obj = [];
    const agrupar = async () => {
        obj = [];
        await productos.map((row) => {
            if (!newProducto.find((r) => r.codigo == row.codigo)) {
                // const { codigo, cantidad } = row;
                newProducto.push(row);
            }
        });
        await newProducto.map((r, i) => {
            let sum = 0;
            productos.map((d) => {
                if (r.id === d.id) {
                    sum = sum + d.cantidad;
                    obj[i] = { ...d, cantidadTotal: sum };
                }
            });
        });

        console.log(newProducto);
        console.log(obj);
        dataReport.setUser(obj);
    };
    onMount(async () => {
        await reporteRecibo();
    });
</script>

<div class="container">
    <div class="row mt-5">
        <div class="col">
            <h5>Reportes</h5>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label"
                    >Fecha desde</label
                >
                <input
                    type="date"
                    class="form-control"
                    placeholder="name@example.com"
                    bind:value={fechadesde}
                    on:change={reporteRecibo}
                />
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label"
                    >Fecha asta</label
                >
                <input
                    type="date"
                    class="form-control"
                    placeholder="name@example.com"
                    bind:value={fechaasta}
                    on:change={reporteRecibo}
                />
            </div>
            <div class="row">
                <div class="col">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">codigo</th>
                                <th scope="col">descripcion</th>
                                <th scope="col">precio</th>
                                <th scope="col">cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each obj as r, i}
                                <tr>
                                    <th scope="row">{i + 1}</th>
                                    <td>{r.codigo}</td>
                                    <td>{r.descripcion}</td>
                                    <td>{r.precio}</td>
                                    <td>{r.cantidadTotal}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
                <div class="col">
                    <Grafico />
                </div>
            </div>
        </div>
    </div>
    <hr />
    <div class="row">
        <div class="col">
            <h5>Reporte</h5>
            <div class="row">
                <div class="col">
                    <div class="mb-3">
                        <select
                            class="form-select"
                            aria-label="Default select example"
                            on:change={(e) =>
                                modeloStore.loadModelo(e.target.value)}
                        >
                            <option select>Seleccionar...</option>
                            {#each $marcasStore as r}
                                <option value={r.id}>{r.nombre}</option>
                            {/each}
                        </select>
                    </div>
                    <div class="mb-3">
                        <select
                            class="form-select"
                            aria-label="Default select example"
                            on:change={(e) =>
                                productoStore.loadProductos(e.target.value)}
                        >
                            <option select>Seleccionar...</option>
                            {#each $modeloStore as r}
                                <option value={r.id}>{r.nombre}</option>
                            {/each}
                        </select>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>

                                <th scope="col">Codigo</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Descripcion</th>
                                <th scope="col">Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each $productoStore as r, i}
                                <tr>
                                    <th scope="row">{i + 1}</th>
                                    <td>{r.codigo}</td>
                                    <td>{r.nombre}</td>
                                    <td>{r.descripcion}</td>
                                    <td>{r.stock}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="col">
            <Graficodos />
        </div>
    </div>
</div>
