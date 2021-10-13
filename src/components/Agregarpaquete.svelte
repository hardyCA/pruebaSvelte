<script>
    export let r, agregarStock;
    let cantidad = "";
</script>

<td>
    <div class="input-group mb-3">
        <button
            class="btn btn-outline-secondary"
            type="button"
            on:click={() => cantidad--}>-</button
        >
        <button
            class="btn btn-outline-secondary"
            type="button"
            on:click={() => cantidad++}>+</button
        >
        <input
            type="number"
            class="form-control"
            placeholder="Agregar cantidad"
            bind:value={cantidad}
        />
    </div>

    <div id="emailHelp" class="form-text">
        Agregando {r.paquete * cantidad} paquetes
    </div>
</td>
<td
    ><button
        class="btn btn-dark btn-sm"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        on:click={() => agregarStock(r, cantidad)}>Agregar</button
    ></td
>
