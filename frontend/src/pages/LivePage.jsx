import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    getPlaybackState,
    getTodaySchedule,
    getVideoUrl
} from "../api/api.js";

import neoMotionLogo
    from "../assets/neomotion-logo.svg";


function LivePage() {

    // =================================================
    // PROGRAMACIÓN ACTUAL
    // =================================================

    const [
        currentSchedule,
        setCurrentSchedule
    ] = useState(null);


    // =================================================
    // SIGUIENTE PROGRAMACIÓN
    // =================================================

    const [
        nextSchedule,
        setNextSchedule
    ] = useState(null);

    const [
        todaySchedule,
        setTodaySchedule
    ] = useState([]);


    // =================================================
    // ESTADO DE CARGA
    // =================================================

    const [
        loading,
        setLoading
    ] = useState(true);


    // =================================================
    // ERROR
    // =================================================

    const [
        error,
        setError
    ] = useState(null);


    // =================================================
    // SONIDO
    // =================================================

    const [
        soundEnabled,
        setSoundEnabled
    ] = useState(false);


    const [
        volume,
        setVolume
    ] = useState(1);


    // =================================================
    // PANTALLA COMPLETA
    // =================================================

    const [
        isFullscreen,
        setIsFullscreen
    ] = useState(false);


    // =================================================
    // ÁREA REAL DEL VIDEO VISIBLE
    // =================================================

    const [
        videoBounds,
        setVideoBounds
    ] = useState(null);


    // =================================================
    // REFERENCIAS
    // =================================================

    const videoRef =
        useRef(null);


    const playerRef =
        useRef(null);


    // =================================================
    // EVITAR TRANSICIONES DUPLICADAS
    // =================================================

    const transitionInProgressRef =
        useRef(false);


    // =================================================
    // CALCULAR ÁREA REAL DEL VIDEO
    // =================================================

    function actualizarVideoBounds() {

        const video =
            videoRef.current;

        const stage =
            playerRef.current
                ?.querySelector(
                    ".live-video-stage"
                );


        if (
            !video ||
            !stage ||
            !video.videoWidth ||
            !video.videoHeight
        ) {

            setVideoBounds(
                null
            );

            return;
        }


        const stageWidth =
            stage.clientWidth;


        const stageHeight =
            stage.clientHeight;


        if (
            stageWidth <= 0 ||
            stageHeight <= 0
        ) {

            return;
        }


        const videoRatio =
            video.videoWidth /
            video.videoHeight;


        const stageRatio =
            stageWidth /
            stageHeight;


        let displayedWidth;

        let displayedHeight;


        // =================================================
        // VIDEO MÁS ANCHO QUE EL CONTENEDOR
        // =================================================

        if (
            videoRatio >
            stageRatio
        ) {

            displayedWidth =
                stageWidth;


            displayedHeight =
                stageWidth /
                videoRatio;

        } else {

            displayedHeight =
                stageHeight;


            displayedWidth =
                stageHeight *
                videoRatio;
        }


        const left =
            (
                stageWidth -
                displayedWidth
            ) / 2;


        const top =
            (
                stageHeight -
                displayedHeight
            ) / 2;


        setVideoBounds({

            left,

            top,

            width:
            displayedWidth,

            height:
            displayedHeight

        });

    }


    // =================================================
    // CARGAR ESTADO DEL CANAL
    // =================================================

    async function loadPlaybackState() {

        try {

            const [
                playbackState,
                today
            ] = await Promise.all([

                getPlaybackState(),

                getTodaySchedule()

            ]);


            setCurrentSchedule(
                playbackState.current
            );


            setTodaySchedule(
                today
            );


            setError(null);


            return playbackState;

        } catch (error) {

            console.error(
                "Error cargando estado del canal:",
                error
            );


            setError(
                "No fue posible cargar la transmisión."
            );


            return null;
        }
    }


    // =================================================
    // CARGA INICIAL
    // =================================================

    useEffect(() => {

        async function initializeChannel() {

            setLoading(true);

            await loadPlaybackState();

            setLoading(false);
        }


        initializeChannel();

    }, []);


    // =================================================
    // ACTUALIZAR ESTADO DEL CANAL
    // =================================================

    useEffect(() => {

        const interval =
            setInterval(
                async () => {

                    await loadPlaybackState();

                },
                5000
            );


        return () => {

            clearInterval(interval);

        };

    }, []);


    // =================================================
    // SINCRONIZAR VIDEO
    // =================================================

    useEffect(() => {

        const video =
            videoRef.current;


        if (
            !video ||
            !currentSchedule ||
            !currentSchedule.videoUrl
        ) {

            return;
        }


        const newVideoUrl =
            getVideoUrl(
                currentSchedule.videoUrl
            );


        const videoChanged =
            !video.src ||
            !video.src.endsWith(
                currentSchedule.videoUrl
            );


        // =================================================
        // CAMBIÓ EL CONTENIDO
        // =================================================

        if (videoChanged) {

            console.log(
                "Cambio de contenido:",
                currentSchedule.title
            );


            video.pause();


            video.src =
                newVideoUrl;


            const handleLoadedMetadata =
                async () => {

                    const currentPlayback =
                        Number(
                            currentSchedule
                                .currentPlaybackSeconds
                        );


                    const playbackStart =
                        Number(
                            currentSchedule
                                .playbackStartSeconds
                        );


                    // =========================================
                    // VALIDAR DURACIÓN
                    // =========================================

                    if (
                        !Number.isFinite(
                            video.duration
                        ) ||
                        video.duration <= 0
                    ) {

                        return;
                    }


                    // =========================================
                    // POSICIÓN DE INICIO
                    // =========================================

                    if (
                        Number.isFinite(
                            currentPlayback
                        ) &&
                        currentPlayback >=
                        playbackStart &&
                        currentPlayback <
                        video.duration
                    ) {

                        video.currentTime =
                            currentPlayback;

                    } else if (
                        Number.isFinite(
                            playbackStart
                        ) &&
                        playbackStart >= 0 &&
                        playbackStart <
                        video.duration
                    ) {

                        video.currentTime =
                            playbackStart;
                    }


                    // =========================================
                    // CALCULAR ÁREA VISIBLE
                    // =========================================

                    requestAnimationFrame(
                        actualizarVideoBounds
                    );


                    // =========================================
                    // REPRODUCIR
                    // =========================================

                    try {

                        await video.play();

                    } catch (error) {

                        console.error(
                            "No fue posible iniciar la reproducción:",
                            error
                        );

                    }

                };


            video.addEventListener(
                "loadedmetadata",
                handleLoadedMetadata,
                {
                    once: true
                }
            );


            video.load();


            return () => {

                video.removeEventListener(
                    "loadedmetadata",
                    handleLoadedMetadata
                );

            };
        }


        // =================================================
        // CORREGIR DESFASE
        // =================================================

        const backendPosition =
            Number(
                currentSchedule
                    .currentPlaybackSeconds
            );


        const frontendPosition =
            video.currentTime;


        if (
            !Number.isFinite(
                backendPosition
            ) ||
            !Number.isFinite(
                frontendPosition
            )
        ) {

            return;
        }


        const difference =
            Math.abs(
                backendPosition -
                frontendPosition
            );


        if (
            difference > 5 &&
            !transitionInProgressRef.current
        ) {

            video.currentTime =
                backendPosition;
        }


    }, [
        currentSchedule?.scheduleId,
        currentSchedule?.videoUrl,
        currentSchedule?.currentPlaybackSeconds,
        currentSchedule?.playbackStartSeconds,
        currentSchedule?.playbackEndSeconds
    ]);


    // =================================================
    // DETECTAR FINAL DEL CONTENIDO
    // =================================================

    useEffect(() => {

        const video =
            videoRef.current;


        if (
            !video ||
            !currentSchedule
        ) {

            return;
        }


        async function transitionToCurrentSchedule() {

            if (
                transitionInProgressRef.current
            ) {

                return;
            }


            transitionInProgressRef.current =
                true;


            try {

                video.pause();


                const playbackState =
                    await getPlaybackState();


                setCurrentSchedule(
                    playbackState.current
                );


                setNextSchedule(
                    playbackState.next
                );


            } catch (error) {

                console.error(
                    "Error realizando transición:",
                    error
                );


                setError(
                    "No fue posible continuar la transmisión."
                );

            } finally {

                transitionInProgressRef.current =
                    false;
            }
        }


        // =================================================
        // TIMEUPDATE
        // =================================================

        const handleTimeUpdate =
            () => {

                const playbackEnd =
                    Number(
                        currentSchedule
                            .playbackEndSeconds
                    );


                const currentTime =
                    video.currentTime;


                if (
                    !Number.isFinite(
                        playbackEnd
                    ) ||
                    !Number.isFinite(
                        currentTime
                    )
                ) {

                    return;
                }


                if (
                    currentTime >=
                    playbackEnd - 0.25
                ) {

                    video.pause();

                    transitionToCurrentSchedule();

                }

            };


        // =================================================
        // ENDED
        // =================================================

        const handleEnded =
            () => {

                transitionToCurrentSchedule();

            };


        video.addEventListener(
            "timeupdate",
            handleTimeUpdate
        );


        video.addEventListener(
            "ended",
            handleEnded
        );


        return () => {

            video.removeEventListener(
                "timeupdate",
                handleTimeUpdate
            );


            video.removeEventListener(
                "ended",
                handleEnded
            );

        };


    }, [
        currentSchedule?.scheduleId,
        currentSchedule?.playbackEndSeconds
    ]);


    // =================================================
    // ACTIVAR SONIDO
    // =================================================

    async function activarSonido() {

        const video =
            videoRef.current;


        if (!video) {

            return;
        }


        try {

            video.muted =
                false;


            video.volume =
                volume > 0
                    ? volume
                    : 1;


            await video.play();


            setSoundEnabled(
                true
            );


        } catch (error) {

            console.error(
                "No fue posible activar el audio:",
                error
            );

        }

    }


    // =================================================
    // CAMBIAR VOLUMEN
    // =================================================

    function cambiarVolumen(
        event
    ) {

        const newVolume =
            Number(
                event.target.value
            );


        const video =
            videoRef.current;


        setVolume(
            newVolume
        );


        if (!video) {

            return;
        }


        video.volume =
            newVolume;


        if (
            newVolume === 0
        ) {

            video.muted =
                true;


            setSoundEnabled(
                false
            );

        } else {

            video.muted =
                false;


            setSoundEnabled(
                true
            );

        }

    }


    // =================================================
    // PANTALLA COMPLETA
    // =================================================

    async function toggleFullscreen() {

        const player =
            playerRef.current;


        if (!player) {

            return;
        }


        try {

            if (
                !document.fullscreenElement
            ) {

                await player.requestFullscreen();

            } else {

                await document.exitFullscreen();

            }

        } catch (error) {

            console.error(
                "No fue posible cambiar la pantalla completa:",
                error
            );

        }

    }


    // =================================================
    // DETECTAR CAMBIO DE PANTALLA COMPLETA
    // =================================================

    useEffect(() => {

        function handleFullscreenChange() {

            const fullscreen =
                Boolean(
                    document.fullscreenElement
                );


            setIsFullscreen(
                fullscreen
            );


            requestAnimationFrame(
                () => {

                    actualizarVideoBounds();

                }
            );

        }


        document.addEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );


        function handleResize() {

            requestAnimationFrame(
                () => {

                    actualizarVideoBounds();

                }
            );

        }


        window.addEventListener(
            "resize",
            handleResize
        );


        return () => {

            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );


            window.removeEventListener(
                "resize",
                handleResize
            );

        };

    }, []);

    // =================================================
