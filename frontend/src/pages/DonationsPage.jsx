import {
    Link
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext.jsx";

import nequiQr
    from "../assets/nequi-qr.png";

import neoMotionLogo
    from "../assets/neomotion-logo.svg";


function DonationsPage() {

    const {
        isAuthenticated,
        logout
    } = useAuth();


    const paypalUrl =
        "TU_ENLACE_DE_PAYPAL";


    const whatsappUrl =
        "TU_ENLACE_DEL_GRUPO_DE_WHATSAPP";


    return (

        <main className="donations-page">


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


                    <Link to="/donaciones">
                        Apoya NeoMotion
                    </Link>

                </nav>


                <div className="page-navbar-actions">

                    <span className="page-navbar-status">
                        ● SEÑAL 24/7
                    </span>


                    {isAuthenticated ? (

                        <>

                            <Link to="/perfil">
                                Mi perfil
                            </Link>


                            <Link to="/recomendar">
                                Recomendar una serie
                            </Link>


                            <button
                                type="button"
                                onClick={logout}
                            >
                                Cerrar sesión
                            </button>

                        </>

                    ) : (

                        <>

                            <Link to="/registro">
                                Crear cuenta
                            </Link>


                            <Link to="/login">
                                Iniciar sesión
                            </Link>

                        </>

                    )}

                </div>

            </header>


            {/* =================================================
                HERO
            ================================================= */}

            <section className="donations-hero">

                <div className="donations-hero-main">

                    <p className="section-label">
                        APOYA A NEO MOTION
                    </p>


                    <h1>
                        AYUDA A MANTENER
                        <br />
                        VIVA LA SEÑAL
                    </h1>


                    <p className="donations-hero-description">

                        NeoMotion es un proyecto independiente
                        dedicado a recuperar la experiencia de
                        un canal de anime continuo.

                        <br />

                        Tu apoyo ayuda a que el proyecto
                        pueda seguir creciendo.

                    </p>

                </div>


                <div className="donations-hero-side">

                    <span>
                        NEO MOTION
                    </span>


                    <strong>
                        24 / 7
                    </strong>


                    <p>
                        Una señal creada para quienes
                        todavía disfrutan de descubrir
                        anime como antes.
                    </p>

                </div>

            </section>


            {/* =================================================
                OPCIONES DE APOYO
            ================================================= */}

            <section className="donations-options">


                {/* =================================================
                    PAYPAL
                ================================================= */}

                <article className="donation-card donation-paypal">

                    <div className="donation-card-number">
                        01
                    </div>


                    <div className="donation-card-content">

                        <span className="donation-label">
                            APOYO INTERNACIONAL
                        </span>


                        <h2>
                            PayPal
                        </h2>


                        <p>
                            Puedes apoyar NeoMotion mediante
                            una donación a través de PayPal.
                        </p>


                        <p className="donation-small-text">
                            El apoyo recibido contribuye al
                            mantenimiento y desarrollo del proyecto.
                        </p>


                        <a
                            href={paypalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="donation-button donation-button-primary"
                        >
                            DONAR CON PAYPAL
                        </a>

                    </div>

                </article>


                {/* =================================================
                    NEQUI
                ================================================= */}

                <article className="donation-card donation-nequi">

                    <div className="donation-card-number">
                        02
                    </div>


                    <div className="donation-card-content">

                        <span className="donation-label">
                            APOYO EN COLOMBIA
                        </span>


                        <h2>
                            Nequi
                        </h2>


                        <p>
                            Escanea el código QR desde
                            la aplicación de Nequi para
                            apoyar a NeoMotion.
                        </p>


                        <div className="nequi-qr">

                            <img
                                src={nequiQr}
                                alt="Código QR de Nequi para apoyar a NeoMotion"
                            />

                        </div>


                        <span className="donation-qr-caption">
                            ESCANEA PARA APOYAR
                        </span>

                    </div>

                </article>

            </section>


            {/* =================================================
                EN QUÉ AYUDA
            ================================================= */}

            <section className="donations-message">

                <div className="donations-message-heading">

                    <p className="section-label">
                        ¿EN QUÉ AYUDA?
                    </p>


                    <h2>
                        TU APOYO MANTIENE
                        <br />
                        EL PROYECTO EN MARCHA.
                    </h2>

                </div>


                <p className="donations-message-description">

                    Las contribuciones pueden ayudar con
                    infraestructura, almacenamiento,
                    servidores, mantenimiento y desarrollo
                    de NeoMotion.

                </p>


                <div className="donations-use-grid">


                    <div>

                        <span>
                            01
                        </span>


                        <strong>
                            INFRAESTRUCTURA
                        </strong>


                        <p>
                            Servicios necesarios para mantener
                            la plataforma funcionando.
                        </p>

                    </div>


                    <div>

                        <span>
                            02
                        </span>


                        <strong>
                            ALMACENAMIENTO
                        </strong>


                        <p>
                            Recursos para conservar y administrar
                            los contenidos del proyecto.
                        </p>

                    </div>


                    <div>

                        <span>
                            03
                        </span>


                        <strong>
                            DESARROLLO
                        </strong>


                        <p>
                            Mejoras y nuevas funciones para
                            continuar construyendo NeoMotion.
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                COMUNIDAD
            ================================================= */}

            <section className="donations-community">

                <div>

                    <p className="section-label">
                        COMUNIDAD NEO MOTION
                    </p>


                    <h2>
                        EL CANAL
                        <br />
                        TAMBIÉN LO HACEMOS
                        <br />
                        ENTRE TODOS.
                    </h2>

                </div>


                <div className="donations-community-content">

                    <p>
                        Acompaña el proyecto, conoce las novedades
                        y mantente al tanto de las actualizaciones
                        de NeoMotion.
                    </p>


                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="donation-button donation-button-secondary"
                    >
                        UNIRME A LA COMUNIDAD
                    </a>

                </div>

            </section>


            {/* =================================================
                CIERRE
            ================================================= */}

            <section className="donations-final">

                <p className="section-label">
                    NEO MOTION
                </p>


                <h2>
                    GRACIAS POR MANTENER
                    <br />
                    VIVA LA SEÑAL.
                </h2>


                <div className="donations-final-meta">

                    <span>
                        ANIME TELEVISION
                    </span>


                    <span>
                        24 / 7
                    </span>

                </div>

            </section>

        </main>
    );
}


export default DonationsPage;