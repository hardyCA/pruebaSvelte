<script>
    import { user } from "../stores/User";
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { Link } from "svelte-routing";
    //import { CreditCardFill } from "svelte-bootstrap-icons";
    //localstoraje
    // if (localStorage.getItem("tareas")) {
    // 	tareas = JSON.parse(localStorage.getItem("tareas"));
    // }

    // $: localStorage.setItem("tareas", JSON.stringify(tareas));
    onMount(() => {
        if (!$user) {
            navigate("/login", { replace: true });
        }
    });
    let action = true;
</script>

<div class="container vh-100 ">
    <div class="row d-flex justify-content-center align-items-center h-100">
        {#if action}
            <div class="col">
                <Link to="/ventas" class="text-decoration-none">
                    <div class="card shadow p-3 text-center">
                        <h3>ICON</h3>
                        VENTAS
                    </div>
                </Link>
            </div>
            <div class="col">
                <Link to="/pagar-credito" class="text-decoration-none">
                    <div class="card shadow p-3 text-center">
                        <h3>ICONS</h3>
                        CREDITOS
                    </div>
                </Link>
            </div>
            <div class="col">
                <div
                    class="card shadow p-3 text-center"
                    on:click={() => (action = false)}
                >
                    <h3>ICON</h3>
                    INVENTARIO
                </div>
            </div>
        {:else}
            <div class="col">
                <div
                    class="card shadow p-3 text-center"
                    on:click={() => (action = true)}
                >
                    <h3>ICON</h3>
                    REGRESAR
                </div>
            </div>
            <div class="col">
                <Link to="/registro-producto" class="text-decoration-none">
                    <div class="card shadow p-3 text-center">
                        <h3>ICON</h3>
                        AGREGAR PRODUCTO
                    </div>
                </Link>
            </div>
            <div class="col">
                <Link to="/inventario" class="text-decoration-none">
                    <div class="card shadow p-3 text-center">
                        <h3>ICONS</h3>
                        INVENTARIO
                    </div>
                </Link>
            </div>
            <div class="col">
                <Link to="/configuracion" class="text-decoration-none">
                    <div class="card shadow p-3 text-center">
                        <h3>ICON</h3>
                        MARCAS - MODELOS
                    </div>
                </Link>
            </div>
        {/if}
    </div>
</div>
<!-- <Ventas /> -->
<!-- <Inventario /> -->
<!-- <RegistroProducto /> -->
<!-- <Almacen /> -->
