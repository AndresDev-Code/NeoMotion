import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    getSeries,
    isFavorite,
    addFavorite,
    removeFavorite,
    getResourceUrl
} from "../api/api.js";

import {
    useAuth
} from "../context/AuthContext.jsx";

import neoMotionLogo
    from "../assets/neomotion-logo.svg";


function ProgramsPage() {

    const navigate =
        useNavigate();


    const {
        isAuthenticated,
        logout
    } = useAuth();


    // =================================================
    // SERIES
    // =================================================

    const [
        series,
        setSeries
    ] = useState([]);


    // =================================================
    // FAVORITOS
    // =================================================

    const [
        favorites,
        setFavorites
    ] = useState({});


    // =================================================
    // CARGANDO
    // =================================================

    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        loadingFavorites,
        setLoadingFavorites
    ] = useState(false);


    // =================================================
    // ERROR
    // =================================================

    const [
        error,
        setError
    ] = useState(null);


    // =================================================
    // CARGAR SERIES
    // =================================================

    useEffect(() => {

        async function loadSeries() {

            try {

                setLoading(true);

                setError(null);


                const data =
                    await getSeries();


                setSeries(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Error obteniendo series:",
                    error
                );


                setError(
                    error.message ||
                    "No se pudieron cargar las series."
                );

            } finally {

                setLoading(false);

            }

        }


        loadSeries();

    }, []);


    // =================================================
    // CARGAR ESTADO DE FAVORITOS
    // =================================================

    useEffect(() => {

        if (
            !isAuthenticated ||
            series.length === 0
        ) {

            setFavorites({});

            return;
        }


        async function loadFavorites() {

            setLoadingFavorites(true);


            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );


                const favoriteEntries =
                    await Promise.all(

                        series.map(
                            async (serie) => {

                                try {

                                    const favorite =
                                        await isFavorite(
                                            serie.id,
                                            token
                                        );


                                    return [
                                        serie.id,
                                        favorite
                                    ];

                                } catch (error) {

                                    console.error(
                                        `Error comprobando favorito ${serie.id}:`,
                                        error
                                    );


                                    return [
                                        serie.id,
                                        false
                                    ];

                                }

                            }
                        )

                    );


                setFavorites(
                    Object.fromEntries(
                        favoriteEntries
                    )
                );

            } finally {

                setLoadingFavorites(
                    false
                );

            }

        }


        loadFavorites();

    }, [
        series,
        isAuthenticated
    ]);


    // =================================================
    // CAMBIAR FAVORITO
    // =================================================

    async function toggleFavorite(
        event,
        seriesId
    ) {

        event.preventDefault();

        event.stopPropagation();


        if (!isAuthenticated) {

            navigate(
                "/login"
            );

            return;
        }


        try {

            const token =
                localStorage.getItem(
                    "token"
                );


            const currentlyFavorite =
                favorites[seriesId] === true;


            if (
                currentlyFavorite
            ) {

                await removeFavorite(
                    seriesId,
                    token
                );


                setFavorites(
                    previous => ({

                        ...previous,

                        [seriesId]:
                            false

                    })
                );


                return;
            }


            await addFavorite(
                seriesId,
                token
            );


            setFavorites(
                previous => ({

                    ...previous,

                    [seriesId]:
                        true

                })
            );


        } catch (error) {

            console.error(
                "Error cambiando favorito:",
                error
            );


            setError(
                error.message ||
                "No fue posible actualizar el favorito."
            );

        }

    }


    // =================================================
    // CARGANDO
    // =================================================

    if (loading) {

        return (

            <main className="programs-page">

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

                </header>


                <section className="programs-header">

                    <p className="section-label">
                        TELEVISIÓN NEOMOTION
                    </p>


                    <h1>
                        PROGRAMAS
                    </h1>


                    <p>
                        Cargando series...
                    </p>

                </section>

            </main>
        );

    }


    // =================================================
    // RENDER
    // =================================================

    return (

        <main className="programs-page">


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


                    <Link to="/en-vivo">
                        <span className="page-live-dot"></span>
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
                HEADER
            ================================================= */}

            <section className="programs-header">

                <p className="section-label">
                    TELEVISIÓN NEOMOTION
                </p>


                <h1>
                    PROGRAMAS
                </h1>


                <p>
                    Descubre las series que forman parte
                    de la programación de NeoMotion.
                </p>

            </section>


            {/* =================================================
                CONTENIDO
            ================================================= */}

            <section className="programs-content">


                {error && (

                    <div className="programs-error">

                        <span>
                            AVISO
                        </span>


                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {series.length > 0 ? (

                    <div className="program-grid">

                        {series.map(
                            (serie) => {

                                const favorite =
                                    favorites[
                                        serie.id
                                        ] === true;


                                return (

                                    <article
                                        key={
                                            serie.id
                                        }
                                        className="program-card"
                                    >


                                        {/* =================================
                                            SERIE
                                        ================================= */}

                                        <Link
                                            to={`/programas/${serie.id}`}
                                            className="program-card-link"
                                        >

                                            <div className="program-image">

                                                {serie.imageUrl ? (

                                                    <img
                                                        src={
                                                            getResourceUrl(serie.imageUrl)
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


                                            <div className="program-content">

                                                <span>

                                                    {
                                                        serie.category ||
                                                        "SERIE"
                                                    }

                                                </span>


                                                <h2>
                                                    {
                                                        serie.title
                                                    }
                                                </h2>


                                                <p>
                                                    {
                                                        serie.description ||
                                                        "Sin descripción disponible."
                                                    }
                                                </p>

                                            </div>

                                        </Link>


                                        {/* =================================
                                            FAVORITO
                                        ================================= */}

                                        <button
                                            type="button"
                                            className={
                                                favorite
                                                    ? "favorite-button active"
                                                    : "favorite-button"
                                            }
                                            onClick={
                                                (event) =>
                                                    toggleFavorite(
                                                        event,
                                                        serie.id
                                                    )
                                            }
                                            disabled={
                                                loadingFavorites
                                            }
                                        >

                                            <span
                                                className={
                                                    favorite
                                                        ? "favorite-mark-small active"
                                                        : "favorite-mark-small"
                                                }
                                            >
                                            </span>


                                            {
                                                favorite

                                                    ? "EN FAVORITOS"

                                                    : isAuthenticated

                                                        ? "AGREGAR A FAVORITOS"

                                                        : "INICIAR SESIÓN PARA GUARDAR"

                                            }

                                        </button>

                                    </article>

                                );

                            }
                        )}

                    </div>

                ) : (

                    <p className="empty-schedule">

                        No hay series disponibles.

                    </p>

                )}

            </section>

        </main>
    );
}


export default ProgramsPage;