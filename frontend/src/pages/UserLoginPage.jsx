import {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext.jsx";

import {
    loginUser
} from "../api/api.js";

import neoMotionLogo
    from "../assets/neomotion-logo.svg";


function UserLoginPage() {

    const navigate =
        useNavigate();


    const {
        login
    } = useAuth();


    const [
        username,
        setUsername
    ] = useState("");


    const [
        password,
        setPassword
    ] = useState("");


    const [
        error,
        setError
    ] = useState("");


    const [
        loading,
        setLoading
    ] = useState(false);


    // =================================================
    // INICIAR SESIÓN
    // =================================================

    async function handleSubmit(
        event
    ) {

        event.preventDefault();


        setError("");

        setLoading(true);


        try {

            const data =
                await loginUser(
                    username.trim(),
                    password
                );


            login(
                data.token
            );


            navigate("/");


        } catch (error) {

            console.error(
                "Error iniciando sesión:",
                error
            );


            setError(
                error.message ||
                "No fue posible iniciar sesión."
            );


        } finally {

            setLoading(false);

        }

    }


    return (

        <main className="user-login-page">


            {/* =================================================
                NAVBAR
            ================================================= */}

            <header className="page-navbar login-navbar">

                <Link
                    to="/"
                    className="page-navbar-logo"
                >

                    <img
                        src={neoMotionLogo}
                        alt="NeoMotion"
                    />

                </Link>


                <nav className="page-navbar-menu">

                    <Link to="/">
                        Inicio
                    </Link>


                    <Link
                        to="/en-vivo"
                        className="page-live-link"
                    >

                        <span className="page-live-dot">
                        </span>

                        En vivo

                    </Link>


                    <Link to="/programacion">
                        Programación
                    </Link>


                    <Link to="/programas">
                        Programas
                    </Link>


                    <Link to="/noticias">
                        Noticias
                    </Link>


                    <Link to="/acerca">
                        Acerca de
                    </Link>

                </nav>


                <div className="page-navbar-actions">

                    <Link to="/registro">
                        Crear cuenta
                    </Link>

                </div>

            </header>


            {/* =================================================
                CONTENIDO
            ================================================= */}

            <section className="user-login-content">


                {/* =================================================
                    PANEL PRINCIPAL
                ================================================= */}

                <div className="user-login-card">


                    {/* =================================================
                        ENCABEZADO
                    ================================================= */}

                    <div className="user-login-header">

                        <p className="section-label">
                            NEOMOTION
                        </p>


                        <h1>
                            INICIAR
                            <br />
                            SESIÓN
                        </h1>


                        <p>
                            Entra a tu espacio personal
                            dentro de NeoMotion.
                        </p>

                    </div>


                    {/* =================================================
                        FORMULARIO
                    ================================================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="user-login-form"
                    >


                        {/* =================================================
                            USUARIO
                        ================================================= */}

                        <div className="user-login-field">

                            <label
                                htmlFor="login-username"
                            >
                                NOMBRE DE USUARIO
                            </label>


                            <input
                                id="login-username"
                                type="text"
                                value={username}
                                onChange={
                                    event =>
                                        setUsername(
                                            event.target.value
                                        )
                                }
                                autoComplete="username"
                                required
                                disabled={loading}
                                placeholder="Tu nombre de usuario"
                            />

                        </div>


                        {/* =================================================
                            CONTRASEÑA
                        ================================================= */}

                        <div className="user-login-field">

                            <label
                                htmlFor="login-password"
                            >
                                CONTRASEÑA
                            </label>


                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={
                                    event =>
                                        setPassword(
                                            event.target.value
                                        )
                                }
                                autoComplete="current-password"
                                required
                                disabled={loading}
                                placeholder="Tu contraseña"
                            />

                        </div>


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div className="user-login-error">

                                <span>
                                    AVISO
                                </span>


                                <p>
                                    {error}
                                </p>

                            </div>

                        )}


                        {/* =================================================
                            BOTÓN
                        ================================================= */}

                        <button
                            type="submit"
                            className="user-login-submit"
                            disabled={loading}
                        >

                            {loading
                                ? "INICIANDO SESIÓN..."
                                : "INICIAR SESIÓN"
                            }

                        </button>

                    </form>


                    {/* =================================================
                        REGISTRO
                    ================================================= */}

                    <div className="user-login-register">

                        <span>
                            ¿TODAVÍA NO TIENES CUENTA?
                        </span>


                        <Link
                            to="/registro"
                        >
                            CREAR UNA CUENTA →
                        </Link>

                    </div>

                </div>


                {/* =================================================
                    PANEL INFORMATIVO
                ================================================= */}

                <aside className="user-login-side">

                    <p className="section-label">
                        NEO MOTION MEMBER
                    </p>


                    <h2>
                        Vuelve a tu catálogo.
                    </h2>


                    <p>
                        Guarda tus series favoritas,
                        recomienda nuevos títulos y
                        mantén tu experiencia de NeoMotion
                        organizada desde un solo lugar.
                    </p>


                    <div className="user-login-features">

                        <div>

                            <span>
                                01
                            </span>


                            <strong>
                                TUS FAVORITOS
                            </strong>


                            <p>
                                Conserva tus series
                                favoritas en tu perfil.
                            </p>

                        </div>


                        <div>

                            <span>
                                02
                            </span>


                            <strong>
                                TU VOZ
                            </strong>


                            <p>
                                Recomienda series que
                                quieras ver en el canal.
                            </p>

                        </div>


                        <div>

                            <span>
                                03
                            </span>


                            <strong>
                                TU EXPERIENCIA
                            </strong>


                            <p>
                                Todo tu espacio personal
                                en un solo lugar.
                            </p>

                        </div>

                    </div>

                </aside>

            </section>

        </main>
    );
}


export default UserLoginPage;