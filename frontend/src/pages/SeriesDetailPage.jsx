import {
    useEffect,
    useState
} from "react";

import {
    useParams,
    Link
} from "react-router-dom";

import {
    getSeriesById,
    getSeasonsBySeries,
    getEpisodesBySeason,
    getVideoUrl,
    getResourceUrl
} from "../api/api.js";


function SeriesDetailPage() {

    const { id } = useParams();

    const [serie, setSerie] = useState(null);
    const [seasons, setSeasons] = useState([]);
    const [episodes, setEpisodes] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {

        async function loadSeriesData() {

            try {

                setLoading(true);
                setError(null);


                // =============================================
                // SERIE
                // =============================================

                const seriesData =
                    await getSeriesById(id);

                setSerie(
                    seriesData
                );


                // =============================================
                // TEMPORADAS
                // =============================================

                const seasonsData =
                    await getSeasonsBySeries(id);

                setSeasons(
                    seasonsData
                );


                // =============================================
                // EPISODIOS
                // =============================================

                const episodesData = {};

                for (
                    const season of seasonsData
                    ) {

                    const seasonEpisodes =
                        await getEpisodesBySeason(
                            season.id
                        );

                    episodesData[
                        season.id
                        ] = seasonEpisodes;
                }


                setEpisodes(
                    episodesData
                );


            } catch (error) {

                console.error(
                    "Error obteniendo información de la serie:",
                    error
                );


                setError(
                    error.message ||
                    "No se pudo cargar la información de la serie."
                );


            } finally {

                setLoading(false);

            }

        }


        loadSeriesData();

    }, [id]);


    // =========================
    // CARGANDO
    // =========================

    if (loading) {

        return (

            <main className="series-detail-page">

                <section className="series-detail-message">

                    <p className="section-label">
                        TELEVISIÓN NEOMOTION
                    </p>

                    <h1>
                        Cargando...
                    </h1>

                    <p>
                        Cargando información de la serie.
                    </p>

                </section>

            </main>

        );

    }


    // =========================
    // ERROR
    // =========================

    if (error || !serie) {

        return (

            <main className="series-detail-page">

                <section className="series-detail-message">

                    <p className="section-label">
                        TELEVISIÓN NEOMOTION
                    </p>

                    <h1>
                        Serie no encontrada
                    </h1>

                    <p>
                        No se pudo encontrar la serie solicitada.
                    </p>

                    <Link
                        to="/programas"
                        className="back-button"
                    >
                        Volver a programas
                    </Link>

                </section>

            </main>

        );

    }


    // =========================
    // SERIE
    // =========================

    return (

        <main className="series-detail-page">


            {/* =========================
                INFORMACIÓN DE LA SERIE
            ========================= */}

            <section className="series-detail">


                <div className="series-detail-image">

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


                <div className="series-detail-info">

                    <p className="section-label">

                        {
                            serie.category ||
                            "SERIE"
                        }

                    </p>


                    <h1>

                        {
                            serie.title
                        }

                    </h1>


                    <p className="series-description">

                        {
                            serie.description ||
                            "Sin descripción disponible."
                        }

                    </p>


                    <div className="series-metadata">


                        <div>

                            <span>
                                AÑO
                            </span>

                            <strong>
                                {
                                    serie.releaseYear
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                ESTUDIO
                            </span>

                            <strong>
                                {
                                    serie.studio
                                }
                            </strong>

                        </div>


                    </div>


                    <Link
                        to="/programas"
                        className="back-button"
                    >
                        ← Volver a programas
                    </Link>

                </div>

            </section>


            {/* =========================
                TEMPORADAS Y EPISODIOS
            ========================= */}

            <section className="series-seasons">


                <div className="section-header">

                    <div>

                        <p className="section-label">
                            CONTENIDO
                        </p>

                        <h2>
                            TEMPORADAS
                        </h2>

                    </div>

                </div>


                {seasons.length === 0 ? (

                    <p className="empty-message">

                        Esta serie todavía no tiene
                        temporadas registradas.

                    </p>

                ) : (

                    <div className="seasons-list">

                        {seasons.map(
                            (season) => (

                                <article
                                    className="season-card"
                                    key={season.id}
                                >


                                    <div className="season-header">

                                        <div>

                                            <span>

                                                TEMPORADA{" "}

                                                {
                                                    season.seasonNumber
                                                }

                                            </span>


                                            <h3>

                                                {
                                                    season.title
                                                }

                                            </h3>

                                        </div>

                                    </div>


                                    {season.description && (

                                        <p className="season-description">

                                            {
                                                season.description
                                            }

                                        </p>

                                    )}


                                    <div className="episode-list">


                                        {(episodes[season.id] || []).length === 0 ? (

                                            <p className="empty-message">

                                                No hay episodios registrados.

                                            </p>

                                        ) : (

                                            episodes[season.id].map(
                                                (episode) => (

                                                    <div
                                                        className="episode-card"
                                                        key={episode.id}
                                                    >


                                                        <div className="episode-thumbnail">

                                                            {episode.thumbnail ? (

                                                                <img
                                                                    src={
                                                                        getResourceUrl(
                                                                            episode.thumbnail
                                                                        )
                                                                    }
                                                                    alt={
                                                                        episode.title
                                                                    }
                                                                />

                                                            ) : (

                                                                <span>
                                                                    NEO
                                                                </span>

                                                            )}

                                                        </div>


                                                        <div className="episode-number">

                                                            {
                                                                String(
                                                                    episode.episodeNumber
                                                                ).padStart(
                                                                    2,
                                                                    "0"
                                                                )
                                                            }

                                                        </div>


                                                        <div className="episode-info">

                                                            <h4>

                                                                {
                                                                    episode.title
                                                                }

                                                            </h4>


                                                            <p className="series-description">

                                                                {
                                                                    serie.description ||
                                                                    "Sin descripción disponible."
                                                                }

                                                            </p>


                                                            <span className="episode-duration">

                                                                {
                                                                    episode.durationMinutes
                                                                }

                                                                {" "}min

                                                            </span>

                                                        </div>

                                                    </div>

                                                )
                                            )

                                        )}

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                )}

            </section>

        </main>

    );

}


export default SeriesDetailPage;