<script>
    import { user } from "../stores/User";
    import { navigate } from "svelte-routing";

    let data = { usuario: "", passworda: "" };

    const loginAcceso = () => {
        user.setUser(data);
        navigate("/", { replace: true });
    };
</script>

<div class="row vh-100 ">
    <div class="col h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-5">
                <!-- <img src={logo} class="img-fluid" alt="..." /> -->
                <h4>Iniciar seccion</h4>

                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label"
                        >Usuario</label
                    >
                    <input
                        type="text"
                        class="form-control"
                        bind:value={data.usuario}
                    />
                    <div id="emailHelp" class="form-text">
                        We'll never share your email with anyone else.
                    </div>
                </div>
                <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label"
                        >Contraseña</label
                    >
                    <input
                        type="password"
                        class="form-control"
                        bind:value={data.password}
                    />
                </div>

                <button class="btn btn-primary" on:click={loginAcceso}
                    >Ingresar</button
                >
            </div>
        </div>
    </div>
</div>
