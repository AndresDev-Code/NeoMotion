import {
    useEffect,
    useState
} from "react";

import {
    getEpisodes,
    getSeasons,
    uploadFile,
    createEpisode,
    updateEpisode,
    deleteEpisode
} from "../../api/api.js";


function EpisodesPage() {

    // =================================================
    // DATOS
    // =================================================

    const [
        episodes,
        setEpisodes
    ] = useState([]);


    const [
        seasons,
        setSeasons
    ] = useState([]);


    // =================================================
    // ESTADOS
    // =================================================

    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        showForm,
        setShowForm
    ] = useState(false);


    const [
        editingId,
        setEditingId
    ] = useState(null);


    const [
        thumbnailFile,
        setThumbnailFile
    ] = useState(null);


    const [
        videoFile,
        setVideoFile
    ] = useState(null);


    const [
        uploading,
        setUploading
    ] = useState(false);


    // =================================================
    // FORMULARIO
    // =================================================

    const [
        form,
        setForm
    ] = useState({

        episodeNumber: "",
        title: "",
        description: "",
        durationMinutes: "",
        thumbnail: "",
        videoUrl: "",
        seasonId: ""

    });


    // =================================================
    // CARGA INICIAL
    // =================================================

    useEffect(() => {

        async function loadData() {

            try {

                setLoading(true);

                setError("");


                const token =
                    localStorage.getItem(
                        "token"
                    );


                if (!token) {

                    throw new Error(
                        "No hay una sesión activa."
                    );

                }


                const [
                    episodesData,
                    seasonsData
                ] = await Promise.all([

                    getEpisodes(
                        token
                    ),

                    getSeasons(
                        token
                    )

                ]);


                setEpisodes(
                    Array.isArray(episodesData)
                        ? episodesData
                        : []
                );


                setSeasons(
                    Array.isArray(seasonsData)
                        ? seasonsData
                        : []
                );


            } catch (error) {

                console.error(
                    "Error cargando datos:",
                    error
                );


                setError(
                    error.message ||
                    "No fue posible cargar los datos."
                );


            } finally {

                setLoading(
                    false
                );

            }

        }


        loadData();

    }, []);


    // =================================================
    // CAMBIAR FORMULARIO
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
    // EDITAR EPISODIO
    // =================================================

    function iniciarEdicion(
        episode
    ) {

        setEditingId(
            episode.id
        );


        setForm({

            episodeNumber:
                episode.episodeNumber || "",

            title:
                episode.title || "",

            description:
                episode.description || "",

            durationMinutes:
                episode.durationMinutes || "",

            thumbnail:
                episode.thumbnail || "",

            videoUrl:
                episode.videoUrl || "",

            seasonId:
                episode.seasonId || ""

        });


        setThumbnailFile(
            null
        );


        setVideoFile(
            null
        );


        setShowForm(
            true
        );


        setError("");

    }


    // =================================================
    // LIMPIAR FORMULARIO
    // =================================================

    function limpiarFormulario() {

        setForm({

            episodeNumber: "",
            title: "",
            description: "",
            durationMinutes: "",
            thumbnail: "",
            videoUrl: "",
            seasonId: ""

        });


        setThumbnailFile(
            null
        );


        setVideoFile(
            null
        );


        setEditingId(
            null
        );


        setShowForm(
            false
        );


        setError("");

    }


    // =================================================
    // GUARDAR EPISODIO
    // =================================================

    async function guardarEpisode(
        event
    ) {

        event.preventDefault();

        setError("");

        setUploading(true);


        try {

            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                throw new Error(
                    "No hay una sesión activa."
                );

            }


            // =================================================
            // URLs ACTUALES
            // =================================================

            let thumbnailUrl =
                form.thumbnail;


            let videoUrl =
                form.videoUrl;


            // =================================================
            // SUBIR THUMBNAIL
            // =================================================

            if (
                thumbnailFile
            ) {

                const thumbnailData =
                    await uploadFile(
                        thumbnailFile,
                        "image",
                        token
                    );


                thumbnailUrl =
                    thumbnailData.url;

            }


            // =================================================
            // SUBIR VIDEO
            // =================================================

            if (
                videoFile
            ) {

                const videoData =
                    await uploadFile(
                        videoFile,
                        "video",
                        token
                    );


                videoUrl =
                    videoData.url;

            }


            // =================================================
            // DATOS DEL EPISODIO
            // =================================================

            const episodeData = {

                episodeNumber:
                    Number(
                        form.episodeNumber
                    ),

                title:
                    form.title.trim(),

                description:
                    form.description.trim(),

                durationMinutes:
                    Number(
                        form.durationMinutes
                    ),

                thumbnail:
                thumbnailUrl,

                videoUrl:
                videoUrl,

                seasonId:
                    Number(
                        form.seasonId
                    )

            };


            // =================================================
            // CREAR / ACTUALIZAR
            // =================================================

            let savedEpisode;


            if (
                editingId
            ) {

                savedEpisode =
                    await updateEpisode(
                        editingId,
                        episodeData,
                        token
                    );


            } else {

                savedEpisode =
                    await createEpisode(
                        episodeData,
                        token
                    );

            }


            // =================================================
            // ACTUALIZAR LISTA
            // =================================================

            if (
                editingId
            ) {

                setEpisodes(
                    previousEpisodes =>
                        previousEpisodes.map(
                            episode =>
                                episode.id ===
                                editingId

                                    ? savedEpisode

                                    : episode
                        )
                );


            } else {

                setEpisodes(
                    previousEpisodes => [

                        ...previousEpisodes,

                        savedEpisode

                    ]
                );

            }


            limpiarFormulario();


        } catch (error) {

            console.error(
                "Error guardando episodio:",
                error
            );


            setError(
                error.message ||
                "No fue posible guardar el episodio."
            );


        } finally {

            setUploading(
                false
            );

        }

    }


    // =================================================
    // ELIMINAR EPISODIO
    // =================================================

    async function eliminarEpisode(
        id
    ) {

        const confirmar =
            window.confirm(
                "¿Seguro que deseas eliminar este episodio?"
            );


        if (!confirmar) {

            return;

        }


        try {

            setError("");


            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                throw new Error(
                    "No hay una sesión activa."
                );

            }


            await deleteEpisode(
                id,
                token
            );


            setEpisodes(
                previousEpisodes =>
                    previousEpisodes.filter(
                        episode =>
                            episode.id !== id
                    )
            );


        } catch (error) {

            console.error(
                "Error eliminando episodio:",
                error
            );


            setError(
                error.message ||
                "No fue posible eliminar el episodio."
            );

        }

    }


    // =================================================
    // RENDER
    // =================================================

    return (

        <main className="admin-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <section className="admin-page-header">

                <p className="section-label">
                    ADMINISTRACIÓN DE NEOMOTION
                </p>


                <h1>
                    EPISODIOS
                </h1>


                <p>
                    Administra los episodios que forman parte
                    de las temporadas de NeoMotion.
                </p>

            </section>


            <section className="admin-content">


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <div className="admin-toolbar">

                    <div>

                        <span className="admin-toolbar-label">
                            CATÁLOGO
                        </span>


                        <strong>
                            {episodes.length}
                        </strong>


                        <span className="admin-toolbar-count">

                            {episodes.length === 1
                                ? " episodio registrado"
                                : " episodios registrados"
                            }

                        </span>

                    </div>


                    <button
                        type="button"
                        className="admin-primary-button"
                        onClick={() => {

                            if (
                                showForm
                            ) {

                                limpiarFormulario();

                            } else {

                                setError("");

                                setShowForm(
                                    true
                                );

                            }

                        }}
                        disabled={
                            uploading
                        }
                    >

                        {showForm
                            ? "CANCELAR"
                            : "+ NUEVO EPISODIO"
                        }

                    </button>

                </div>


                {/* =================================================
                    FORMULARIO
                ================================================= */}

                {showForm && (

                    <form
                        onSubmit={
                            guardarEpisode
                        }
                        className="series-form"
                    >

                        <div className="series-form-header">

                            <div>

                                <span className="admin-form-label">

                                    {editingId
                                        ? "EDICIÓN"
                                        : "NUEVO REGISTRO"
                                    }

                                </span>


                                <h2>

                                    {editingId
                                        ? "Editar episodio"
                                        : "Nuevo episodio"
                                    }

                                </h2>

                            </div>

                        </div>


                        <div className="series-form-grid">


                            {/* =========================================
                                TEMPORADA
                            ========================================= */}

                            <div className="admin-field admin-field-full">

                                <label>
                                    TEMPORADA
                                </label>


                                <select
                                    name="seasonId"
                                    value={
                                        form.seasonId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    disabled={
                                        uploading
                                    }
                                >

                                    <option value="">
                                        Selecciona una temporada
                                    </option>


                                    {seasons.map(
                                        season => (

                                            <option
                                                key={
                                                    season.id
                                                }
                                                value={
                                                    season.id
                                                }
                                            >

                                                {
                                                    season.seriesTitle
                                                }

                                                {" — "}

                                                {
                                                    season.title ||
                                                    `Temporada ${season.seasonNumber}`
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* =========================================
                                NÚMERO
                            ========================================= */}

                            <div className="admin-field">

                                <label>
                                    NÚMERO DE EPISODIO
                                </label>


                                <input
                                    type="number"
                                    name="episodeNumber"
                                    min="1"
                                    value={
                                        form.episodeNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    disabled={
                                        uploading
                                    }
                                />

                            </div>


                            {/* =========================================
                                TÍTULO
                            ========================================= */}

                            <div className="admin-field">

                                <label>
                                    TÍTULO
                                </label>


                                <input
                                    type="text"
                                    name="title"
                                    value={
                                        form.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    disabled={
                                        uploading
                                    }
                                />

                            </div>


                            {/* =========================================
                                DURACIÓN
                            ========================================= */}

                            <div className="admin-field">

                                <label>
                                    DURACIÓN EN MINUTOS
                                </label>


                                <input
                                    type="number"
                                    name="durationMinutes"
                                    min="1"
                                    value={
                                        form.durationMinutes
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    disabled={
                                        uploading
                                    }
                                />

                            </div>


                            {/* =========================================
                                DESCRIPCIÓN
                            ========================================= */}

                            <div className="admin-field admin-field-full">

                                <label>
                                    DESCRIPCIÓN
                                </label>


                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows={5}
                                    disabled={
                                        uploading
                                    }
                                    placeholder="Descripción del episodio..."
                                />

                            </div>


                            {/* =========================================
                                THUMBNAIL
                            ========================================= */}

                            <div className="admin-field">

                                <label>
                                    THUMBNAIL
                                </label>


                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={
                                        event =>
                                            setThumbnailFile(
                                                event.target.files[0] ||
                                                null
                                            )
                                    }
                                    disabled={
                                        uploading
                                    }
                                />


                                {thumbnailFile && (

                                    <span className="file-selected">

                                        Seleccionado:
                                        {" "}
                                        {thumbnailFile.name}

                                    </span>

                                )}


                                {!thumbnailFile &&
                                    editingId &&
                                    form.thumbnail && (

                                        <span className="file-current">

                                            Imagen actual
                                            disponible

                                        </span>

                                    )}

                            </div>


                            {/* =========================================
                                VIDEO
                            ========================================= */}

                            <div className="admin-field">

                                <label>
                                    VIDEO DEL EPISODIO
                                </label>


                                <input
                                    type="file"
                                    accept="video/mp4,video/webm"
                                    onChange={
                                        event =>
                                            setVideoFile(
                                                event.target.files[0] ||
                                                null
                                            )
                                    }
                                    disabled={
                                        uploading
                                    }
                                />


                                {videoFile && (

                                    <span className="file-selected">

                                        Seleccionado:
                                        {" "}
                                        {videoFile.name}

                                    </span>

                                )}


                                {!videoFile &&
                                    editingId &&
                                    form.videoUrl && (

                                        <span className="file-current">

                                            Video actual
                                            disponible

                                        </span>

                                    )}

                            </div>

                        </div>


                        {/* =================================================
                            ACCIONES
                        ================================================= */}

                        <div className="series-form-actions">

                            <button
                                type="button"
                                className="admin-secondary-button"
                                onClick={
                                    limpiarFormulario
                                }
                                disabled={
                                    uploading
                                }
                            >
                                CANCELAR
                            </button>


                            <button
                                type="submit"
                                className="admin-primary-button"
                                disabled={
                                    uploading
                                }
                            >

                                {uploading

                                    ? "SUBIENDO ARCHIVOS..."

                                    : editingId
                                        ? "GUARDAR CAMBIOS"
                                        : "CREAR EPISODIO"

                                }

                            </button>

                        </div>

                    </form>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="admin-message admin-message-error">

                        <span>
                            AVISO
                        </span>


                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* =================================================
                    CARGANDO / VACÍO / TABLA
                ================================================= */}

                {loading ? (

                    <div className="admin-empty-state">

                        <span>
                            CARGANDO
                        </span>


                        <p>
                            Cargando episodios...
                        </p>

                    </div>

                ) : episodes.length === 0 ? (

                    <div className="admin-empty-state">

                        <span>
                            CATÁLOGO VACÍO
                        </span>


                        <p>
                            No hay episodios registrados.
                        </p>


                        {!showForm && (

                            <button
                                type="button"
                                className="admin-primary-button"
                                onClick={() => {

                                    setError("");

                                    setShowForm(
                                        true
                                    );

                                }}
                            >
                                + NUEVO EPISODIO
                            </button>

                        )}

                    </div>

                ) : (

                    <div className="episodes-table-wrapper">

                        <table className="episodes-table">

                            <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    SERIE / TEMPORADA
                                </th>

                                <th>
                                    EPISODIO
                                </th>

                                <th>
                                    TÍTULO
                                </th>

                                <th>
                                    DURACIÓN
                                </th>

                                <th>
                                    MULTIMEDIA
                                </th>

                                <th>
                                    ACCIONES
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {episodes.map(
                                (
                                    episode,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            episode.id
                                        }
                                    >

                                        {/* =================================
                                                ÍNDICE
                                            ================================= */}

                                        <td className="episodes-table-index">

                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}

                                        </td>


                                        {/* =================================
                                                SERIE / TEMPORADA
                                            ================================= */}

                                        <td className="episodes-table-series">

                                            <strong>

                                                {
                                                    episode.seriesTitle ||
                                                    "Serie"
                                                }

                                            </strong>


                                            <span>

                                                    {
                                                        episode.seasonTitle ||
                                                        "Temporada"
                                                    }

                                                </span>

                                        </td>


                                        {/* =================================
                                                NÚMERO
                                            ================================= */}

                                        <td className="episodes-table-number">

                                            EP.{" "}

                                            {
                                                episode.episodeNumber
                                            }

                                        </td>


                                        {/* =================================
                                                TÍTULO
                                            ================================= */}

                                        <td className="episodes-table-title">

                                            <strong>
                                                {
                                                    episode.title
                                                }
                                            </strong>


                                            {episode.description && (

                                                <span>
                                                        {
                                                            episode.description
                                                        }
                                                    </span>

                                            )}

                                        </td>


                                        {/* =================================
                                                DURACIÓN
                                            ================================= */}

                                        <td className="episodes-table-duration">

                                            {
                                                episode.durationMinutes
                                            }

                                            {" min"}

                                        </td>


                                        {/* =================================
                                                MULTIMEDIA
                                            ================================= */}

                                        <td className="episodes-table-media">

                                                <span
                                                    className={
                                                        episode.thumbnail
                                                            ? "media-status available"
                                                            : "media-status missing"
                                                    }
                                                >

                                                    IMG
                                                    {" "}
                                                    {
                                                        episode.thumbnail
                                                            ? "✓"
                                                            : "—"
                                                    }

                                                </span>


                                            <span
                                                className={
                                                    episode.videoUrl
                                                        ? "media-status available"
                                                        : "media-status missing"
                                                }
                                            >

                                                    VID
                                                {" "}
                                                {
                                                    episode.videoUrl
                                                        ? "✓"
                                                        : "—"
                                                }

                                                </span>

                                        </td>


                                        {/* =================================
                                                ACCIONES
                                            ================================= */}

                                        <td>

                                            <div className="episode-actions">

                                                <button
                                                    type="button"
                                                    className="episode-edit-button"
                                                    onClick={() =>
                                                        iniciarEdicion(
                                                            episode
                                                        )
                                                    }
                                                    disabled={
                                                        uploading
                                                    }
                                                >
                                                    EDITAR
                                                </button>


                                                <button
                                                    type="button"
                                                    className="episode-delete-button"
                                                    onClick={() =>
                                                        eliminarEpisode(
                                                            episode.id
                                                        )
                                                    }
                                                    disabled={
                                                        uploading
                                                    }
                                                >
                                                    ELIMINAR
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </main>
    );
}


export default EpisodesPage;