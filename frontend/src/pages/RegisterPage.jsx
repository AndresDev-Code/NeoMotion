import {
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    registerUser
} from "../api/api.js";

import neoMotionLogo
    from "../assets/neomotion-logo.svg";


function RegisterPage() {

    const [form, setForm] = useState({

        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: ""

    });


    const [
        error,
        setError
    ] = useState("");


    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        success,
        setSuccess
    ] = useState(false);


    // =================================================
    // CAMBIAR CAMPO
    // =================================================

    function handleChange(
        event
    ) {

        const {
            name,
            value
        } = event.target;


        setForm(
            previous => ({

                ...previous,

                [name]:
                value

            })
        );

    }


    // =================================================
    // REGISTRAR USUARIO
    // =================================================

    async function handleSubmit(
        event
    ) {

        event.preventDefault();


        setError("");

        setSuccess(false);

        setLoading(true);


        try {

            await registerUser(
                form
            );


            setSuccess(
                true
            );


            setForm({

                username: "",
                email: "",
                password: "",
                firstName: "",
                lastName: ""

            });


        } catch (error) {

            console.error(
                "Error creando cuenta:",
                error
            );


            setError(
                error.message ||
                "No fue posible crear la cuenta."
            );


        } finally {

            setLoading(
                false
            );

        }

    }


    return (

        <main className="register-page">


            {/* =================================================
                NAVBAR
            ================================================= */}

            <header className="page-navbar">

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

                    <Link to="/login">
                        Iniciar sesión
                    </Link>

                </div>

            </header>


            {/* =================================================
                CONTENIDO
            ================================================= */}

            <section className="register-content">


                {/* =================================================
                    FORMULARIO
                ================================================= */}

                <div className="register-card">


                    <div className="register-header">

                        <p className="section-label">
                            NEO MOTION
                        </p>


                        <h1>
                            CREA TU
                            <br />
                            CUENTA
                        </h1>


                        <p>
                            Forma parte de NeoMotion y
                            crea tu propio espacio dentro
                            del canal.
                        </p>

                    </div>


                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="register-form"
                    >


                        {/* =================================================
                            NOMBRE DE USUARIO
                        ================================================= */}

                        <div className="register-field">

                            <label htmlFor="register-username">
                                NOMBRE DE USUARIO
                            </label>


                            <input
                                id="register-username"
                                type="text"
                                name="username"
                                value={
                                    form.username
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="username"
                                required
                                disabled={loading}
                                placeholder="Elige tu nombre de usuario"
                            />

                        </div>


                        {/* =================================================
                            CORREO
                        ================================================= */}

                        <div className="register-field">

                            <label htmlFor="register-email">
                                CORREO ELECTRÓNICO
                            </label>


                            <input
                                id="register-email"
                                type="email"
                                name="email"
                                value={
                                    form.email
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="email"
                                required
                                disabled={loading}
                                placeholder="tu@correo.com"
                            />

                        </div>


                        {/* =================================================
                            NOMBRE Y APELLIDO
                        ================================================= */}

                        <div className="register-name-grid">


                            <div className="register-field">

                                <label htmlFor="register-first-name">
                                    NOMBRE
                                </label>


                                <input
                                    id="register-first-name"
                                    type="text"
                                    name="firstName"
                                    value={
                                        form.firstName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    autoComplete="given-name"
                                    required
                                    disabled={loading}
                                    placeholder="Tu nombre"
                                />

                            </div>


                            <div className="register-field">

                                <label htmlFor="register-last-name">
                                    APELLIDO
                                </label>


                                <input
                                    id="register-last-name"
                                    type="text"
                                    name="lastName"
                                    value={
                                        form.lastName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    autoComplete="family-name"
                                    disabled={loading}
                                    placeholder="Tu apellido"
                                />

                            </div>

                        </div>


                        {/* =================================================
                            CONTRASEÑA
                        ================================================= */}

                        <div className="register-field">

                            <label htmlFor="register-password">
                                CONTRASEÑA
                            </label>


                            <input
                                id="register-password"
                                type="password"
                                name="password"
                                value={
                                    form.password
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="new-password"
                                minLength={8}
                                required
                                disabled={loading}
                                placeholder="Mínimo 8 caracteres"
                            />

                        </div>


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div className="register-message error">

                                <span>
                                    AVISO
                                </span>


                                <p>
                                    {error}
                                </p>

                            </div>

                        )}


                        {/* =================================================
                            ÉXITO
                        ================================================= */}

                        {success && (

                            <div className="register-message success">

                                <span>
                                    CUENTA CREADA
                                </span>


                                <p>
                                    Tu cuenta fue creada
                                    correctamente. Ya puedes
                                    iniciar sesión.
                                </p>


                                <Link
                                    to="/login"
                                    className="register-success-link"
                                >
                                    INICIAR SESIÓN →
                                </Link>

                            </div>

                        )}


                        {/* =================================================
                            BOTÓN
                        ================================================= */}

                        <button
                            type="submit"
                            className="register-submit"
                            disabled={
                                loading
                            }
                        >

                            {loading

                                ? "CREANDO CUENTA..."

                                : "CREAR CUENTA"

                            }

                        </button>

                    </form>


                    {/* =================================================
                        LOGIN
                    ================================================= */}

                    <div className="register-login-link">

                        <span>
                            ¿YA TIENES UNA CUENTA?
                        </span>


                        <Link
                            to="/login"
                        >
                            INICIAR SESIÓN →
                        </Link>

                    </div>

                </div>


                {/* =================================================
                    PANEL INFORMATIVO
                ================================================= */}

                <aside className="register-side">

                    <p className="section-label">
                        NEO MOTION MEMBER
                    </p>


                    <h2>
                        Una cuenta.
                        <br />
                        Tu experiencia.
                    </h2>


                    <p>
                        Tu cuenta convierte NeoMotion
                        en un espacio más personal:
                        guarda tus series favoritas y
                        participa recomendando nuevos títulos.
                    </p>


                    <div className="register-features">

                        <div>

                            <span>
                                01
                            </span>


                            <strong>
                                GUARDA FAVORITOS
                            </strong>


                            <p>
                                Crea tu propio catálogo
                                de series.
                            </p>

                        </div>


                        <div>

                            <span>
                                02
                            </span>


                            <strong>
                                RECOMIENDA SERIES
                            </strong>


                            <p>
                                Comparte con NeoMotion
                                lo que quieres ver.
                            </p>

                        </div>


                        <div>

                            <span>
                                03
                            </span>


                            <strong>
                                PARTICIPA
                            </strong>


                            <p>
                                Forma parte de la comunidad
                                alrededor del canal.
                            </p>

                        </div>

                    </div>

                </aside>

            </section>

        </main>
    );
}


export default RegisterPage;