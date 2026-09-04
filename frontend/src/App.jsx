import {
    useEffect,
    useState
} from "react";

import "./App.css";

import {
    Link
} from "react-router-dom";

import {
    useAuth
} from "./context/AuthContext.jsx";

import neoMotionLogo
    from "./assets/neomotion-logo.svg";

import {
    getPlaybackState,
    getTodaySchedule,
    getSeries,
    getNews,
    getResourceUrl
} from "./api/api.js";


function App() {

    const {
        isAuthenticated,
        logout
    } = useAuth();


    // =================================================
    // ESTADOS DE REPRODUCCIÓN
    // =================================================

    const [
        currentProgram,
        setCurrentProgram
    ] = useState(null);


    const [
        nextProgram,
        setNextProgram
    ] = useState(null);


    // =================================================
    // PROGRAMACIÓN DEL DÍA
    // =================================================

    const [
        todaySchedule,
        setTodaySchedule
    ] = useState([]);


    // =================================================
    // CARGANDO PROGRAMACIÓN
    // =================================================

    const [
        loadingSchedule,
        setLoadingSchedule
    ] = useState(true);


    const [
        scheduleError,
        setScheduleError
    ] = useState(null);


    // =================================================
    // CARGAR ESTADO DEL CANAL
    // =================================================

    useEffect(() => {

        async function loadChannelState() {

            try {

                setScheduleError(null);


                const [
                    playbackState,
                    today
                ] = await Promise.all([

                    getPlaybackState(),

                    getTodaySchedule()

                ]);


                setCurrentProgram(
                    playbackState.current
                );


                setNextProgram(
                    playbackState.next
                );


                setTodaySchedule(
                    today
                );

            } catch (error) {

                console.error(
                    "Error cargando estado del canal:",
                    error
                );


                setScheduleError(
                    "No fue posible cargar la programación."
                );

            } finally {

                setLoadingSchedule(false);

            }

        }


        // =============================================
        // PRIMERA CARGA
        // =============================================

        loadChannelState();


        // =============================================
        // ACTUALIZAR CADA 5 SEGUNDOS
        // =============================================

        const interval =
            setInterval(
                loadChannelState,
                5000
            );


        return () => {

            clearInterval(interval);

        };

    }, []);


    // =================================================
    // PROGRESO DEL CONTENIDO ACTUAL
    // =================================================

    const totalPlaybackSeconds =
        currentProgram
            ? currentProgram.currentPlaybackSeconds +
            currentProgram.remainingSeconds
            : 0;


    const playbackProgress =
        totalPlaybackSeconds > 0

            ? (
            currentProgram.currentPlaybackSeconds /
            totalPlaybackSeconds
        ) * 100

            : 0;


    // =================================================
    // SERIES
    // =================================================

    const [
        series,
        setSeries
    ] = useState([]);


    const [
        loadingSeries,
        setLoadingSeries
    ] = useState(true);


    const [
        seriesError,
        setSeriesError
    ] = useState(null);


    useEffect(() => {

        async function loadSeries() {

            try {

                setLoadingSeries(true);


                const data =
                    await getSeries();


                setSeries(data);

            } catch (error) {

                console.error(
                    "Error cargando series:",
                    error
                );


                setSeriesError(
                    "No fue posible cargar las series."
                );

            } finally {

                setLoadingSeries(false);

            }

        }


        loadSeries();

    }, []);


    // =================================================
    // NOTICIAS
    // =================================================

    const [
        news,
        setNews
    ] = useState([]);


    const [
        loadingNews,
        setLoadingNews
    ] = useState(true);


    const [
        newsError,
        setNewsError
    ] = useState(null);


    useEffect(() => {

        async function loadNews() {

            try {

                setLoadingNews(true);

                setNewsError(null);


                const data =
                    await getNews();


                setNews(
                    data
                );

            } catch (error) {

                console.error(
                    "Error cargando noticias:",
                    error
                );


                setNewsError(
                    "No fue posible cargar las noticias."
                );

            } finally {

                setLoadingNews(false);

            }

        }


        loadNews();

    }, []);


    // =================================================
    // SERIES DESTACADAS
    // =================================================

    const featuredSeries =
        series.slice(
            0,
            3
        );


    // =================================================
    // PROGRAMACIÓN PÚBLICA
    // =================================================

    const publicSchedule =
        todaySchedule.filter(
            schedule =>
                schedule.contentType ===
                "EPISODE"
        );


    // =================================================
    // PRÓXIMOS PROGRAMAS PARA RESUMEN
    // =================================================

    let upcomingPrograms = [];


    if (
        currentProgram &&
        currentProgram.scheduleId
    ) {

        const currentIndex =
            publicSchedule.findIndex(
                schedule =>
                    schedule.id ===
                    currentProgram.scheduleId
            );


        if (
            currentIndex >= 0
        ) {

            upcomingPrograms =
                publicSchedule.slice(
                    currentIndex + 1,
                    currentIndex + 4
                );

        } else {

            upcomingPrograms =
                publicSchedule.slice(
                    0,
                    3
                );
        }

    } else {

        upcomingPrograms =
            publicSchedule.slice(
                0,
                3
            );
    }


    // =================================================
    // ÚLTIMAS NOTICIAS PARA HOME
    // =================================================

    const latestNews =
        news.slice(
            0,
            2
        );

    // =================================================
    // PRÓXIMO PROGRAMA VISIBLE PARA EL USUARIO
    // =================================================

    const nextVisibleProgram =
        upcomingPrograms.length > 0
            ? upcomingPrograms[0]
            : null;


    return (

        <div className="app">


            {/* =================================================
                NAVBAR
            ================================================= */}

            <header className="navbar">

                <Link
                    to="/"
                    className="logo"
                >

                    <img
                        src={neoMotionLogo}
                        alt="NeoMotion"
                    />

                </Link>


                <nav className="nav-menu">

                    <Link to="/">
                        Inicio
                    </Link>


                    <Link
                        to="/en-vivo"
                        className="nav-live-link"
                    >
                        <span className="nav-live-dot"></span>
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


                    <Link
                        to="/donaciones"
                        className="nav-support-link"
                    >
                        <span className="nav-support-mark"></span>
                        Apoya NeoMotion
                    </Link>

                </nav>


                <div className="nav-right">

                    <span className="live-indicator">
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


            <main>


                {/* =================================================
                    HERO
                ================================================= */}

                <section
                    id="inicio"
                    className="hero"
                >


                    {/* =================================================
                        TEXTO PRINCIPAL
                    ================================================= */}

                    <div className="hero-content">

                        <p className="hero-label">
                            NEO MOTION PRESENTA
                        </p>


                        <h1>

                            EL ANIME

                            <br />

                            NUNCA TERMINA

                        </h1>


                        <p className="hero-description">

                            Un canal de anime transmitiendo
                            programación las 24 horas,
                            los 7 días de la semana.

                        </p>


                        <div className="hero-buttons">

                            <Link
                                to="/en-vivo"
                                className="btn-primary"
                            >
                                <span className="button-live-dot"></span>
                                Ver canal en vivo
                            </Link>


                            <Link
                                to="/programacion"
                                className="btn-secondary"
                            >

                                Ver programación

                            </Link>

                        </div>

                    </div>


                    {/* =================================================
                        MONITOR DE TELEVISIÓN
                    ================================================= */}

                    <div className="hero-tv">

                        <div className="hero-tv-frame">


                            {/* =================================================
                                CABECERA DEL MONITOR
                            ================================================= */}

                            <div className="hero-tv-topbar">

                                <span>
                                    NEO MOTION
                                </span>


                                <span className="hero-tv-live">

                                    ● ON AIR

                                </span>

                            </div>


                            {/* =================================================
                                PANTALLA
                            ================================================= */}

                            <div className="hero-tv-screen">


                                {currentProgram ? (

                                    <>

                                        <div className="hero-tv-channel">

                                            NEO MOTION

                                        </div>


                                        <div className="hero-tv-status">

                                            ● EN VIVO

                                        </div>


                                        <div className="hero-tv-title">

                                            {
                                                currentProgram.title
                                            }

                                        </div>


                                        <div className="hero-tv-type">

                                            {
                                                currentProgram.contentType ===
                                                "EPISODE"

                                                    ? "EPISODIO"

                                                    : "CONTENIDO ESPECIAL"

                                            }

                                        </div>


                                        <div className="hero-tv-time">

                                            <span>

                                                {
                                                    currentProgram
                                                        .startTime
                                                        ?.slice(0, 5)
                                                }

                                            </span>


                                            <div className="hero-tv-progress">

                                                <div
                                                    className="hero-tv-progress-fill"
                                                    style={{
                                                        width:
                                                            `${Math.min(
                                                                Math.max(
                                                                    playbackProgress,
                                                                    0
                                                                ),
                                                                100
                                                            )}%`
                                                    }}
                                                />

                                            </div>


                                            <span>

                                                {
                                                    currentProgram
                                                        .endTime
                                                        ?.slice(0, 5)
                                                }

                                            </span>

                                        </div>

                                    </>

                                ) : (

                                    <>

                                        <div className="hero-tv-channel">

                                            NEO MOTION

                                        </div>


                                        <div className="hero-tv-status">

                                            ● STANDBY

                                        </div>


                                        <div className="hero-tv-title">

                                            SIN TRANSMISIÓN

                                        </div>


                                        {nextProgram && (

                                            <div className="hero-tv-next">

                                                PRÓXIMO

                                                <strong>

                                                    {
                                                        nextProgram.title
                                                    }

                                                </strong>

                                                <span>

                                                    {
                                                        nextProgram
                                                            .startTime
                                                            ?.slice(0, 5)
                                                    }

                                                </span>

                                            </div>

                                        )}

                                    </>

                                )}


                                {/* =================================================
                                    SCANLINES DEL MONITOR
                                ================================================= */}

                                <div className="hero-tv-scanlines">
                                </div>

                            </div>


                            {/* =================================================
                                PIE DEL MONITOR
                            ================================================= */}

                            <div className="hero-tv-bottom">

                                <span>
                                    ANIME TELEVISION
                                </span>


                                <strong>
                                    24 / 7
                                </strong>

                            </div>

                        </div>


                        {/* =================================================
                            MARCA DECORATIVA
                        ================================================= */}

                        <div className="hero-tv-caption">

                            NEO MOTION

                            <span>
                                TV
                            </span>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    DESTACADOS
                ================================================= */}

                <div className="hero-featured-strip">

                    <div className="hero-strip-header">

                        <div>

                            <span className="hero-strip-label">

                                DESTACADOS DE NEO MOTION

                            </span>


                            <h2>

                                EN PROGRAMACIÓN

                            </h2>

                        </div>


                        <span className="hero-strip-status">

                            ● 24 / 7

                        </span>

                    </div>


                    <div className="hero-featured-track">

                        {featuredSeries.map(
                            (serie) => (

                                <Link
                                    key={serie.id}
                                    to={`/programas/${serie.id}`}
                                    className="hero-featured-card"
                                >

                                    <div className="hero-featured-image">

                                        {serie.imageUrl ? (

                                            <img
                                                src={
                                                    getResourceUrl(
                                                        serie.imageUrl
                                                    )
                                                }
                                                alt={
                                                    serie.title
                                                }
                                            />
                                        ) : (

                                            <span>
                                                NEO
                                            </span>

                                        )}

                                    </div>


                                    <div className="hero-featured-info">

                                        <span>

                                            {
                                                serie.category ||
                                                "SERIE"
                                            }

                                        </span>


                                        <strong>

                                            {
                                                serie.title
                                            }

                                        </strong>

                                    </div>

                                </Link>

                            )
                        )}

                    </div>

                </div>


                {/* =================================================
                    EN VIVO
                ================================================= */}

                <section
                    id="en-vivo"
                    className="tv-now-section"
                >

                    <div className="tv-now-header">

                        <div>

                            <span className="tv-section-label">

                                ● TRANSMISIÓN EN CURSO

                            </span>


                            <h2>

                                AHORA EN NEO MOTION

                            </h2>

                        </div>


                        <Link
                            to="/en-vivo"
                            className="tv-live-link"
                        >

                            VER CANAL EN VIVO →

                        </Link>

                    </div>


                    {loadingSchedule ? (

                        <div className="tv-now-empty">

                            <p>
                                Cargando señal...
                            </p>

                        </div>

                    ) : scheduleError ? (

                        <div className="tv-now-empty">

                            <p>
                                {scheduleError}
                            </p>

                        </div>

                    ) : currentProgram ? (

                        <div className="tv-now-grid">


                            {/* =================================================
                                PROGRAMA ACTUAL
                            ================================================= */}

                            <article
                                className="tv-now-card current"
                            >

                                <div className="tv-now-channel">

                                    <span>
                                        NEO MOTION
                                    </span>

                                    <strong>
                                        24 / 7
                                    </strong>

                                </div>


                                <div className="tv-now-main">

                                    <span className="tv-now-live">

                                        ● AHORA

                                    </span>


                                    <h3>

                                        {currentProgram.title}

                                    </h3>


                                    <p className="tv-now-type">

                                        {
                                            currentProgram.contentType ===
                                            "EPISODE"

                                                ? "EPISODIO"

                                                : "CONTENIDO ESPECIAL"

                                        }

                                    </p>


                                    <div className="tv-now-time">

                                        <strong>

                                            {
                                                currentProgram
                                                    .startTime
                                                    ?.slice(0, 5)
                                            }

                                        </strong>


                                        <div className="tv-time-line">

                                            <div
                                                className="tv-time-progress"
                                                style={{
                                                    width:
                                                        `${Math.min(
                                                            Math.max(
                                                                playbackProgress,
                                                                0
                                                            ),
                                                            100
                                                        )}%`
                                                }}
                                            >
                                            </div>

                                        </div>


                                        <strong>

                                            {
                                                currentProgram
                                                    .endTime
                                                    ?.slice(0, 5)
                                            }

                                        </strong>

                                    </div>

                                </div>

                            </article>


                            {/* =================================================
                                SIGUIENTE
                            ================================================= */}

                            {nextVisibleProgram && (

                                <article className="tv-next-card">

        <span className="tv-next-label">
            DESPUÉS
        </span>


                                    <h3>
                                        {
                                            nextVisibleProgram.seriesTitle ||
                                            nextVisibleProgram.title
                                        }
                                    </h3>


                                    <p>
                                        EPISODIO{" "}

                                        {
                                            nextVisibleProgram.episodeNumber
                                        }

                                        {" — "}

                                        {
                                            nextVisibleProgram.episodeTitle
                                        }
                                    </p>


                                    <div className="tv-next-time">

                                        {
                                            nextVisibleProgram.startTime
                                                ?.slice(0, 5)
                                        }

                                    </div>

                                </article>

                            )}

                        </div>

                    ) : (

                        <div className="tv-now-empty">

                            <span>
                                SIN TRANSMISIÓN
                            </span>


                            <p>

                                En este momento no hay contenido
                                transmitiéndose.

                            </p>


                            {nextVisibleProgram && (

                                <div className="tv-next-fallback">

                                    <small>
                                        PRÓXIMAMENTE
                                    </small>


                                    <strong>
                                        {
                                            nextVisibleProgram.seriesTitle ||
                                            nextVisibleProgram.title
                                        }
                                    </strong>

                                </div>

                            )}

                        </div>

                    )}

                </section>


                {/* =================================================
                    RESUMEN DE PROGRAMACIÓN
                ================================================= */}

                <section
                    id="programacion"
                    className="section schedule-section"
                >

                    <div className="section-header">

                        <div>

                            <p className="section-label">

                                LA PARRILLA DEL CANAL

                            </p>


                            <h2>

                                PROGRAMACIÓN

                            </h2>


                            <p>

                                Un vistazo a las próximas
                                emisiones de hoy.

                            </p>

                        </div>


                        <Link
                            to="/programacion"
                            className="schedule-button"
                        >

                            Ver programación completa

                        </Link>

                    </div>


                    {loadingSchedule ? (

                        <p>

                            Cargando próximas emisiones...

                        </p>

                    ) : publicSchedule.length === 0 ? (

                        <p>

                            No hay programación disponible
                            para hoy.

                        </p>

                    ) : (

                        <div className="schedule-list">

                            {upcomingPrograms.map(
                                (schedule) => (

                                    <div
                                        key={schedule.id}
                                        className="schedule-item"
                                    >

                                        <div className="schedule-time">

                                            <strong>

                                                {
                                                    schedule
                                                        .startTime
                                                        ?.slice(0, 5)
                                                }

                                            </strong>

                                        </div>


                                        <div className="schedule-info">

                                            <strong>

                                                {
                                                    schedule
                                                        .seriesTitle
                                                }

                                            </strong>


                                            <span>

                                                Episodio{" "}

                                                {
                                                    schedule
                                                        .episodeNumber
                                                }

                                                {" — "}

                                                {
                                                    schedule
                                                        .episodeTitle
                                                }

                                            </span>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* =================================================
                    PROGRAMAS
                ================================================= */}

                <section
                    id="programas"
                    className="section programs-section"
                >

                    <div className="section-header">

                        <div>

                            <p className="section-label">

                                EN LA PROGRAMACIÓN

                            </p>


                            <h2>

                                PROGRAMAS

                            </h2>

                        </div>


                        <Link
                            to="/programas"
                            className="schedule-button"
                        >

                            Ver todos los programas

                        </Link>

                    </div>


                    {loadingSeries && (

                        <p>

                            Cargando programas...

                        </p>

                    )}


                    {seriesError && (

                        <p>

                            {seriesError}

                        </p>

                    )}


                    {!loadingSeries &&
                        !seriesError && (

                            <div className="program-grid">

                                {featuredSeries.map(
                                    (serie) => (

                                        <article
                                            key={serie.id}
                                            className="program-card"
                                        >

                                            <div className="program-image">

                                                {serie.imageUrl ? (

                                                    <img
                                                        src={
                                                            getResourceUrl(
                                                                serie.imageUrl
                                                            )
                                                        }
                                                        alt={
                                                            serie.title
                                                        }
                                                    />

                                                ) : (

                                                    <span>

                                                        {serie.title}

                                                    </span>

                                                )}

                                            </div>


                                            <div className="program-content">

                                                <span>

                                                    SERIE

                                                </span>


                                                <h3>

                                                    {serie.title}

                                                </h3>


                                                <p>

                                                    {
                                                        serie.description
                                                    }

                                                </p>

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>

                        )}

                </section>


                {/* =================================================
                    NOTICIAS
                ================================================= */}

                <section
                    id="noticias"
                    className="section news-section"
                >

                    <div className="section-header">

                        <div>

                            <p className="section-label">

                                NEO MOTION

                            </p>


                            <h2>

                                NOTICIAS

                            </h2>


                            <p>

                                Novedades y anuncios
                                de NeoMotion.

                            </p>

                        </div>


                        <Link
                            to="/noticias"
                            className="schedule-button"
                        >

                            Ver todas las noticias

                        </Link>

                    </div>


                    {loadingNews ? (

                        <p>

                            Cargando noticias...

                        </p>

                    ) : newsError ? (

                        <p>

                            {newsError}

                        </p>

                    ) : latestNews.length > 0 ? (

                        <div className="news-grid">

                            {latestNews.map(
                                (item, index) => (

                                    <Link
                                        key={item.id}
                                        to="/noticias"
                                        className="news-card"
                                    >

                                        <div className="news-number">

                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}

                                        </div>


                                        <div className="news-info">

                                            <span>

                                                {
                                                    item.category
                                                }

                                            </span>


                                            <h3>

                                                {
                                                    item.title
                                                }

                                            </h3>


                                            <p>

                                                {
                                                    item.content
                                                }

                                            </p>

                                        </div>

                                    </Link>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="tv-now-empty">

                            <span>

                                SIN NOTICIAS

                            </span>


                            <p>

                                No hay noticias publicadas
                                en este momento.

                            </p>

                        </div>

                    )}

                </section>

            </main>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer
                id="acerca"
                className="footer"
            >

                <div className="footer-brand">

                    <Link
                        to="/"
                        className="logo footer-logo"
                    >

                        <img
                            src={neoMotionLogo}
                            alt="NeoMotion"
                        />

                    </Link>


                    <p>

                        Anime television 24/7.

                    </p>

                </div>


                <div className="footer-links">

                    <div>

                        <h4>
                            CANAL
                        </h4>


                        <Link to="/en-vivo">
                            En vivo
                        </Link>


                        <Link to="/programacion">
                            Programación
                        </Link>


                        <Link to="/programas">
                            Programas
                        </Link>

                    </div>


                    <div>

                        <h4>
                            INFORMACIÓN
                        </h4>


                        <Link to="/noticias">
                            Noticias
                        </Link>


                        <Link to="/acerca">
                            Acerca de NeoMotion
                        </Link>


                        <Link
                            to="/donaciones"
                            className="footer-support-link"
                        >
                            <span className="footer-support-mark"></span>
                            Apoya NeoMotion
                        </Link>


                        <a
                            href="TU_ENLACE_DEL_GRUPO_DE_WHATSAPP"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-community-link"
                        >
                            Comunidad WhatsApp
                        </a>

                    </div>

                </div>


                <div className="footer-bottom">

                    <span>
                        © 2026 NeoMotion
                    </span>


                    <span>
                        Canal de televisión anime 24/7
                    </span>

                </div>

            </footer>

        </div>
    );
}


export default App;