import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    getCurrentUser
} from "../api/api.js";


const AuthContext =
    createContext();


export function AuthProvider({
                                 children
                             }) {

    // =================================================
    // TOKEN
    // =================================================

    const [
        token,
        setToken
    ] = useState(
        () => localStorage.getItem("token")
    );


    // =================================================
    // USUARIO
    // =================================================

    const [
        user,
        setUser
    ] = useState(null);


    // =================================================
    // ESTADO DE CARGA
    // =================================================

    const [
        loading,
        setLoading
    ] = useState(true);


    // =================================================
    // CARGAR USUARIO
    // =================================================

    async function loadUser(
        currentToken
    ) {

        if (!currentToken) {

            setUser(null);
            setLoading(false);

            return;
        }


        try {

            const data =
                await getCurrentUser(
                    currentToken
                );


            setUser(
                data
            );

        } catch (error) {

            console.error(
                "Error cargando usuario:",
                error
            );


            // =============================================
            // TOKEN INVÁLIDO O EXPIRADO
            // =============================================

            localStorage.removeItem(
                "token"
            );


            setToken(
                null
            );


            setUser(
                null
            );

        } finally {

            setLoading(
                false
            );

        }
    }


    // =================================================
    // LOGIN
    // =================================================

    async function login(
        newToken
    ) {

        localStorage.setItem(
            "token",
            newToken
        );


        setToken(
            newToken
        );


        setLoading(
            true
        );


        await loadUser(
            newToken
        );
    }


    // =================================================
    // LOGOUT
    // =================================================

    function logout() {

        localStorage.removeItem(
            "token"
        );


        setToken(
            null
        );


        setUser(
            null
        );


        setLoading(
            false
        );
    }


    // =================================================
    // RESTAURAR SESIÓN
    // =================================================

    useEffect(() => {

        const storedToken =
            localStorage.getItem(
                "token"
            );


        if (storedToken) {

            loadUser(
                storedToken
            );

        } else {

            setLoading(
                false
            );

        }

    }, []);


    // =================================================
    // AUTENTICACIÓN
    // =================================================

    const isAuthenticated =
        !!token;


    // =================================================
    // PROVIDER
    // =================================================

    return (

        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated,
                loading,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>
    );
}


// =================================================
// HOOK
// =================================================

export function useAuth() {

    return useContext(
        AuthContext
    );
}