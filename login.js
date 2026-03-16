import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC9UfW6Tnnig9a5B-E0Nu73Mhro2ck-XHo",
    authDomain: "torneopokemon-86318.firebaseapp.com",
    databaseURL: "https://torneopokemon-86318-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "torneopokemon-86318",
    storageBucket: "torneopokemon-86318.firebasestorage.app",
    appId: "1:682695753268:web:9aedbdb22bf1561dc69461"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.getElementById('btn-entrar').onclick = async () => {
    const u = document.getElementById('user').value.toLowerCase().trim();
    const p = document.getElementById('pass').value;
    const errorMsg = document.getElementById('error');

    if (!u || !p) return;

    try {
        // Buscamos en la nueva tabla 'Clientes' que acabamos de limpiar
        const snapshot = await get(ref(db, `Clientes/${u}`));
        
        if (snapshot.exists()) {
            const datos = snapshot.val();
            if (datos.contraseña === p) {
                localStorage.setItem('entrenadorId', u);
                // Redirigimos al INDEX para que vea su nombre arriba
                window.location.href = 'index.html';
            } else {
                errorMsg.classList.remove('hidden');
            }
        } else {
            errorMsg.classList.remove('hidden');
        }
    } catch (e) {
        console.error("Error de acceso:", e);
    }
};