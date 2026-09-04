import {
    useEffect,
    useState
} from "react";

import {
    getAdminNews,
    createNews,
    updateNews,
    deleteNews,
    uploadFile,
    getResourceUrl
} from "../../api/api.js";


function AdminNewsPage() {

    const [
        news,
        setNews
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        saving,
        setSaving
    ] = useState(false);


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
        imageFile,
        setImageFile
    ] = useState(null);


    const [
        form,
        setForm
    ] = useState({
        title: "",
        category: "PROGRAMACIÓN",
        content: "",
        imageUrl: "",
        publishedAt: "",
        active: true
    });


    // =================================================
    // CARGAR
    // =================================================

    useEffect(() => {

        cargarNoticias();

    }, []);


    async function cargarNoticias() {

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
                await getAdminNews(
                    token
                );


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


    // =================================================
    // CAMBIAR FORMULARIO
    // =================================================

    function handleChange(
        event
    ) {

        const {
            name,
            value,
            type,
            checked
        } = event.target;


        setForm(
            previous => ({

                ...previous,

                [name]:
                    type === "checkbox"
                        ? checked
                        : value

            })
        );

    }


    // =================================================
    // EDITAR
    // =================================================

    function iniciarEdicion(
        item
    ) {

        setEditingId(
            item.id
        );


        setForm({

            title:
                item.title || "",

            category:
                item.category || "PROGRAMACIÓN",

            content:
                item.content || "",

            imageUrl:
                item.imageUrl || "",

            publishedAt:
                item.publishedAt
                    ? item.publishedAt.slice(
                        0,
                        16
                    )
                    : "",

            active:
            item.active

        });


        setImageFile(
            null
        );


        setShowForm(
            true
        );


        setError("");

    }


    // =================================================
    // LIMPIAR
    // =================================================

    function limpiarFormulario() {

        setForm({

            title: "",
            category: "PROGRAMACIÓN",
            content: "",
            imageUrl: "",
            publishedAt: "",
            active: true

        });


        setImageFile(
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
    // GUARDAR
    // =================================================

    async function guardarNoticia(
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


            let imageUrl =
                form.imageUrl;


            // =============================================
            // SUBIR IMAGEN
            // =============================================

            if (imageFile) {

                const uploaded =
                    await uploadFile(
                        imageFile,
                        "image",
                        token
                    );


                imageUrl =
                    uploaded.url;

            }


            // =============================================
            // DATOS
            // =============================================

            const newsData = {

                title:
                form.title,

                category:
                form.category,

                content:
                form.content,

                imageUrl:
                    imageUrl || null,

                publishedAt:
                    form.publishedAt
                        ? form.publishedAt
                        : new Date()
                            .toISOString()
                            .slice(
                                0,
                                16
                            ),

                active:
                form.active

            };


            // =============================================
            // CREAR
            // =============================================

            if (!editingId) {

                const created =
                    await createNews(
                        newsData,
                        token
                    );


                setNews(
                    previous => [
                        created,
                        ...previous
                    ]
                );

            }

                // =============================================
                // EDITAR
            // =============================================

            else {

                const updated =
                    await updateNews(
                        editingId,
                        newsData,
                        token
                    );


                setNews(
                    previous =>
                        previous.map(
                            item =>
                                item.id ===
                                editingId

                                    ? updated

                                    : item
                        )
                );

            }


            limpiarFormulario();


        } catch (error) {

            console.error(
                "Error guardando noticia:",
                error
            );


            setError(
                error.message ||
                "No fue posible guardar la noticia."
            );


        } finally {

            setSaving(false);

        }

    }


    // =================================================
    // ELIMINAR
    // =================================================

    async function eliminarNoticia(
        id
    ) {

        const confirmDelete =
            window.confirm(
                "¿Seguro que deseas eliminar esta noticia?"
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


            await deleteNews(
                id,
                token
            );


            setNews(
                previous =>
                    previous.filter(
                        item =>
                            item.id !== id
                    )
            );


        } catch (error) {

            console.error(
                "Error eliminando noticia:",
                error
            );


            setError(
                error.message ||
                "No fue posible eliminar la noticia."
            );

        }

    }


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (

            <main className="admin-page">

                <section className="admin-page-header">

                    <p className="section-label">
                        ADMINISTRACIÓN DE NEOMOTION
                    </p>


                    <h1>
                        NOTICIAS
                    </h1>


                    <p>
                        Cargando noticias...
                    </p>

                </section>

            </main>

        );

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
                    NOTICIAS
                </h1>


                <p>
                    Administra las noticias, novedades
                    y anuncios de NeoMotion.
                </p>

            </section>


            <section className="admin-content">


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <div className="admin-toolbar">

                    <div>

                        <span className="admin-toolbar-label">
                            PUBLICACIONES
                        </span>


                        <strong>
                            {news.length}
                        </strong>


                        <span className="admin-toolbar-count">

                            {
                                news.length === 1
                                    ? " noticia"
                                    : " noticias"
                            }

                        </span>

                    </div>


                    <button
                        type="button"
                        className="admin-primary-button"
                        onClick={() => {

                            if (showForm) {

                                limpiarFormulario();

                            } else {

                                setError("");

                                setEditingId(null);

                                setShowForm(true);

                            }

                        }}
                        disabled={saving}
                    >

                        {showForm
                            ? "CANCELAR"
                            : "+ NUEVA NOTICIA"
                        }

                    </button>

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
                            guardarNoticia
                        }
                        className="admin-news-form"
                    >

                        <div className="admin-news-form-header">

                            <div>

                                <span className="admin-form-label">
                                    {editingId
                                        ? "EDICIÓN"
                                        : "NUEVA PUBLICACIÓN"
                                    }
                                </span>


                                <h2>

                                    {editingId
                                        ? "Editar noticia"
                                        : "Crear noticia"
                                    }

                                </h2>

                            </div>

                        </div>


                        <div className="admin-news-form-grid">


                            {/* =================================================
                                TÍTULO
                            ================================================= */}

                            <div className="admin-field admin-field-full">

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
                                    disabled={saving}
                                />

                            </div>


                            {/* =================================================
                                CATEGORÍA
                            ================================================= */}

                            <div className="admin-field">

                                <label>
                                    CATEGORÍA
                                </label>


                                <select
                                    name="category"
                                    value={
                                        form.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={saving}
                                >

                                    <option value="PROGRAMACIÓN">
                                        PROGRAMACIÓN
                                    </option>

                                    <option value="ESPECIAL">
                                        ESPECIAL
                                    </option>

                                    <option value="NEO MOTION">
                                        NEO MOTION
                                    </option>

                                    <option value="ANUNCIO">
                                        ANUNCIO
                                    </option>

                                </select>

                            </div>


                            {/* =================================================
                                FECHA
                            ================================================= */}

                            <div className="admin-field">

                                <label>
                                    FECHA DE PUBLICACIÓN
                                </label>


                                <input
                                    type="datetime-local"
                                    name="publishedAt"
                                    value={
                                        form.publishedAt
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={saving}
                                />

                            </div>


                            {/* =================================================
                                CONTENIDO
                            ================================================= */}

                            <div className="admin-field admin-field-full">

                                <label>
                                    CONTENIDO
                                </label>


                                <textarea
                                    name="content"
                                    value={
                                        form.content
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="8"
                                    required
                                    disabled={saving}
                                />

                            </div>


                            {/* =================================================
                                IMAGEN
                            ================================================= */}

                            <div className="admin-field admin-field-full">

                                <label>
                                    IMAGEN DE ACOMPAÑAMIENTO
                                </label>


                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={
                                        event =>
                                            setImageFile(
                                                event.target.files[0] ||
                                                null
                                            )
                                    }
                                    disabled={saving}
                                />


                                <p className="admin-field-help">

                                    Utiliza una imagen horizontal
                                    relacionada con la noticia.

                                </p>


                                {editingId &&
                                    form.imageUrl && (

                                        <div className="admin-news-current-image">

                                            <span>
                                                IMAGEN ACTUAL
                                            </span>


                                            <img
                                                src={
                                                    getResourceUrl(
                                                        form.imageUrl
                                                    )
                                                }
                                                alt={
                                                    form.title
                                                }
                                            />

                                        </div>

                                    )}

                            </div>


                            {/* =================================================
                                ESTADO
                            ================================================= */}

                            <div className="admin-news-status">

                                <label>

                                    <input
                                        type="checkbox"
                                        name="active"
                                        checked={
                                            form.active
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={saving}
                                    />


                                    <span>
                                        PUBLICADA
                                    </span>

                                </label>


                                <p>
                                    Si está desactivada,
                                    la noticia no aparecerá
                                    en el contenido público.
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            ACCIONES
                        ================================================= */}

                        <div className="admin-form-actions">

                            <button
                                type="button"
                                className="admin-secondary-button"
                                onClick={
                                    limpiarFormulario
                                }
                                disabled={saving}
                            >
                                CANCELAR
                            </button>


                            <button
                                type="submit"
                                className="admin-primary-button"
                                disabled={saving}
                            >

                                {saving

                                    ? "GUARDANDO..."

                                    : editingId
                                        ? "GUARDAR CAMBIOS"
                                        : "PUBLICAR NOTICIA"

                                }

                            </button>

                        </div>

                    </form>

                )}


                {/* =================================================
                    SIN NOTICIAS
                ================================================= */}

                {!showForm &&
                    news.length === 0 && (

                        <div className="admin-empty-state">

                            <span>
                                SIN NOTICIAS
                            </span>


                            <p>
                                No hay noticias registradas.
                            </p>


                            <button
                                type="button"
                                className="admin-primary-button"
                                onClick={() =>
                                    setShowForm(true)
                                }
                            >
                                + NUEVA NOTICIA
                            </button>

                        </div>

                    )}


                {/* =================================================
                    TABLA
                ================================================= */}

                {!showForm &&
                    news.length > 0 && (

                        <div className="news-admin-table-wrapper">

                            <table className="news-admin-table">

                                <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        NOTICIA
                                    </th>

                                    <th>
                                        CATEGORÍA
                                    </th>

                                    <th>
                                        PUBLICACIÓN
                                    </th>

                                    <th>
                                        ESTADO
                                    </th>

                                    <th>
                                        ACCIONES
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {news.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                item.id
                                            }
                                        >

                                            {/* =================================
                                                    ÍNDICE
                                                ================================= */}

                                            <td className="news-admin-index">

                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}

                                            </td>


                                            {/* =================================
                                                    NOTICIA
                                                ================================= */}

                                            <td className="news-admin-main">

                                                <div className="news-admin-preview">

                                                    {item.imageUrl ? (

                                                        <img
                                                            src={
                                                                getResourceUrl(
                                                                    item.imageUrl
                                                                )
                                                            }
                                                            alt=""
                                                        />

                                                    ) : (

                                                        <div className="news-admin-no-image">
                                                            NEO
                                                        </div>

                                                    )}

                                                </div>


                                                <div>

                                                    <strong>
                                                        {
                                                            item.title
                                                        }
                                                    </strong>


                                                    <p>
                                                        {
                                                            item.content
                                                        }
                                                    </p>

                                                </div>

                                            </td>


                                            {/* =================================
                                                    CATEGORÍA
                                                ================================= */}

                                            <td>

                                                    <span
                                                        className="news-admin-category"
                                                    >
                                                        {
                                                            item.category
                                                        }
                                                    </span>

                                            </td>


                                            {/* =================================
                                                    FECHA
                                                ================================= */}

                                            <td className="news-admin-date">

                                                {
                                                    item.publishedAt
                                                        ? new Date(
                                                            item.publishedAt
                                                        ).toLocaleDateString(
                                                            "es-CO",
                                                            {
                                                                day:
                                                                    "2-digit",

                                                                month:
                                                                    "2-digit",

                                                                year:
                                                                    "numeric"
                                                            }
                                                        )
                                                        : "SIN FECHA"
                                                }

                                            </td>


                                            {/* =================================
                                                    ESTADO
                                                ================================= */}

                                            <td>

                                                    <span
                                                        className={
                                                            item.active
                                                                ? "news-admin-status news-admin-status-active"
                                                                : "news-admin-status news-admin-status-hidden"
                                                        }
                                                    >

                                                        {
                                                            item.active
                                                                ? "PUBLICADA"
                                                                : "OCULTA"
                                                        }

                                                    </span>

                                            </td>


                                            {/* =================================
                                                    ACCIONES
                                                ================================= */}

                                            <td>

                                                <div className="news-admin-actions">

                                                    <button
                                                        type="button"
                                                        className="news-admin-edit"
                                                        onClick={() =>
                                                            iniciarEdicion(
                                                                item
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
                                                        className="news-admin-delete"
                                                        onClick={() =>
                                                            eliminarNoticia(
                                                                item.id
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


export default AdminNewsPage;