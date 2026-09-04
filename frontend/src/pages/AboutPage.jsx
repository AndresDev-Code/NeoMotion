import {
    Link
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext.jsx";

import neoMotionLogo
    from "../assets/neomotion-logo.svg";


function AboutPage() {

    const {
        isAuthenticated,
        logout
    } = useAuth();


    return (

        <main className="about-page">


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

            <section className="about-hero">

                <div className="about-hero-main">

                    <p className="section-label">
                        NEO MOTION / IDENTIDAD
                    </p>


                    <h1>
                        ACERCA DE
                        <br />
                        NEOMOTION
                    </h1>


                    <p className="about-hero-description">

                        Un canal de televisión dedicado al anime
                        y a la experiencia de descubrir programación
                        sin tener que decidir qué ver.

                    </p>

                </div>


                <div className="about-signal-card">

                    <span>
                        SEÑAL
                    </span>


                    <strong>
                        24 / 7
                    </strong>


                    <p>
                        Una programación continua,
                        como la televisión de antes.
                    </p>

                </div>

            </section>


            {/* =================================================
                INTRODUCCIÓN
            ================================================= */}

            <section className="about-intro">

                <div className="about-intro-number">
                    01
                </div>


                <div className="about-intro-content">

                    <p className="section-label">
                        LA IDEA
                    </p>


                    <h2>
                        Recuperar la sensación
                        de encender el televisor
                        y dejarse sorprender.
                    </h2>


                    <p>
                        NeoMotion nace con una idea sencilla:
                        recuperar la experiencia de un canal
                        de televisión anime que está transmitiendo
                        constantemente.
                    </p>


                    <p>
                        En lugar de navegar interminablemente
                        entre catálogos, el espectador puede
                        entrar a NeoMotion, encender la señal
                        y descubrir qué está pasando en ese momento.
                    </p>

                </div>

            </section>


            {/* =================================================
                PILARES
            ================================================= */}

            <section className="about-pillars">

                <div className="about-section-heading">

                    <div>

                        <p className="section-label">
                            LA SEÑAL
                        </p>


                        <h2>
                            ASÍ FUNCIONA NEOMOTION
                        </h2>

                    </div>

                </div>


                <div className="about-pillar-grid">


                    {/* =================================================
                        PILAR 01
                    ================================================= */}

                    <article className="about-pillar">

                        <span>
                            01
                        </span>


                        <h3>
                            UN CANAL
                        </h3>


                        <p>
                            NeoMotion está concebido como una
                            única señal de televisión anime.
                            No necesitas escoger entre varios
                            canales: simplemente entras y ves
                            lo que está transmitiéndose.
                        </p>

                    </article>


                    {/* =================================================
                        PILAR 02
                    ================================================= */}

                    <article className="about-pillar">

                        <span>
                            02
                        </span>


                        <h3>
                            PROGRAMACIÓN CONTINUA
                        </h3>


                        <p>
                            Series, episodios, promociones,
                            cortinillas y contenidos especiales
                            se organizan como una verdadera
                            parrilla de televisión.
                        </p>

                    </article>


                    {/* =================================================
                        PILAR 03
                    ================================================= */}

                    <article className="about-pillar">

                        <span>
                            03
                        </span>


                        <h3>
                            EXPERIENCIA RETRO
                        </h3>


                        <p>
                            La identidad visual busca recordar
                            los canales de anime y televisión
                            que marcaron los años 2000 y épocas
                            anteriores.
                        </p>

                    </article>

                </div>

            </section>


            {/* =================================================
                EXPERIENCIA
            ================================================= */}

            <section className="about-experience">

                <div className="about-experience-copy">

                    <p className="section-label">
                        MÁS QUE UN CATÁLOGO
                    </p>


                    <h2>
                        LA TELEVISIÓN
                        <br />
                        COMO EXPERIENCIA.
                    </h2>


                    <p>
                        NeoMotion no busca sentirse como una
                        biblioteca de videos. La intención es
                        construir una señal con identidad propia:
                        horarios, continuidad, promociones,
                        bloques y una programación que avanza
                        aunque el espectador simplemente se siente
                        a mirar.
                    </p>

                </div>


                <div className="about-experience-mark">

                    <div className="about-circle about-circle-one">
                    </div>


                    <div className="about-circle about-circle-two">
                    </div>


                    <div className="about-experience-logo">

                        NEO

                        <span>
                            MOTION
                        </span>

                    </div>


                    <small>
                        ANIME TELEVISION
                        <br />
                        24 / 7
                    </small>

                </div>

            </section>


            {/* =================================================
                COMUNIDAD
            ================================================= */}

            <section className="about-community">

                <div>

                    <p className="section-label">
                        COMUNIDAD
                    </p>


                    <h2>
                        EL CANAL TAMBIÉN
                        <br />
                        LO CONSTRUYEN
                        <br />
                        SUS ESPECTADORES.
                    </h2>

                </div>


                <div className="about-community-copy">

                    <p>
                        NeoMotion también quiere escuchar
                        a quienes forman parte de la comunidad.
                        Por eso los usuarios pueden guardar
                        sus series favoritas y recomendar
                        nuevos títulos para el canal.
                    </p>


                    <div className="about-community-actions">

                        <Link
                            to="/programas"
                            className="about-action-primary"
                        >
                            EXPLORAR PROGRAMAS
                        </Link>


                        <Link
                            to={
                                isAuthenticated
                                    ? "/recomendar"
                                    : "/registro"
                            }
                            className="about-action-secondary"
                        >
                            PARTICIPAR EN NEO MOTION
                        </Link>

                    </div>

                </div>

            </section>


            {/* =================================================
                CIERRE
            ================================================= */}

            <section className="about-final">

                <p className="section-label">
                    NEO MOTION
                </p>


                <h2>
                    ENCIENDE LA SEÑAL.
                    <br />
                    EL ANIME NUNCA TERMINA.
                </h2>


                <div className="about-final-meta">

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


export default AboutPage;