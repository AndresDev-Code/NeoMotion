import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    getNews,
    getResourceUrl
} from "../api/api.js";

import {
    useAuth
} from "../context/AuthContext.jsx";

import neoMotionLogo
    from "../assets/neomotion-logo.svg";


function NewsPage() {

    const {
        isAuthenticated,
        logout
    } = useAuth();


    const [
        news,
        setNews
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState(null);


    // =================================================
    // CARGAR NOTICIAS
    // =================================================

    useEffect(() => {

        async function loadNews() {

            try {

                setError(null);


                const data =
                    await getNews();


                setNews(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Error cargando noticias:",
                    error
                );


                setError(
                    error.message ||
                    "No fue posible cargar las noticias."
                );

            } finally {

                setLoading(false);

            }

        }


        loadNews();

    }, []);


    // =================================================
    // FORMATO DE FECHA
    // =================================================

    function formatDate(
        publishedAt
    ) {

        if (!publishedAt) {

            return null;
        }


        const date =
            new Date(
                publishedAt
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return null;
        }


        return date.toLocaleDateString(
            "es-CO",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    }


    return (

        <main className="news-page">


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
                ENCABEZADO
            ================================================= */}

            <section className="news-header">

                <div className="news-header-main">

                    <p className="section-label">
                        NEO MOTION / INFORMACIÓN
                    </p>


                    <h1>
                        NOTICIAS
                    </h1>


                    <p>
                        Novedades, anuncios y noticias
                        relacionadas con la programación
                        de NeoMotion.
                    </p>

                </div>


                <div className="news-header-side">

                    <span>
                        NEO MOTION
                    </span>


                    <strong>
                        24 / 7
                    </strong>


                    <p>
                        Mantente al día con lo que ocurre
                        dentro del canal.
                    </p>

                </div>

            </section>


            {/* =================================================
                CONTENIDO
            ================================================= */}

            <section className="news-content">


                {/* =================================================
                    CARGANDO
                ================================================= */}

                {loading && (

                    <div className="news-state">

                        <span>
                            CARGANDO
                        </span>


                        <p>
                            Preparando las últimas noticias...
                        </p>

                    </div>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {!loading && error && (

                    <div className="news-state news-state-error">

                        <span>
                            AVISO
                        </span>


                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* =================================================
                    SIN NOTICIAS
                ================================================= */}

                {!loading &&
                    !error &&
                    news.length === 0 && (

                        <div className="news-state">

                            <span>
                                SIN NOTICIAS
                            </span>


                            <p>
                                No hay noticias publicadas
                                en este momento.
                            </p>

                        </div>

                    )}


                {/* =================================================
                    NOTICIAS
                ================================================= */}

                {!loading &&
                    !error &&
                    news.length > 0 && (

                        <div className="news-list">

                            {news.map(
                                (
                                    item,
                                    index
                                ) => (

                                    <article
                                        key={
                                            item.id
                                        }
                                        className={
                                            index === 0
                                                ? "news-featured-card"
                                                : "news-card"
                                        }
                                    >


                                        {/* =================================
                                            NÚMERO
                                        ================================= */}

                                        <div className="news-number">

                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}

                                        </div>


                                        {/* =================================
                                            IMAGEN
                                        ================================= */}

                                        {item.imageUrl ? (

                                            <div
                                                className={
                                                    index === 0
                                                        ? "news-featured-image"
                                                        : "news-image"
                                                }
                                            >

                                                <img
                                                    src={
                                                        getResourceUrl(
                                                            item.imageUrl
                                                        )
                                                    }
                                                    alt={
                                                        item.title
                                                    }
                                                />

                                            </div>

                                        ) : (

                                            <div
                                                className={
                                                    index === 0
                                                        ? "news-featured-image news-image-placeholder"
                                                        : "news-image news-image-placeholder"
                                                }
                                            >

                                                <span>
                                                    NEO MOTION
                                                </span>

                                            </div>

                                        )}


                                        {/* =================================
                                            INFORMACIÓN
                                        ================================= */}

                                        <div
                                            className={
                                                index === 0
                                                    ? "news-featured-info"
                                                    : "news-info"
                                            }
                                        >

                                            <div className="news-meta">

                                                <span>
                                                    {
                                                        item.category ||
                                                        "NEO MOTION"
                                                    }
                                                </span>


                                                {formatDate(
                                                    item.publishedAt
                                                ) && (

                                                    <time>

                                                        {
                                                            formatDate(
                                                                item.publishedAt
                                                            )
                                                        }

                                                    </time>

                                                )}

                                            </div>


                                            <h2>
                                                {
                                                    item.title
                                                }
                                            </h2>


                                            <p>
                                                {
                                                    item.content
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
                CIERRE
            ================================================= */}

            <section className="news-footer-section">

                <p className="section-label">
                    NEO MOTION
                </p>


                <h2>
                    EL CANAL SIGUE EN MOVIMIENTO.
                </h2>


                <p>
                    Consulta la programación y descubre
                    lo que viene en NeoMotion.
                </p>


                <div className="news-footer-actions">

                    <Link
                        to="/programacion"
                        className="news-action-primary"
                    >
                        VER PROGRAMACIÓN
                    </Link>


                    <Link
                        to="/programas"
                        className="news-action-secondary"
                    >
                        EXPLORAR PROGRAMAS
                    </Link>

                </div>

            </section>

        </main>
    );
}


export default NewsPage;