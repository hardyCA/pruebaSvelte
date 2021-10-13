<script>
    export let r, comprar;
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
            placeholder="Cantidad"
            aria-label="Example text with two button addons"
            bind:value={cantidad}
        />
    </div>
</td>

<td
    ><button class="btn btn-dark btn-sm" on:click={() => comprar(r, cantidad)}
        >Comprar</button
    ></td
>
