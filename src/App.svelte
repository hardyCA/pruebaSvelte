<script>
	import { Router, Link, Route } from "svelte-routing";
	import Almacen from "./components/Almacen.svelte";
	import Inventario from "./components/Inventario.svelte";

	import Login from "./components/Login.svelte";
	import Menu from "./components/Menu.svelte";
	import RegistroProducto from "./components/RegistroProducto.svelte";
	import Configuracion from "./components/Configuracion.svelte";
	import { user } from "./stores/User";
	import { firebaseLoadMarca } from "./helpers/helperMarca";
	import { marcasStore } from "./stores/MarcaStore";
	import Ventas from "./components/Ventas.svelte";
	import Factura from "./components/Factura.svelte";
	import Pagarcredito from "./components/Pagarcredito.svelte";
	import Reportes from "./components/Reportes.svelte";
	import Nav from "./components/Nav.svelte";

	//localstoraje
	function ver() {
		if (localStorage.getItem("usuario")) {
			let data = JSON.parse(localStorage.getItem("usuario"));
			user.setUser(data);
		} else {
			console.log("No autenticado");
		}
	}
	$: ver();

	//marcas

	const cargarStoreMarca = async () => {
		if (localStorage.getItem("marcas")) {
			let data = JSON.parse(localStorage.getItem("marcas"));
			marcasStore.loadMarca(data);
		} else {
			console.log("sin Marcas");
			let data = await firebaseLoadMarca();
			localStorage.setItem("marcas", JSON.stringify(data));
			marcasStore.loadMarca(data);
		}
	};
	$: cargarStoreMarca();
</script>

<div class="container-fluid">
	<Nav />
	<Router>
		<Route path="/">
			<Menu />
		</Route>
		<Route path="/login">
			<Login />
		</Route>
		<Route path="/registro-producto">
			<RegistroProducto />
		</Route>
		<Route path="/almacen">
			<Almacen />
		</Route>
		<Route path="/inventario">
			<Inventario />
		</Route>
		<Route path="/configuracion">
			<Configuracion />
		</Route>
		<Route path="/ventas">
			<Ventas />
		</Route>
		<Route path="/pagar-credito">
			<Pagarcredito />
		</Route>
		<Route path="/reporte">
			<Reportes />
		</Route>
		<Route path="/factura/:id" let:params>
			<Factura id={params.id} />
		</Route>
	</Router>
</div>

<style>
</style>
