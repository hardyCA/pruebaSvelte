<script>
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
</script>

<div class="row">
    <div class="col">
        <div class="mb-3">
            <select
                class="form-select"
                aria-label="Default select example"
                on:change={(e) => modeloStore.loadModelo(e.target.value)}
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
                on:change={(e) => productoStore.loadProductos(e.target.value)}
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
