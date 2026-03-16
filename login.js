import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Configuración completa para evitar errores de base de datos
const firebaseConfig = {
    apiKey: "AIzaSyC9UfW6Tnnig9a5B-E0Nu73Mhro2ck-XHo",
    authDomain: "torneopokemon-86318.firebaseapp.com",
    databaseURL: "https://torneopokemon-86318-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "torneopokemon-86318",
    storageBucket: "torneopokemon-86318.firebasestorage.app",
    messagingSenderId: "682695753268",
    appId: "1:682695753268:web:9aedbdb22bf1561dc69461"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.getElementById('btn-entrar').onclick = async () => {
    // Obtenemos los valores y limpiamos espacios
    const u = document.getElementById('user').value.toLowerCase().trim();
    const p = document.getElementById('pass').value;
    const errorMsg = document.getElementById('error');
    
    // Ocultamos el error al intentar de nuevo
    errorMsg.style.display = 'none';

    if (!u || !p) {
        errorMsg.textContent = "¡RELLENA TODOS LOS CAMPOS!";
        errorMsg.style.display = 'block';
        return;
    }

    try {
        // Buscamos al entrenador en el nodo 'Clientes'
        const snapshot = await get(ref(db, `Clientes/${u}`));
        
        if (snapshot.exists()) {
            const datosUsuario = snapshot.val();
            
            // Verificamos la contraseña guardada en tu BBDD
            if (datosUsuario.contraseña === p) {
                // Guardamos la sesión localmente
                localStorage.setItem('entrenadorId', u); 
                // Redirigimos al panel
                window.location.href = 'index.html';
            } else {
                errorMsg.textContent = "¡CONTRASEÑA INCORRECTA!";
                errorMsg.style.display = 'block';
            }
        } else {
            errorMsg.textContent = "¡EL ENTRENADOR NO EXISTE!";
            errorMsg.style.display = 'block';
        }
    } catch (e) {
        console.error("Error en la conexión:", e);
        errorMsg.textContent = "ERROR DE CONEXIÓN";
        errorMsg.style.display = 'block';
    }
};