// PRÓXIMO PROGRAMA VISIBLE
// IGNORAR PROMOS, COMERCIALES Y CORTINILLAS
// =================================================

    let nextVisibleSchedule = null;


    if (currentSchedule) {

        const currentIndex =
            todaySchedule.findIndex(
                schedule =>
                    schedule.id ===
                    currentSchedule.scheduleId
            );


        if (currentIndex >= 0) {

            nextVisibleSchedule =
                todaySchedule
                    .slice(currentIndex + 1)
                    .find(
                        schedule =>
                            schedule.contentType ===
                            "EPISODE"
                    );

        } else {

            nextVisibleSchedule =
                todaySchedule.find(
                    schedule =>
                        schedule.contentType ===
                        "EPISODE"
                ) || null;
        }

    } else {

        nextVisibleSchedule =
            todaySchedule.find(
                schedule =>
                    schedule.contentType ===
                    "EPISODE"
            ) || null;
    }


    // =================================================
    // CARGANDO
    // =================================================

    if (loading) {

        return (

            <main className="live-page">

                <section className="live-page-header">

                    <p className="section-label">
                        TELEVISIÓN NEOMOTION
                    </p>


                    <h1>
                        EN VIVO
                    </h1>


                    <p>
                        Cargando transmisión...
                    </p>

                </section>

            </main>
        );
    }


    // =================================================
    // ERROR SIN TRANSMISIÓN
    // =================================================

    if (
        error &&
        !currentSchedule
    ) {

        return (

            <main className="live-page">

                <section className="live-page-header">

                    <p className="section-label">
                        TELEVISIÓN NEOMOTION
                    </p>


                    <h1>
                        EN VIVO
                    </h1>


                    <p>
                        {error}
                    </p>

                </section>

            </main>
        );
    }


    // =================================================
    // NO HAY CONTENIDO
    // =================================================

    if (!currentSchedule) {

        return (

            <main className="live-page">

                <section className="live-page-header">

                    <p className="section-label">
                        TELEVISIÓN NEOMOTION
                    </p>


                    <h1>
                        EN VIVO
                    </h1>


                    <p>
                        En este momento no hay ningún
                        contenido transmitiéndose.
                    </p>


                    {nextSchedule && (

                        <div className="next-program">

                            <span>
                                PRÓXIMAMENTE
                            </span>


                            <strong>
                                {nextSchedule.title}
                            </strong>


                            <p>

                                {
                                    nextSchedule
                                        .startTime
                                        ?.slice(0, 5)
                                }

                                {" — "}

                                {
                                    nextSchedule
                                        .endTime
                                        ?.slice(0, 5)
                                }

                            </p>

                        </div>

                    )}

                </section>

            </main>
        );
    }


    // =================================================
    // LOGO DIMENSIONES
    // =================================================

    const logoWidth =
        videoBounds

            ? Math.min(
                170,
                videoBounds.width * 0.12
            )

            : 150;


    const logoLeft =
        videoBounds

            ? (
                videoBounds.left +
                videoBounds.width -
                logoWidth -
                24
            )

            : undefined;


    const logoTop =
        videoBounds

            ? (
                videoBounds.top +
                24
            )

            : undefined;


    // =================================================
    // RENDER PRINCIPAL
    // =================================================

    return (

        <main className="live-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <section className="live-page-header">

                <p className="section-label">
                    TELEVISIÓN NEOMOTION
                </p>


                <h1>
                    EN VIVO
                </h1>


                <p>
                    La señal de NeoMotion transmitiendo
                    las 24 horas, los 7 días de la semana.
                </p>

            </section>


            {/* =================================================
                REPRODUCTOR
            ================================================= */}

            <section
                ref={playerRef}
                className={
                    isFullscreen
                        ? "live-player live-player-fullscreen"
                        : "live-player"
                }
            >

                <div className="live-video-stage">


                    {/* =================================================
                        VIDEO
                    ================================================= */}

                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        preload="auto"
                        controls={false}
                        disablePictureInPicture
                        onContextMenu={
                            event =>
                                event.preventDefault()
                        }
                    >

                        Tu navegador no soporta
                        video HTML5.

                    </video>


                    {/* =================================================
                        LOGO DEL CANAL
                    ================================================= */}

                    {currentSchedule.contentType === "EPISODE" &&
                        videoBounds && (

                            <img
                                src={neoMotionLogo}
                                alt="NeoMotion"
                                className="live-channel-logo"
                                style={{
                                    left:
                                        `${logoLeft}px`,

                                    top:
                                        `${logoTop}px`,

                                    width:
                                        `${logoWidth}px`
                                }}
                            />

                        )}


                    {/* =================================================
                        ACTIVAR SONIDO
                    ================================================= */}

                    {!soundEnabled && (

                        <button
                            type="button"
                            onClick={activarSonido}
                            className="live-sound-button"
                        >

                            ACTIVAR SONIDO

                        </button>

                    )}


                    {/* =================================================
                        CONTROLES
                    ================================================= */}

                    <div className="live-custom-controls">


                        <div className="live-volume-group">

                            <span>
                                VOLUMEN
                            </span>


                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={
                                    cambiarVolumen
                                }
                                aria-label="Volumen"
                            />

                        </div>


                        <button
                            type="button"
                            onClick={toggleFullscreen}
                            className="live-fullscreen-button"
                            aria-label={
                                isFullscreen
                                    ? "Salir de pantalla completa"
                                    : "Pantalla completa"
                            }
                        >

                            {isFullscreen
                                ? "SALIR DE PANTALLA COMPLETA"
                                : "PANTALLA COMPLETA"
                            }

                        </button>

                    </div>


                    {/* =================================================
                        TEXTURA VHS
                    ================================================= */}

                    <div
                        className="live-screen-overlay"
                    >
                    </div>

                </div>

            </section>


            {/* =================================================
    INFORMACIÓN DEL PROGRAMA
================================================= */}

            <section className="live-info">


                {/* =================================================
        AHORA
    ================================================= */}

                <div className="live-current-info">

        <span className="now-label">
            AHORA EN NEOMOTION
        </span>


                    <h2>
                        {currentSchedule.title}
                    </h2>


                    <p className="live-content-type">

                        {
                            currentSchedule.contentType ===
                            "EPISODE"

                                ? "EPISODIO"

                                : "CONTENIDO MULTIMEDIA"

                        }

                    </p>

                </div>


                {/* =================================================
               SIGUIENTE
                ================================================= */}

                <div className="next-program">

                <span>
                   PRÓXIMAMENTE
                </span>

                    {nextVisibleSchedule ? (

                        <>

                            <strong>
                                {
                                    nextVisibleSchedule.seriesTitle ||
                                    nextVisibleSchedule.title
                                }
                            </strong>


                            <p>
                                EPISODIO{" "}
                                {
                                    nextVisibleSchedule.episodeNumber
                                }

                                {" — "}

                                {
                                    nextVisibleSchedule.episodeTitle
                                }
                            </p>

                        </>

                    ) : (

                        <p>
                            No hay más contenido programado.
                        </p>

                    )}

                </div>

            </section>


            {/* =================================================
                ERROR NO BLOQUEANTE
            ================================================= */}

            {error && (

                <p className="live-error">

                    {error}

                </p>

            )}

        </main>
    );
}


export default LivePage;