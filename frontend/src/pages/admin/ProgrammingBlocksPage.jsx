import {
    useEffect,
    useState
} from "react";

import {
    getProgrammingBlocks,
    getEpisodes,
    getMediaContent,
    createProgrammingBlock,
    updateProgrammingBlock,
    deleteProgrammingBlock,
    getProgrammingBlockSchedules,
    previewProgrammingBlockRepeat,
    repeatProgrammingBlock
} from "../../api/api.js";

function ProgrammingBlocksPage() {

    // =================================================
    // DATOS
    // =================================================

    const [
        blocks,
        setBlocks
    ] = useState([]);


    const [
        episodes,
        setEpisodes
    ] = useState([]);


    const [
        mediaContent,
        setMediaContent
    ] = useState([]);


    // =================================================
    // ESTADOS GENERALES
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
        success,
        setSuccess
    ] = useState("");


    // =================================================
    // FORMULARIO BLOQUE
    // =================================================

    const [
        showBlockForm,
        setShowBlockForm
    ] = useState(false);


    const [
        editingId,
        setEditingId
    ] = useState(null);


    const [
        saving,
        setSaving
    ] = useState(false);


    const [
        blockForm,
        setBlockForm
    ] = useState({
        name: "",
        description: "",
        items: []
    });


    // =================================================
    // FORMULARIO PROGRAMACIÓN
    // =================================================

    const [
        showScheduleForm,
        setShowScheduleForm
    ] = useState(false);


    const [
        scheduling,
        setScheduling
    ] = useState(false);


    const [
        scheduleForm,
        setScheduleForm
    ] = useState({
        blockId: "",
        startDate: "",
        endDate: "",
        startTime: "",
        daysOfWeek: []
    });


    // =================================================
    // PREVISUALIZACIÓN
    // =================================================

    const [
        preview,
        setPreview
    ] = useState(null);


    const [
        previewing,
        setPreviewing
    ] = useState(false);


    const [
        showPreview,
        setShowPreview
    ] = useState(false);


    // =================================================
    // EMISIONES DEL BLOQUE
    // =================================================

    const [
        showBlockSchedules,
        setShowBlockSchedules
    ] = useState(false);


    const [
        selectedBlock,
        setSelectedBlock
    ] = useState(null);


    const [
        blockSchedules,
        setBlockSchedules
    ] = useState([]);


    const [
        loadingBlockSchedules,
        setLoadingBlockSchedules
    ] = useState(false);


    // =================================================
    // CARGAR DATOS
    // =================================================

    useEffect(() => {

        cargarDatos();

    }, []);


    async function cargarDatos() {

        setLoading(true);
        setError("");

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


            const [
                blocksData,
                episodesData,
                mediaData
            ] = await Promise.all([

                getProgrammingBlocks(
                    token
                ),

                getEpisodes(
                    token
                ),

                getMediaContent(
                    token
                )

            ]);


            setBlocks(
                blocksData
            );


            setEpisodes(
                episodesData
            );


            setMediaContent(
                mediaData
            );


        } catch (error) {

            console.error(
                "Error cargando datos de bloques:",
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


    // =================================================
    // CAMBIAR INFORMACIÓN DEL BLOQUE
    // =================================================

    function handleBlockChange(
        event
    ) {

        const {
            name,
            value
        } = event.target;


        setBlockForm(
            previous => ({

                ...previous,

                [name]:
                value

            })
        );
    }


    // =================================================
    // AGREGAR ITEM
    // =================================================

    function agregarItem() {

        setBlockForm(
            previous => ({

                ...previous,

                items: [

                    ...previous.items,

                    {
                        position:
                            previous.items.length + 1,

                        contentType:
                            "EPISODE",

                        episodeId:
                            "",

                        mediaContentId:
                            "",

                        contentStartOffset:
                            0,

                        contentEndOffset:
                            ""
                    }

                ]

            })
        );
    }


    // =================================================
    // ELIMINAR ITEM
    // =================================================

    function eliminarItem(
        index
    ) {

        setBlockForm(
            previous => {

                const items =
                    previous.items
                        .filter(
                            (_, itemIndex) =>
                                itemIndex !== index
                        )
                        .map(
                            (
                                item,
                                itemIndex
                            ) => ({

                                ...item,

                                position:
                                    itemIndex + 1

                            })
                        );


                return {

                    ...previous,

                    items

                };

            }
        );
    }


    // =================================================
    // MOVER ITEM ARRIBA
    // =================================================

    function moverItemArriba(
        index
    ) {

        if (
            index === 0
        ) {

            return;
        }


        setBlockForm(
            previous => {

                const items =
                    [...previous.items];


                [
                    items[index - 1],
                    items[index]
                ] = [

                    items[index],
                    items[index - 1]

                ];


                const reordered =
                    items.map(
                        (
                            item,
                            itemIndex
                        ) => ({

                            ...item,

                            position:
                                itemIndex + 1

                        })
                    );


                return {

                    ...previous,

                    items:
                    reordered

                };

            }
        );
    }


    // =================================================
    // MOVER ITEM ABAJO
    // =================================================

    function moverItemAbajo(
        index
    ) {

        if (
            index ===
            blockForm.items.length - 1
        ) {

            return;
        }


        setBlockForm(
            previous => {

                const items =
                    [...previous.items];


                [
                    items[index],
                    items[index + 1]
                ] = [

                    items[index + 1],
                    items[index]

                ];


                const reordered =
                    items.map(
                        (
                            item,
                            itemIndex
                        ) => ({

                            ...item,

                            position:
                                itemIndex + 1

                        })
                    );


                return {

                    ...previous,

                    items:
                    reordered

                };

            }
        );
    }


    // =================================================
    // CAMBIAR ITEM
    // =================================================

    function handleItemChange(
        index,
        field,
        value
    ) {

        setBlockForm(
            previous => {

                const items =
                    [...previous.items];


                items[index] = {

                    ...items[index],

                    [field]:
                    value

                };


                return {

                    ...previous,

                    items

                };

            }
        );
    }


    // =================================================
    // CAMBIAR TIPO DEL ITEM
    // =================================================

    function cambiarTipoItem(
        index,
        contentType
    ) {

        setBlockForm(
            previous => {

                const items =
                    [...previous.items];


                items[index] = {

                    ...items[index],

                    contentType,

                    episodeId:
                        "",

                    mediaContentId:
                        "",

                    contentStartOffset:
                        0,

                    contentEndOffset:
                        ""

                };


                return {

                    ...previous,

                    items

                };

            }
        );
    }


    // =================================================
    // EDITAR BLOQUE
    // =================================================

    function editarBloque(
        block
    ) {

        setError("");

        setSuccess("");


        const items =
            block.items.map(
                item => ({

                    position:
                    item.position,

                    contentType:
                    item.contentType,

                    episodeId:
                        item.episodeId
                            ? String(
                                item.episodeId
                            )
                            : "",

                    mediaContentId:
                        item.mediaContentId
                            ? String(
                                item.mediaContentId
                            )
                            : "",

                    contentStartOffset:
                        item.contentStartOffset ??
                        0,

                    contentEndOffset:
                        item.contentEndOffset ??
                        ""

                })
            );


        setBlockForm({

            name:
                block.name || "",

            description:
                block.description || "",

            items

        });


        setEditingId(
            block.id
        );


        setShowBlockForm(
            true
        );


        setShowScheduleForm(
            false
        );


        setShowPreview(
            false
        );


        setShowBlockSchedules(
            false
        );


        setSelectedBlock(
            null
        );


        setBlockSchedules(
            []
        );


        setPreview(
            null
        );
    }


    // =================================================
    // NUEVO BLOQUE
    // =================================================

    function nuevoBloque() {

        setError("");

        setSuccess("");


        setEditingId(
            null
        );


        setBlockForm({

            name: "",

            description: "",

            items: []

        });


        setShowBlockForm(
            true
        );


        setShowScheduleForm(
            false
        );


        setShowPreview(
            false
        );


        setShowBlockSchedules(
            false
        );


        setSelectedBlock(
            null
        );


        setBlockSchedules(
            []
        );


        setPreview(
            null
        );
    }


    // =================================================
    // GUARDAR BLOQUE
    // =================================================

    async function guardarBloque(
        event
    ) {

        event.preventDefault();

        setError("");

        setSuccess("");


        // =================================================
        // VALIDAR ITEMS
        // =================================================

        if (
            blockForm.items.length === 0
        ) {

            setError(
                "El bloque debe tener al menos un elemento."
            );

            return;
        }


        setSaving(
            true
        );


        try {

            // =================================================
            // TOKEN
            // =================================================

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
            // CONSTRUIR ITEMS
            // =================================================

            const items =
                blockForm.items.map(
                    (
                        item,
                        index
                    ) => ({

                        position:
                            index + 1,

                        episodeId:
                            item.contentType ===
                            "EPISODE"

                                ? Number(
                                    item.episodeId
                                )

                                : null,

                        mediaContentId:
                            item.contentType ===
                            "MEDIA_CONTENT"

                                ? Number(
                                    item.mediaContentId
                                )

                                : null,

                        contentStartOffset:
                            item.contentStartOffset !==
                            ""

                                ? Number(
                                    item.contentStartOffset
                                )

                                : null,

                        contentEndOffset:
                            item.contentEndOffset !==
                            ""

                                ? Number(
                                    item.contentEndOffset
                                )

                                : null

                    })
                );


            // =================================================
            // BODY
            // =================================================

            const body = {

                name:
                blockForm.name,

                description:
                blockForm.description,

                items
            };


            // =================================================
            // GUARDAR
            // =================================================

            let savedBlock;


            // =================================================
            // EDITAR
            // =================================================

            if (
                editingId
            ) {

                savedBlock =
                    await updateProgrammingBlock(
                        editingId,
                        body,
                        token
                    );


                // =================================================
                // CREAR
                // =================================================

            } else {

                savedBlock =
                    await createProgrammingBlock(
                        body,
                        token
                    );
            }


            // =================================================
            // ACTUALIZAR LISTA
            // =================================================

            if (
                editingId
            ) {

                setBlocks(
                    previous =>
                        previous.map(
                            block =>
                                block.id ===
                                editingId

                                    ? savedBlock

                                    : block
                        )
                );

            } else {

                setBlocks(
                    previous => [

                        ...previous,

                        savedBlock

                    ]
                );
            }


            // =================================================
            // MENSAJE
            // =================================================

            setSuccess(
                editingId
                    ? "Bloque actualizado correctamente."
                    : "Bloque creado correctamente."
            );


            // =================================================
            // LIMPIAR
            // =================================================

            limpiarFormulario();


        } catch (
            error
            ) {

            console.error(
                "Error guardando bloque:",
                error
            );


            setError(
                error.message ||
                "No fue posible guardar el bloque."
            );

        } finally {

            setSaving(
                false
            );
        }
    }


    // =================================================
    // ELIMINAR BLOQUE
    // =================================================

    async function eliminarBloque(
        id
    ) {

        const confirmar =
            window.confirm(
                "¿Seguro que deseas eliminar este bloque?"
            );


        if (
            !confirmar
        ) {

            return;
        }


        setError("");

        setSuccess("");


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


            await deleteProgrammingBlock(
                id,
                token
            );


            setBlocks(
                previous =>
                    previous.filter(
                        block =>
                            block.id !== id
                    )
            );


            setSuccess(
                "Bloque eliminado correctamente."
            );


        } catch (error) {

            console.error(
                error
            );


            setError(
                error.message ||
                "No fue posible eliminar el bloque."
            );
        }
    }


    // =================================================
    // LIMPIAR FORMULARIO
    // =================================================

    function limpiarFormulario() {

        setBlockForm({

            name: "",

            description: "",

            items: []

        });


        setEditingId(
            null
        );


        setShowBlockForm(
            false
        );
    }


    // =================================================
    // ABRIR PROGRAMACIÓN
    // =================================================

    function abrirProgramacion(
        block
    ) {

        setError("");

        setSuccess("");


        setScheduleForm({

            blockId:
                String(
                    block.id
                ),

            startDate: "",

            endDate: "",

            startTime: "",

            daysOfWeek: []

        });


        setShowScheduleForm(
            true
        );


        setShowBlockForm(
            false
        );


        setShowPreview(
            false
        );


        setShowBlockSchedules(
            false
        );


        setSelectedBlock(
            null
        );


        setBlockSchedules(
            []
        );


        setPreview(
            null
        );
    }


    // =================================================
    // VER EMISIONES DEL BLOQUE
    // =================================================

    async function verEmisiones(
        block
    ) {

        setError("");

        setSuccess("");


        setSelectedBlock(
            block
        );


        setBlockSchedules(
            []
        );


        setShowBlockSchedules(
            true
        );


        setShowBlockForm(
            false
        );


        setShowScheduleForm(
            false
        );


        setShowPreview(
            false
        );


        setLoadingBlockSchedules(
            true
        );


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


            const data =
                await getProgrammingBlockSchedules(
                    block.id,
                    token
                );


            setBlockSchedules(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (error) {

            console.error(
                "Error obteniendo emisiones del bloque:",
                error
            );


            setError(
                error.message ||
                "No fue posible obtener las emisiones del bloque."
            );


            setShowBlockSchedules(
                false
            );

        } finally {

            setLoadingBlockSchedules(
                false
            );
        }
    }


    // =================================================
    // VOLVER DE EMISIONES
    // =================================================

    function volverDeEmisiones() {

        setShowBlockSchedules(
            false
        );


        setSelectedBlock(
            null
        );


        setBlockSchedules(
            []
        );


        setError("");

    }


    // =================================================
    // CAMBIAR PROGRAMACIÓN
    // =================================================

    function handleScheduleChange(
        event
    ) {

        const {
            name,
            value
        } = event.target;


        setScheduleForm(
            previous => ({

                ...previous,

                [name]:
                value

            })
        );
    }


    // =================================================
    // CAMBIAR DÍA
    // =================================================

    function toggleDay(
        day
    ) {

        const dayOrder = [

            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
            "SUNDAY"

        ];


        setScheduleForm(
            previous => {

                const exists =
                    previous.daysOfWeek.includes(
                        day
                    );


                const updatedDays =
                    exists

                        ? previous.daysOfWeek.filter(
                            currentDay =>
                                currentDay !== day
                        )

                        : [
                            ...previous.daysOfWeek,

                            day
                        ];


                const orderedDays =
                    updatedDays.sort(
                        (a, b) =>
                            dayOrder.indexOf(a) -
                            dayOrder.indexOf(b)
                    );


                return {

                    ...previous,

                    daysOfWeek:
                    orderedDays

                };

            }
        );
    }


    // =================================================
    // PREVISUALIZAR PROGRAMACIÓN
    // =================================================

    async function previsualizarProgramacion(
        event
    ) {

        event.preventDefault();

        setError("");

        setSuccess("");


        // =============================================
        // VALIDACIÓN FRONTEND
        // =============================================

        if (
            scheduleForm.daysOfWeek.length === 0
        ) {

            setError(
                "Selecciona al menos un día de la semana."
            );

            return;
        }


        if (
            !scheduleForm.startDate ||
            !scheduleForm.endDate ||
            !scheduleForm.startTime ||
            !scheduleForm.blockId
        ) {

            setError(
                "Completa todos los datos de programación."
            );

            return;
        }


        if (
            scheduleForm.endDate <
            scheduleForm.startDate
        ) {

            setError(
                "La fecha final no puede ser anterior a la fecha inicial."
            );

            return;
        }


        setPreviewing(
            true
        );


        try {

            // =============================================
            // TOKEN
            // =============================================

            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                throw new Error(
                    "No hay una sesión activa."
                );
            }


            // =============================================
            // BODY
            // =============================================

            const body = {

                blockId:
                    Number(
                        scheduleForm.blockId
                    ),

                startDate:
                scheduleForm.startDate,

                endDate:
                scheduleForm.endDate,

                startTime:
                scheduleForm.startTime,

                daysOfWeek:
                scheduleForm.daysOfWeek

            };


            // =============================================
            // SOLICITAR PREVISUALIZACIÓN
            // =============================================

            const data =
                await previewProgrammingBlockRepeat(
                    body,
                    token
                );


            // =============================================
            // VALIDAR RESPUESTA
            // =============================================

            if (!data) {

                throw new Error(
                    "El servidor no devolvió una previsualización válida."
                );
            }


            // =============================================
            // GUARDAR PREVISUALIZACIÓN
            // =============================================

            setPreview(
                data
            );


            setShowPreview(
                true
            );


        } catch (
            error
            ) {

            console.error(
                "Error generando previsualización:",
                error
            );


            setError(
                error.message ||
                "No fue posible generar la previsualización."
            );


        } finally {

            setPreviewing(
                false
            );
        }
    }


    // =================================================
    // CONFIRMAR PROGRAMACIÓN
    // =================================================

    async function confirmarProgramacion() {

        if (
            !preview ||
            preview.hasConflicts
        ) {

            return;
        }


        setError("");

        setSuccess("");


        setScheduling(
            true
        );


        try {

            const body = {

                blockId:
                    Number(
                        scheduleForm.blockId
                    ),

                startDate:
                scheduleForm.startDate,

                endDate:
                scheduleForm.endDate,

                startTime:
                scheduleForm.startTime,

                daysOfWeek:
                scheduleForm.daysOfWeek

            };


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
                await repeatProgrammingBlock(
                    body,
                    token
                );


            const generated =
                Array.isArray(data)
                    ? data
                    : [];


            setSuccess(
                `Programación generada correctamente: ${generated.length} contenidos.`
            );


            setShowScheduleForm(
                false
            );


            setShowPreview(
                false
            );


            setPreview(
                null
            );


            await cargarDatos();


        } catch (error) {

            console.error(
                error
            );


            setError(
                error.message ||
                "No fue posible generar la programación."
            );

        } finally {

            setScheduling(
                false
            );
        }
    }


    // =================================================
    // VOLVER A CONFIGURACIÓN
    // =================================================

    function volverAConfiguracion() {

        setShowPreview(
            false
        );


        setPreview(
            null
        );


        setError("");

        setSuccess("");
    }


    // =================================================
    // FORMATEAR DURACIÓN
    // =================================================

    function formatDuration(
        seconds
    ) {

        if (
            seconds === null ||
            seconds === undefined
        ) {

            return "--:--";
        }


        const total =
            Number(
                seconds
            );


        if (
            Number.isNaN(
                total
            )
        ) {

            return "--:--";
        }


        const hours =
            Math.floor(
                total / 3600
            );


        const minutes =
            Math.floor(
                (total % 3600) / 60
            );


        const remaining =
            total % 60;


        if (
            hours > 0
        ) {

            return (
                `${String(hours).padStart(2, "0")}:` +
                `${String(minutes).padStart(2, "0")}:` +
                `${String(remaining).padStart(2, "0")}`
            );
        }


        return (
            `${String(minutes).padStart(2, "0")}:` +
            `${String(remaining).padStart(2, "0")}`
        );
    }


    // =================================================
    // FORMATEAR FECHA DE PREVIEW
    // =================================================

    function formatPreviewDate(
        dateString
    ) {

        const date =
            new Date(
                `${dateString}T00:00:00`
            );


        return date.toLocaleDateString(
            "es-CO",
            {
                weekday:
                    "short",

                day:
                    "2-digit",

                month:
                    "2-digit",

                year:
                    "numeric"
            }
        );
    }


    // =================================================
    // DURACIÓN TOTAL DEL FORMULARIO
    // =================================================

    function calcularDuracionForm() {

        return blockForm.items.reduce(
            (
                total,
                item
            ) => {

                const start =
                    Number(
                        item.contentStartOffset || 0
                    );


                let end;


                if (
                    item.contentEndOffset !== "" &&
                    item.contentEndOffset !== null &&
                    item.contentEndOffset !== undefined
                ) {

                    end =
                        Number(
                            item.contentEndOffset
                        );

                } else if (
                    item.contentType ===
                    "EPISODE"
                ) {

                    const episode =
                        episodes.find(
                            current =>
                                String(
                                    current.id
                                ) ===
                                String(
                                    item.episodeId
                                )
                        );


                    end =
                        episode
                            ? episode.durationMinutes * 60
                            : 0;

                } else {

                    const content =
                        mediaContent.find(
                            current =>
                                String(
                                    current.id
                                ) ===
                                String(
                                    item.mediaContentId
                                )
                        );


                    end =
                        content
                            ? content.durationSeconds
                            : 0;
                }


                if (
                    end >
                    start
                ) {

                    return total +
                        (
                            end -
                            start
                        );
                }


                return total;

            },
            0
        );
    }


    // =================================================
    // NOMBRE DE CONTENIDO
    // =================================================

    function getItemTitle(
        item
    ) {

        if (
            item.contentType ===
            "EPISODE"
        ) {

            const episode =
                episodes.find(
                    current =>
                        String(
                            current.id
                        ) ===
                        String(
                            item.episodeId
                        )
                );


            if (
                episode
            ) {

                return (
                    `Episodio ${episode.episodeNumber} — ` +
                    episode.title
                );
            }


            return "Episodio no seleccionado";
        }


        const content =
            mediaContent.find(
                current =>
                    String(
                        current.id
                    ) ===
                    String(
                        item.mediaContentId
                    )
            );


        if (
            content
        ) {

            return content.title;
        }


        return "Contenido no seleccionado";
    }


    // =================================================
    // NOMBRE DEL DÍA
    // =================================================

    function getDayLabel(
        day
    ) {

        const labels = {

            MONDAY:
                "Lunes",

            TUESDAY:
                "Martes",

            WEDNESDAY:
                "Miércoles",

            THURSDAY:
                "Jueves",

            FRIDAY:
                "Viernes",

            SATURDAY:
                "Sábado",

            SUNDAY:
                "Domingo"

        };


        return labels[day] || day;
    }


    // =================================================
    // LOADING
    // =================================================

    if (
        loading
    ) {

        return (

            <main className="admin-page">

                <section
                    className="admin-page-header"
                >

                    <p
                        className="section-label"
                    >
                        ADMINISTRACIÓN DE NEOMOTION
                    </p>


                    <h1>
                        BLOQUES DE PROGRAMACIÓN
                    </h1>


                    <p>
                        Cargando bloques...
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

            <section
                className="admin-page-header"
            >

                <p
                    className="section-label"
                >
                    ADMINISTRACIÓN DE NEOMOTION
                </p>


                <h1>
                    BLOQUES DE PROGRAMACIÓN
                </h1>


                <p>
                    Crea plantillas reutilizables para
                    construir automáticamente la parrilla
                    de NeoMotion.
                </p>

            </section>


            <section
                className="admin-content"
            >


                {/* =================================================
                    MENSAJES
                ================================================= */}

                {error && (

                    <p>
                        {error}
                    </p>

                )}


                {success && (

                    <p>
                        {success}
                    </p>

                )}


                {/* =================================================
                    ACCIONES PRINCIPALES
                ================================================= */}

                {!showBlockForm &&
                    !showScheduleForm &&
                    !showPreview &&
                    !showBlockSchedules && (

                        <div
                            className="schedule-create-actions"
                        >

                            <button
                                type="button"
                                onClick={
                                    nuevoBloque
                                }
                            >

                                Nuevo bloque

                            </button>

                        </div>

                    )}


                {/* =================================================
                    FORMULARIO BLOQUE
                ================================================= */}

                {showBlockForm && (

                    <form
                        onSubmit={
                            guardarBloque
                        }

                        className="schedules-form"
                    >

                        <h2>

                            {editingId

                                ? "Editar bloque"

                                : "Nuevo bloque"

                            }

                        </h2>


                        {/* =================================================
                            NOMBRE
                        ================================================= */}

                        <label>
                            Nombre del bloque
                        </label>


                        <input
                            type="text"

                            name="name"

                            value={
                                blockForm.name
                            }

                            onChange={
                                handleBlockChange
                            }

                            required

                            maxLength="150"

                            disabled={
                                saving
                            }

                            placeholder="Ej. Evangelion Noche"
                        />


                        {/* =================================================
                            DESCRIPCIÓN
                        ================================================= */}

                        <label>
                            Descripción
                        </label>


                        <textarea
                            name="description"

                            value={
                                blockForm.description
                            }

                            onChange={
                                handleBlockChange
                            }

                            maxLength="1000"

                            disabled={
                                saving
                            }

                            placeholder="Descripción del bloque..."
                        />


                        {/* =================================================
                            DURACIÓN
                        ================================================= */}

                        <p>

                            Duración total:

                            {" "}

                            <strong>

                                {
                                    formatDuration(
                                        calcularDuracionForm()
                                    )
                                }

                            </strong>

                        </p>


                        {/* =================================================
                            ITEMS
                        ================================================= */}

                        <h3>
                            Contenidos del bloque
                        </h3>


                        {blockForm.items.length === 0 && (

                            <p>
                                Este bloque todavía no tiene
                                contenidos.
                            </p>

                        )}


                        {blockForm.items.map(
                            (
                                item,
                                index
                            ) => (

                                <article
                                    key={index}

                                    className="block-item-editor"
                                >

                                    <div>

                                        <strong>
                                            #{index + 1}
                                        </strong>


                                        <h3>

                                            {
                                                getItemTitle(
                                                    item
                                                )
                                            }

                                        </h3>

                                    </div>


                                    <label>
                                        Tipo de contenido
                                    </label>


                                    <select
                                        value={
                                            item.contentType
                                        }

                                        onChange={
                                            event =>
                                                cambiarTipoItem(
                                                    index,
                                                    event.target.value
                                                )
                                        }

                                        disabled={
                                            saving
                                        }
                                    >

                                        <option
                                            value="EPISODE"
                                        >
                                            Episodio
                                        </option>


                                        <option
                                            value="MEDIA_CONTENT"
                                        >
                                            Contenido multimedia
                                        </option>

                                    </select>


                                    {/* =================================================
                                        EPISODIO
                                    ================================================= */}

                                    {item.contentType ===
                                        "EPISODE" && (

                                            <>

                                                <label>
                                                    Episodio
                                                </label>


                                                <select
                                                    value={
                                                        item.episodeId
                                                    }

                                                    onChange={
                                                        event =>
                                                            handleItemChange(
                                                                index,
                                                                "episodeId",
                                                                event.target.value
                                                            )
                                                    }

                                                    required

                                                    disabled={
                                                        saving
                                                    }
                                                >

                                                    <option value="">
                                                        Selecciona un episodio
                                                    </option>


                                                    {episodes.map(
                                                        episode => (

                                                            <option
                                                                key={
                                                                    episode.id
                                                                }

                                                                value={
                                                                    episode.id
                                                                }
                                                            >

                                                                Episodio{" "}

                                                                {
                                                                    episode.episodeNumber
                                                                }

                                                                {" — "}

                                                                {
                                                                    episode.title
                                                                }

                                                            </option>

                                                        )
                                                    )}

                                                </select>

                                            </>

                                        )}


                                    {/* =================================================
                                        MEDIA CONTENT
                                    ================================================= */}

                                    {item.contentType ===
                                        "MEDIA_CONTENT" && (

                                            <>

                                                <label>
                                                    Contenido multimedia
                                                </label>


                                                <select
                                                    value={
                                                        item.mediaContentId
                                                    }

                                                    onChange={
                                                        event =>
                                                            handleItemChange(
                                                                index,
                                                                "mediaContentId",
                                                                event.target.value
                                                            )
                                                    }

                                                    required

                                                    disabled={
                                                        saving
                                                    }
                                                >

                                                    <option value="">
                                                        Selecciona contenido
                                                    </option>


                                                    {mediaContent.map(
                                                        content => (

                                                            <option
                                                                key={
                                                                    content.id
                                                                }

                                                                value={
                                                                    content.id
                                                                }
                                                            >

                                                                {
                                                                    content.title
                                                                }

                                                                {" — "}

                                                                {
                                                                    content.type
                                                                }

                                                                {" — "}

                                                                {
                                                                    formatDuration(
                                                                        content.durationSeconds
                                                                    )
                                                                }

                                                            </option>

                                                        )
                                                    )}

                                                </select>

                                            </>

                                        )}


                                    <label>
                                        Inicio del contenido (segundos)
                                    </label>


                                    <input
                                        type="number"

                                        min="0"

                                        value={
                                            item.contentStartOffset
                                        }

                                        onChange={
                                            event =>
                                                handleItemChange(
                                                    index,
                                                    "contentStartOffset",
                                                    event.target.value
                                                )
                                        }

                                        disabled={
                                            saving
                                        }
                                    />


                                    <label>
                                        Fin del contenido (segundos)
                                    </label>


                                    <input
                                        type="number"

                                        min="1"

                                        value={
                                            item.contentEndOffset
                                        }

                                        onChange={
                                            event =>
                                                handleItemChange(
                                                    index,
                                                    "contentEndOffset",
                                                    event.target.value
                                                )
                                        }

                                        disabled={
                                            saving
                                        }
                                    />


                                    <p>
                                        Si queda vacío, se utilizará
                                        el final del contenido.
                                    </p>


                                    <div
                                        className="schedule-actions"
                                    >

                                        <button
                                            type="button"

                                            className="block-move-button block-move-up"

                                            onClick={() =>
                                                moverItemArriba(
                                                    index
                                                )
                                            }

                                            disabled={
                                                saving ||
                                                index === 0
                                            }

                                            aria-label="Mover contenido hacia arriba"

                                            title="Mover hacia arriba"
                                        >

                                            <span
                                                className="triangle-up"
                                            >
                                            </span>

                                        </button>


                                        <button
                                            type="button"

                                            className="block-move-button block-move-down"

                                            onClick={() =>
                                                moverItemAbajo(
                                                    index
                                                )
                                            }

                                            disabled={
                                                saving ||
                                                index ===
                                                blockForm.items.length - 1
                                            }

                                            aria-label="Mover contenido hacia abajo"

                                            title="Mover hacia abajo"
                                        >

                                            <span
                                                className="triangle-down"
                                            >
                                            </span>

                                        </button>


                                        <button
                                            type="button"

                                            onClick={() =>
                                                eliminarItem(
                                                    index
                                                )
                                            }

                                            disabled={
                                                saving
                                            }
                                        >

                                            Eliminar

                                        </button>

                                    </div>

                                </article>

                            )
                        )}


                        <button
                            type="button"

                            onClick={
                                agregarItem
                            }

                            disabled={
                                saving
                            }
                        >

                            + Agregar contenido

                        </button>


                        <div
                            className="schedule-actions"
                        >

                            <button
                                type="submit"

                                disabled={
                                    saving
                                }
                            >

                                {saving

                                    ? "Guardando..."

                                    : editingId

                                        ? "Guardar cambios"

                                        : "Crear bloque"

                                }

                            </button>


                            <button
                                type="button"

                                onClick={
                                    limpiarFormulario
                                }

                                disabled={
                                    saving
                                }
                            >

                                Cancelar

                            </button>

                        </div>

                    </form>

                )}


                {/* =================================================
                    FORMULARIO PROGRAMAR
                ================================================= */}

                {showScheduleForm &&
                    !showPreview && (

                        <form
                            onSubmit={
                                previsualizarProgramacion
                            }

                            className="schedules-form"
                        >

                            <h2>
                                Programar bloque
                            </h2>


                            <p>
                                Primero revisaremos la programación
                                antes de crear los horarios definitivos.
                            </p>


                            {/* =================================================
                                BLOQUE
                            ================================================= */}

                            <label>
                                Bloque
                            </label>


                            <select
                                name="blockId"

                                value={
                                    scheduleForm.blockId
                                }

                                onChange={
                                    handleScheduleChange
                                }

                                required

                                disabled={
                                    previewing ||
                                    scheduling
                                }
                            >

                                <option value="">
                                    Selecciona un bloque
                                </option>


                                {blocks.map(
                                    block => (

                                        <option
                                            key={
                                                block.id
                                            }

                                            value={
                                                block.id
                                            }
                                        >

                                            {
                                                block.name
                                            }

                                            {" — "}

                                            {
                                                formatDuration(
                                                    block.totalDurationSeconds
                                                )
                                            }

                                        </option>

                                    )
                                )}

                            </select>


                            {/* =================================================
                                FECHA INICIAL
                            ================================================= */}

                            <label>
                                Fecha inicial
                            </label>


                            <input
                                type="date"

                                name="startDate"

                                value={
                                    scheduleForm.startDate
                                }

                                onChange={
                                    handleScheduleChange
                                }

                                required

                                disabled={
                                    previewing ||
                                    scheduling
                                }
                            />


                            {/* =================================================
                                FECHA FINAL
                            ================================================= */}

                            <label>
                                Fecha final
                            </label>


                            <input
                                type="date"

                                name="endDate"

                                value={
                                    scheduleForm.endDate
                                }

                                onChange={
                                    handleScheduleChange
                                }

                                required

                                disabled={
                                    previewing ||
                                    scheduling
                                }
                            />


                            {/* =================================================
                                HORA
                            ================================================= */}

                            <label>
                                Hora de inicio
                            </label>


                            <input
                                type="time"

                                name="startTime"

                                value={
                                    scheduleForm.startTime
                                }

                                onChange={
                                    handleScheduleChange
                                }

                                required

                                disabled={
                                    previewing ||
                                    scheduling
                                }
                            />


                            {/* =================================================
                                DÍAS
                            ================================================= */}

                            <label>
                                Días de la semana
                            </label>


                            <div
                                className="schedule-days-selector"
                            >

                                {[
                                    [
                                        "MONDAY",
                                        "Lunes"
                                    ],
                                    [
                                        "TUESDAY",
                                        "Martes"
                                    ],
                                    [
                                        "WEDNESDAY",
                                        "Miércoles"
                                    ],
                                    [
                                        "THURSDAY",
                                        "Jueves"
                                    ],
                                    [
                                        "FRIDAY",
                                        "Viernes"
                                    ],
                                    [
                                        "SATURDAY",
                                        "Sábado"
                                    ],
                                    [
                                        "SUNDAY",
                                        "Domingo"
                                    ]
                                ].map(
                                    (
                                        [
                                            value,
                                            label
                                        ]
                                    ) => {

                                        const selected =
                                            scheduleForm.daysOfWeek.includes(
                                                value
                                            );


                                        return (

                                            <button
                                                key={
                                                    value
                                                }

                                                type="button"

                                                className={
                                                    selected
                                                        ? "schedule-day-button selected"
                                                        : "schedule-day-button"
                                                }

                                                onClick={() =>
                                                    toggleDay(
                                                        value
                                                    )
                                                }

                                                disabled={
                                                    previewing ||
                                                    scheduling
                                                }
                                            >

                                                <span>
                                                    {
                                                        label
                                                            .substring(
                                                                0,
                                                                3
                                                            )
                                                            .toUpperCase()
                                                    }
                                                </span>


                                                <strong>
                                                    {label}
                                                </strong>

                                            </button>

                                        );

                                    }
                                )}

                            </div>


                            {/* =================================================
                                ACCIONES
                            ================================================= */}

                            <div
                                className="schedule-actions"
                            >

                                <button
                                    type="submit"

                                    disabled={
                                        previewing ||
                                        scheduling
                                    }
                                >

                                    {previewing

                                        ? "Analizando programación..."

                                        : "Previsualizar programación"

                                    }

                                </button>


                                <button
                                    type="button"

                                    onClick={() => {

                                        setShowScheduleForm(
                                            false
                                        );

                                        setPreview(
                                            null
                                        );

                                        setShowPreview(
                                            false
                                        );

                                    }}

                                    disabled={
                                        previewing ||
                                        scheduling
                                    }
                                >

                                    Cancelar

                                </button>

                            </div>

                        </form>

                    )}


                {/* =================================================
                 EMISIONES DEL BLOQUE
                 ================================================= */}

                {showBlockSchedules && (

                    <section className="block-schedules-view">

                        {/* =================================================
                          ENCABEZADO
                         ================================================= */}

                        <div className="block-schedules-header">

                            <div className="block-schedules-title-row">

                                <div>

                                    <p className="section-label">
                                        PROGRAMACIÓN GENERADA
                                    </p>


                                    <h2>
                                        {
                                            selectedBlock?.name
                                        }
                                    </h2>


                                    {selectedBlock?.description && (

                                        <p className="block-schedules-description">
                                            {
                                                selectedBlock.description
                                            }
                                        </p>

                                    )}

                                </div>


                                <div className="block-schedules-counter">

                    <span>
                        EMISIONES
                    </span>


                                    <strong>
                                        {
                                            blockSchedules.length
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                          CARGANDO
                        ================================================= */}

                        {loadingBlockSchedules && (

                            <div className="block-schedules-empty">

                <span>
                    GENERANDO VISTA
                </span>


                                <p>
                                    Cargando las emisiones del bloque...
                                </p>

                            </div>

                        )}


                        {/* =================================================
                         SIN EMISIONES
                         ================================================= */}

                        {!loadingBlockSchedules &&
                            blockSchedules.length === 0 && (

                                <div className="block-schedules-empty">

                    <span>
                        SIN EMISIONES
                    </span>


                                    <p>
                                        Este bloque todavía no tiene
                                        emisiones generadas.
                                    </p>

                                </div>

                            )}


                        {
                            /* =================================================
                               EMISIONES
                             ================================================= */}

                        {!loadingBlockSchedules &&
                            blockSchedules.length > 0 && (

                                <div className="block-schedules-list">

                                    {blockSchedules.map(
                                        (
                                            schedule,
                                            index
                                        ) => (

                                            <article
                                                key={
                                                    schedule.id
                                                }
                                                className="block-schedule-row"
                                            >
                                                {/* =================================
                                                     ÍNDICE
                                                 ================================= */}

                                                <div className="block-schedule-index">

                                                    {
                                                        String(
                                                            index + 1
                                                        ).padStart(
                                                            2,
                                                            "0"
                                                        )
                                                    }

                                                </div>


                                                {/* =================================
                                                FECHA
                                                ================================= */}

                                                <div className="block-schedule-date">

                                                    <span>
                                                      FECHA
                                                    </span>


                                                    <strong>
                                                        {
                                                            schedule.airDate
                                                        }
                                                    </strong>

                                                </div>


                                                {/* =================================
                                                 HORARIO
                                                  ================================= */}

                                                <div className="block-schedule-time">

                                                  <span>
                                                    HORARIO
                                                  </span>


                                                    <strong>

                                                        {
                                                            schedule.startTime
                                                                ?.slice(
                                                                    0,
                                                                    5
                                                                )
                                                        }

                                                        <em>
                                                            →
                                                        </em>

                                                        {
                                                            schedule.endTime
                                                                ?.slice(
                                                                    0,
                                                                    5
                                                                )
                                                        }

                                                    </strong>

                                                </div>


                                                {/* =================================
                                                  CONTENIDO
                                               ================================= */}

                                                <div className="block-schedule-content">

                                                <span>
                                                CONTENIDO
                                               </span>


                                                    <strong>

                                                        {
                                                            schedule.contentType ===
                                                            "EPISODE"

                                                                ? schedule.episodeTitle

                                                                : schedule.mediaContentTitle
                                                        }

                                                    </strong>


                                                    {schedule.contentType ===
                                                        "EPISODE" && (

                                                            <p>

                                                                {
                                                                    schedule.seriesTitle
                                                                }


                                                                <span>
                                                              {" · "}
                                                               </span>


                                                                {
                                                                    schedule.seasonTitle
                                                                }


                                                                <span>
                                                {" · EPISODIO "}
                                            </span>


                                                                {
                                                                    schedule.episodeNumber
                                                                }

                                                            </p>

                                                        )}


                                                    {schedule.contentType ===
                                                        "MEDIA_CONTENT" && (

                                                            <p>
                                                                {
                                                                    schedule.mediaContentType
                                                                }
                                                            </p>

                                                        )}

                                                </div>


                                                {/* =================================
                                                FRAGMENTO
                                              ================================= */}

                                                <div className="block-schedule-fragment">

                                                <span>
                                                 SEGMENTO
                                               </span>


                                                    <strong>

                                                        {formatDuration(schedule.contentStartOffset)}


                                                        <em>
                                                            →
                                                        </em>


                                                        {
                                                            formatDuration(
                                                                schedule.contentEndOffset
                                                            )
                                                        }

                                                    </strong>

                                                </div>

                                            </article>

                                        )
                                    )}

                                </div>

                            )}


                        {/* =================================================
                        ACCIONES
                        ================================================= */}

                        <div className="block-schedules-actions">

                            <button
                                type="button"
                                onClick={
                                    volverDeEmisiones
                                }
                                className="admin-secondary-button"
                            >
                                ← VOLVER A BLOQUES
                            </button>

                        </div>

                    </section>

                )}


                {/* =================================================
                    PREVISUALIZACIÓN
                ================================================= */}

                {showPreview &&
                    preview && (

                        <section
                            className="schedule-preview"
                        >

                            <div
                                className="schedule-preview-header"
                            >

                                <p
                                    className="section-label"
                                >
                                    PREVISUALIZACIÓN
                                </p>


                                <h2>
                                    {
                                        preview.blockName
                                    }
                                </h2>


                                <p>
                                    Revisa la programación antes
                                    de crear los horarios definitivos.
                                </p>

                            </div>


                            {/* =================================================
                                RESUMEN
                            ================================================= */}

                            <div
                                className="schedule-preview-summary"
                            >

                                <div>

                                    <span>
                                        PERÍODO
                                    </span>

                                    <strong>

                                        {
                                            preview.startDate
                                        }

                                        {" → "}

                                        {
                                            preview.endDate
                                        }

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        HORA DE INICIO
                                    </span>

                                    <strong>
                                        {
                                            preview.startTime
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        DÍAS DE EMISIÓN
                                    </span>

                                    <strong
                                        className="schedule-preview-days"
                                    >

                                        {
                                            scheduleForm.daysOfWeek
                                                .map(
                                                    day =>
                                                        getDayLabel(
                                                            day
                                                        )
                                                )
                                                .join(" · ")
                                        }

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        EMISIONES
                                    </span>

                                    <strong>
                                        {
                                            preview.totalOccurrences
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        CONTENIDOS
                                    </span>

                                    <strong>
                                        {
                                            preview.totalSchedules
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        DURACIÓN TOTAL
                                    </span>

                                    <strong>

                                        {
                                            formatDuration(
                                                preview.totalDurationSeconds
                                            )
                                        }

                                    </strong>

                                </div>

                            </div>


                            {/* =================================================
                                ESTADO GENERAL
                            ================================================= */}

                            <div
                                className={
                                    preview.hasConflicts

                                        ? "schedule-preview-status conflict"

                                        : "schedule-preview-status available"
                                }
                            >

                                {preview.hasConflicts ? (

                                    <>

                                        <strong>
                                            ⚠ CONFLICTOS DETECTADOS
                                        </strong>


                                        <span>
                                            Algunas fechas ya tienen
                                            programación ocupando ese horario.
                                        </span>

                                    </>

                                ) : (

                                    <>

                                        <strong>
                                            ✓ PROGRAMACIÓN DISPONIBLE
                                        </strong>


                                        <span>
                                            No se detectaron conflictos
                                            en las fechas seleccionadas.
                                        </span>

                                    </>

                                )}

                            </div>


                            {/* =================================================
                                OCURRENCIAS
                            ================================================= */}

                            <div
                                className="schedule-preview-list"
                            >

                                <h3>
                                    Fechas de emisión
                                </h3>


                                {preview.occurrences.map(
                                    occurrence => (

                                        <article
                                            key={
                                                occurrence.airDate
                                            }

                                            className={
                                                occurrence.conflict

                                                    ? "schedule-preview-item conflict"

                                                    : "schedule-preview-item"
                                            }
                                        >

                                            <div>

                                                <strong>
                                                    {
                                                        formatPreviewDate(
                                                            occurrence.airDate
                                                        )
                                                    }
                                                </strong>


                                                <span>

                                                    {
                                                        occurrence.startTime
                                                    }

                                                    {" → "}

                                                    {
                                                        occurrence.endTime
                                                    }

                                                </span>

                                            </div>


                                            <div>

                                                <span>

                                                    {
                                                        occurrence.scheduleCount
                                                    }

                                                    {" "}

                                                    {
                                                        occurrence.scheduleCount ===
                                                        1

                                                            ? "contenido"

                                                            : "contenidos"
                                                    }

                                                </span>


                                                {occurrence.conflict ? (

                                                    <strong
                                                        className="schedule-preview-conflict-label"
                                                    >
                                                        ⚠ CONFLICTO
                                                    </strong>

                                                ) : (

                                                    <strong
                                                        className="schedule-preview-ok-label"
                                                    >
                                                        ✓ DISPONIBLE
                                                    </strong>

                                                )}

                                            </div>


                                            {occurrence.conflict &&
                                                occurrence
                                                    .conflictMessages
                                                    ?.length > 0 && (

                                                    <div
                                                        className="schedule-preview-conflict-messages"
                                                    >

                                                        {
                                                            occurrence
                                                                .conflictMessages
                                                                .map(
                                                                    (
                                                                        message,
                                                                        index
                                                                    ) => (

                                                                        <p
                                                                            key={
                                                                                index
                                                                            }
                                                                        >

                                                                            {
                                                                                message
                                                                            }

                                                                        </p>

                                                                    )
                                                                )
                                                        }

                                                    </div>

                                                )}

                                        </article>

                                    )
                                )}

                            </div>


                            {/* =================================================
                                ACCIONES PREVIEW
                            ================================================= */}

                            <div
                                className="schedule-preview-actions"
                            >

                                <button
                                    type="button"

                                    onClick={
                                        volverAConfiguracion
                                    }

                                    disabled={
                                        scheduling
                                    }
                                >

                                    Volver

                                </button>


                                <button
                                    type="button"

                                    onClick={
                                        confirmarProgramacion
                                    }

                                    disabled={
                                        scheduling ||
                                        preview.hasConflicts
                                    }
                                >

                                    {scheduling

                                        ? "Generando programación..."

                                        : "Confirmar programación"

                                    }

                                </button>

                            </div>

                        </section>

                    )}


                {/* =================================================
    LISTA DE BLOQUES
================================================= */}

                {!showBlockForm &&
                    !showScheduleForm &&
                    !showPreview &&
                    !showBlockSchedules &&
                    blocks.length === 0 && (

                        <div className="admin-empty-state">

            <span>
                SIN BLOQUES
            </span>


                            <p>
                                No hay bloques de programación.
                                Crea el primero para comenzar
                                a automatizar la parrilla.
                            </p>


                            <button
                                type="button"
                                className="admin-primary-button"
                                onClick={nuevoBloque}
                            >
                                + NUEVO BLOQUE
                            </button>

                        </div>

                    )}


                {!showBlockForm &&
                    !showScheduleForm &&
                    !showPreview &&
                    !showBlockSchedules &&
                    blocks.length > 0 && (

                        <div className="blocks-table-wrapper">

                            <table className="blocks-table">

                                <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        BLOQUE
                                    </th>

                                    <th>
                                        DESCRIPCIÓN
                                    </th>

                                    <th>
                                        CONTENIDOS
                                    </th>

                                    <th>
                                        DURACIÓN
                                    </th>

                                    <th>
                                        ACCIONES
                                    </th>

                                </tr>

                                </thead>


                                <tbody>

                                {blocks.map(
                                    (
                                        block,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                block.id
                                            }
                                        >

                                            {/* =================================
                                    ÍNDICE
                                ================================= */}

                                            <td className="blocks-table-index">

                                                {String(
                                                    index + 1
                                                ).padStart(
                                                    2,
                                                    "0"
                                                )}

                                            </td>


                                            {/* =================================
                                    BLOQUE
                                ================================= */}

                                            <td className="blocks-table-name">

                                                <strong>
                                                    {
                                                        block.name
                                                    }
                                                </strong>


                                                <span>
                                        ID #{block.id}
                                    </span>

                                            </td>


                                            {/* =================================
                                    DESCRIPCIÓN
                                ================================= */}

                                            <td className="blocks-table-description">

                                                {
                                                    block.description ||
                                                    "Sin descripción"
                                                }

                                            </td>


                                            {/* =================================
                                           CONTENIDOS
                                           ================================= */}

                                            <td className="blocks-table-count">

                                                {
                                                    block.items?.length || 0
                                                }

                                            </td>


                                            {/* =================================
                                            DURACIÓN
                                            ================================= */}

                                            <td className="blocks-table-duration">

                                                {
                                                    formatDuration(
                                                        block.totalDurationSeconds
                                                    )
                                                }

                                            </td>


                                            {/* =================================
                                    ACCIONES
                                ================================= */}

                                            <td>

                                                <div className="blocks-table-actions">

                                                    <button
                                                        type="button"
                                                        className="block-edit-button"
                                                        onClick={() =>
                                                            editarBloque(
                                                                block
                                                            )
                                                        }
                                                    >
                                                        EDITAR
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="block-schedule-button"
                                                        onClick={() =>
                                                            abrirProgramacion(
                                                                block
                                                            )
                                                        }
                                                    >
                                                        PROGRAMAR
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="block-view-button"
                                                        onClick={() =>
                                                            verEmisiones(
                                                                block
                                                            )
                                                        }
                                                    >
                                                        EMISIONES
                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="block-delete-button"
                                                        onClick={() =>
                                                            eliminarBloque(
                                                                block.id
                                                            )
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


export default ProgrammingBlocksPage;