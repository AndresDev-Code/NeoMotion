import {
    useEffect,
    useState
} from "react";

import {
    getMediaContent,
    createMediaContent,
    updateMediaContent,
    deleteMediaContent
} from "../../api/api.js";


function MediaContentPage() {

    // =================================================
    // DATOS
    // =================================================

    const [
        mediaContent,
        setMediaContent
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
        saving,
        setSaving
    ] = useState(false);


    // =================================================
    // FILTRO
    // =================================================

    const [
        filterType,
        setFilterType
    ] = useState("ALL");


    // =================================================
    // ARCHIVOS EXISTENTES
    // =================================================

    const [
        existingThumbnail,
        setExistingThumbnail
    ] = useState("");


    const [
        existingVideoUrl,
        setExistingVideoUrl
    ] = useState("");


    // =================================================
    // FORMULARIO
    // =================================================

    const [
        title,
        setTitle
    ] = useState("");


    const [
        description,
        setDescription
    ] = useState("");


    const [
        type,
        setType
    ] = useState("PROMO");


    const [
        durationSeconds,
        setDurationSeconds
    ] = useState("");


    // =================================================
    // NUEVOS ARCHIVOS
    // =================================================

    const [
        thumbnailFile,
        setThumbnailFile
    ] = useState(null);


    const [
        videoFile,
        setVideoFile
    ] = useState(null);


    // =================================================
    // CARGAR CONTENIDO
    // =================================================

    useEffect(() => {

        async function loadMediaContent() {

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


                const data =
                    await getMediaContent(
                        token
                    );


                setMediaContent(
                    Array.isArray(data)
                        ? data
                        : []
                );


            } catch (error) {

                console.error(
                    "Error cargando contenido multimedia:",
                    error
                );


                setError(
                    error.message ||
                    "No se pudo cargar el contenido multimedia."
                );


            } finally {

                setLoading(false);

            }

        }


        loadMediaContent();

    }, []);


    // =================================================
    // LIMPIAR FORMULARIO
    // =================================================

    function clearForm() {

        setTitle("");

        setDescription("");

        setType(
            "PROMO"
        );

        setDurationSeconds("");

        setThumbnailFile(
            null
        );

        setVideoFile(
            null
        );

        setEditingId(
            null
        );

        setExistingThumbnail("");

        setExistingVideoUrl("");

        setShowForm(
            false
        );

    }


    // =================================================
    // INICIAR EDICIÓN
    // =================================================

    function handleEdit(
        content
    ) {

        setEditingId(
            content.id
        );


        setTitle(
            content.title || ""
        );


        setDescription(
            content.description || ""
        );


        setType(
            content.type || "PROMO"
        );


        setDurationSeconds(
            content.durationSeconds ?? ""
        );


        setExistingThumbnail(
            content.thumbnail || ""
        );


        setExistingVideoUrl(
            content.videoUrl || ""
        );


        setThumbnailFile(
            null
        );


        setVideoFile(
            null
        );


        setError("");

        setShowForm(
            true
        );

    }


    // =================================================
    // GUARDAR
    // =================================================

    async function handleSubmit(
        event
    ) {

        event.preventDefault();

        setError("");

        setSaving(true);


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


            const data = {

                title:
                    title.trim(),

                description:
                    description.trim(),

                type:
                type,

                durationSeconds:
                    Number(
                        durationSeconds
                    )

            };


            let savedContent;


            // =================================================
            // CREAR
            // =================================================

            if (
                !editingId
            ) {

                savedContent =
                    await createMediaContent(
                        data,
                        thumbnailFile,
                        videoFile,
                        token
                    );


                setMediaContent(
                    previousContent => [

                        ...previousContent,

                        savedContent

                    ]
                );


                // =================================================
                // EDITAR
                // =================================================

            } else {

                savedContent =
                    await updateMediaContent(
                        editingId,
                        data,
                        thumbnailFile,
                        videoFile,
                        existingThumbnail,
                        existingVideoUrl,
                        token
                    );


                setMediaContent(
                    previousContent =>
                        previousContent.map(
                            content =>
                                content.id ===
                                editingId

                                    ? savedContent

                                    : content
                        )
                );

            }


            clearForm();


        } catch (error) {

            console.error(
                "Error guardando contenido multimedia:",
                error
            );


            setError(
                error.message ||
                "No fue posible guardar el contenido."
            );


        } finally {

            setSaving(false);

        }

    }


    // =================================================
    // ELIMINAR
    // =================================================

    async function handleDelete(
        id
    ) {

        const confirmDelete =
            window.confirm(
                "¿Estás seguro de que deseas eliminar este contenido multimedia?"
            );


        if (!confirmDelete) {

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


            await deleteMediaContent(
                id,
                token
            );


            setMediaContent(
                previousContent =>
                    previousContent.filter(
                        content =>
                            content.id !== id
                    )
            );


        } catch (error) {

            console.error(
                "Error eliminando contenido multimedia:",
                error
            );


            setError(
                error.message ||
                "No fue posible eliminar el contenido."
            );

        }

    }


    // =================================================
    // FILTRAR
    // =================================================

    const filteredMediaContent =
        filterType === "ALL"

            ? mediaContent

            : mediaContent.filter(
                content =>
                    content.type ===
                    filterType
            );


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
                    CONTENIDO MULTIMEDIA
                </h1>


                <p>
                    Administra promos, comerciales,
                    bumpers y otros contenidos del canal.
                </p>

            </section>


            <section className="admin-content">


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <div className="admin-toolbar">

                    <div>

                        <span className="admin-toolbar-label">
                            CONTENIDOS
                        </span>


                        <strong>
                            {mediaContent.length}
                        </strong>


                        <span className="admin-toolbar-count">

                            {mediaContent.length === 1
                                ? " registro"
                                : " registros"
                            }

                        </span>

                    </div>


                    <div className="media-toolbar-actions">


                        {/* =============================================
                            FILTRO
                        ============================================= */}

                        <select
                            className="media-filter"
                            value={
                                filterType
                            }
                            onChange={
                                event =>
                                    setFilterType(
                                        event.target.value
                                    )
                            }
                        >

                            <option value="ALL">
                                TODOS
                            </option>

                            <option value="PROMO">
                                PROMOS
                            </option>

                            <option value="COMMERCIAL">
                                COMERCIALES
                            </option>

                            <option value="BUMPER">
                                BUMPERS
                            </option>

                            <option value="OTHER">
                                OTROS
                            </option>

                        </select>


                        {/* =============================================
                            NUEVO
                        ============================================= */}

                        <button
                            type="button"
                            className="admin-primary-button"
                            onClick={() => {

                                if (
                                    showForm
                                ) {

                                    clearForm();

                                } else {

                                    setError("");

                                    setShowForm(
                                        true
                                    );

                                }

                            }}
                            disabled={
                                saving
                            }
                        >

                            {showForm
                                ? "CANCELAR"
                                : "+ NUEVO CONTENIDO"
                            }

                        </button>

                    </div>

                </div>


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
                    FORMULARIO
                ================================================= */}

                {showForm && (

                    <form
                        onSubmit={
                            handleSubmit
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
                                        ? "Editar contenido multimedia"
                                        : "Nuevo contenido multimedia"
                                    }

                                </h2>

                            </div>

                        </div>


                        <div className="series-form-grid">


                            {/* =========================================
                                TÍTULO
                            ========================================= */}

                            <div className="admin-field">

                                <label>
                                    TÍTULO
                                </label>


                                <input
                                    type="text"
                                    value={
                                        title
                                    }
                                    onChange={
                                        event =>
                                            setTitle(
                                                event.target.value
                                            )
                                    }
                                    required
                                    disabled={
                                        saving
                                    }
                                />

                            </div>


                            {/* =========================================
                                TIPO
                            ========================================= */}

                            <div className="admin-field">

                                <label>
                                    TIPO
                                </label>


                                <select
                                    value={
                                        type
                                    }
                                    onChange={
                                        event =>
                                            setType(
                                                event.target.value
                                            )
                                    }
                                    disabled={
                                        saving
                                    }
                                >

                                    <option value="PROMO">
                                        PROMO
                                    </option>

                                    <option value="COMMERCIAL">
                                        COMERCIAL
                                    </option>

                                    <option value="BUMPER">
                                        BUMPER
                                    </option>

                                    <option value="OTHER">
                                        OTRO
                                    </option>

                                </select>

                            </div>


                            {/* =========================================
                                DURACIÓN
                            ========================================= */}

                            <div className="admin-field">

                                <label>
                                    DURACIÓN EN SEGUNDOS
                                </label>


                                <input
                                    type="number"
                                    min="1"
                                    value={
                                        durationSeconds
                                    }
                                    onChange={
                                        event =>
                                            setDurationSeconds(
                                                event.target.value
                                            )
                                    }
                                    required
                                    disabled={
                                        saving
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
                                    value={
                                        description
                                    }
                                    onChange={
                                        event =>
                                            setDescription(
                                                event.target.value
                                            )
                                    }
                                    rows={5}
                                    disabled={
                                        saving
                                    }
                                    placeholder="Descripción del contenido..."
                                />

                            </div>


                            {/* =========================================
                                THUMBNAIL ACTUAL
                            ========================================= */}

                            {editingId &&
                                existingThumbnail && (

                                    <div className="media-current-file">

                                        <label>
                                            THUMBNAIL ACTUAL
                                        </label>


                                        <div className="media-preview-image">

                                            <img
                                                src={
                                                    `http://localhost:8080${existingThumbnail}`
                                                }
                                                alt={
                                                    title
                                                }
                                            />

                                        </div>

                                    </div>

                                )}


                            {/* =========================================
                                NUEVA THUMBNAIL
                            ========================================= */}

                            <div className="admin-field">

                                <label>
                                    {editingId
                                        ? "REEMPLAZAR THUMBNAIL"
                                        : "THUMBNAIL"
                                    }
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
                                    required={
                                        !editingId
                                    }
                                    disabled={
                                        saving
                                    }
                                />


                                {thumbnailFile && (

                                    <span className="file-selected">

                                        Seleccionado:
                                        {" "}
                                        {
                                            thumbnailFile.name
                                        }

                                    </span>

                                )}


                                {editingId && (

                                    <span className="file-current">

                                        Déjalo vacío para
                                        conservar la imagen actual.

                                    </span>

                                )}

                            </div>


                            {/* =========================================
                                VIDEO ACTUAL
                            ========================================= */}

                            {editingId &&
                                existingVideoUrl && (

                                    <div className="media-current-file">

                                        <label>
                                            VIDEO ACTUAL
                                        </label>


                                        <div className="media-preview-video">

                                            <video
                                                controls
                                                preload="metadata"
                                            >

                                                <source
                                                    src={
                                                        `http://localhost:8080${existingVideoUrl}`
                                                    }
                                                    type="video/mp4"
                                                />

                                            </video>

                                        </div>

                                    </div>

                                )}


                            {/* =========================================
                                NUEVO VIDEO
                            ========================================= */}

                            <div className="admin-field">

                                <label>
                                    {editingId
                                        ? "REEMPLAZAR VIDEO"
                                        : "VIDEO"
                                    }
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
                                    required={
                                        !editingId
                                    }
                                    disabled={
                                        saving
                                    }
                                />


                                {videoFile && (

                                    <span className="file-selected">

                                        Seleccionado:
                                        {" "}
                                        {
                                            videoFile.name
                                        }

                                    </span>

                                )}


                                {editingId && (

                                    <span className="file-current">

                                        Déjalo vacío para
                                        conservar el video actual.

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
                                    clearForm
                                }
                                disabled={
                                    saving
                                }
                            >
                                CANCELAR
                            </button>


                            <button
                                type="submit"
                                className="admin-primary-button"
                                disabled={
                                    saving
                                }
                            >

                                {saving

                                    ? "GUARDANDO..."

                                    : editingId
                                        ? "GUARDAR CAMBIOS"
                                        : "CREAR CONTENIDO"

                                }

                            </button>

                        </div>

                    </form>

                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <div className="admin-empty-state">

                        <span>
                            CARGANDO
                        </span>


                        <p>
                            Cargando contenido multimedia...
                        </p>

                    </div>

                ) : filteredMediaContent.length === 0 ? (

                    /* =================================================
                       VACÍO
                    ================================================= */

                    <div className="admin-empty-state">

                        <span>
                            {mediaContent.length === 0
                                ? "CATÁLOGO VACÍO"
                                : "SIN RESULTADOS"
                            }
                        </span>


                        <p>

                            {mediaContent.length === 0
                                ? "No hay contenido multimedia registrado."
                                : "No existen contenidos para este filtro."
                            }

                        </p>


                        {mediaContent.length === 0 &&
                            !showForm && (

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

                                    + NUEVO CONTENIDO

                                </button>

                            )}

                    </div>

                ) : (

                    /* =================================================
                       TABLA
                    ================================================= */

                    <div className="media-table-wrapper">

                        <table className="media-table">

                            <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    CONTENIDO
                                </th>

                                <th>
                                    TIPO
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

                            {filteredMediaContent.map(
                                (
                                    content,
                                    index
                                ) => (

                                    <tr
                                        key={
                                            content.id
                                        }
                                    >

                                        {/* =================================
                                                ÍNDICE
                                            ================================= */}

                                        <td className="media-table-index">

                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}

                                        </td>


                                        {/* =================================
                                                CONTENIDO
                                            ================================= */}

                                        <td className="media-table-title">

                                            <strong>

                                                {
                                                    content.title
                                                }

                                            </strong>


                                            {content.description && (

                                                <span>

                                                        {
                                                            content.description
                                                        }

                                                    </span>

                                            )}

                                        </td>


                                        {/* =================================
                                                TIPO
                                            ================================= */}

                                        <td>

                                                <span
                                                    className={
                                                        `media-type media-type-${String(
                                                            content.type || "OTHER"
                                                        ).toLowerCase()}`
                                                    }
                                                >

                                                    {
                                                        content.type ||
                                                        "OTHER"
                                                    }

                                                </span>

                                        </td>


                                        {/* =================================
                                                DURACIÓN
                                            ================================= */}

                                        <td className="media-table-duration">

                                            {
                                                content.durationSeconds
                                            }

                                            {" s"}

                                        </td>


                                        {/* =================================
                                                MULTIMEDIA
                                            ================================= */}

                                        <td>

                                            <div className="media-status-group">

                                                    <span
                                                        className={
                                                            content.thumbnail
                                                                ? "media-status available"
                                                                : "media-status missing"
                                                        }
                                                    >

                                                        IMG
                                                        {" "}
                                                        {
                                                            content.thumbnail
                                                                ? "✓"
                                                                : "—"
                                                        }

                                                    </span>


                                                <span
                                                    className={
                                                        content.videoUrl
                                                            ? "media-status available"
                                                            : "media-status missing"
                                                    }
                                                >

                                                        VID
                                                    {" "}
                                                    {
                                                        content.videoUrl
                                                            ? "✓"
                                                            : "—"
                                                    }

                                                    </span>

                                            </div>

                                        </td>


                                        {/* =================================
                                                ACCIONES
                                            ================================= */}

                                        <td>

                                            <div className="media-actions">

                                                <button
                                                    type="button"
                                                    className="media-edit-button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            content
                                                        )
                                                    }
                                                    disabled={
                                                        saving
                                                    }
                                                >
                                                    EDITAR
                                                </button>


                                                <button
                                                    type="button"
                                                    className="media-delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            content.id
                                                        )
                                                    }
                                                    disabled={
                                                        saving
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


export default MediaContentPage;