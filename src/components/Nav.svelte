<script>
    import { Link } from "svelte-routing";
    //cession
    import { user } from "../stores/User";
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";

    //end session

    const cerrarSession = () => {
        user.setUser = [];
        localStorage.clear();
        navigate("/login", { replace: true });
    };
</script>

<!-- <nav>
    <Link to="/">menu</Link>
    <Link to="/login">Login</Link>
    <Link to="/registro-producto">registro-producto</Link>
    <Link to="/almacen">almacen</Link>
    <Link to="/inventario">inventario</Link>
    <Link to="/configuracion">configuracion</Link>
    <Link to="/ventas">ventas</Link>
    <Link to="/pagar-credito">pagar credito</Link>
    <Link to="/reporte">Reporte</Link>
</nav> -->

<nav class="navbar fixed-top navbar-light bg-light">
    <div class="container-fluid"><h6 on:click={cerrarSession}>Cerrar</h6></div>
</nav>
