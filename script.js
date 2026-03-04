// Importamos lo necesario de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Tu configuración (la verás al registrar tu app web en el panel de Firebase)
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    databaseURL: "https://torneopokemon-XXXX.firebaseio.com",
    projectId: "torneopokemon-XXXX",
    appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Función para el Gachapon usando tus JSON locales
async function girarGachapon(idCliente) {
    try {
        // 1. Leemos tus Pokémon locales
        const response = await fetch('pokemon.json');
        const listaPokemon = await response.json();
        
        // 2. Elegimos uno al azar (Lógica de tu bot)
        const pkm = listaPokemon[Math.floor(Math.random() * listaPokemon.length)];
        const habs = ['mutatipo', 'pelaje recio', 'potencia']; // Puedes crear un habilidades.json también
        const hab = habs[Math.floor(Math.random() * habs.length)];

        // 3. Guardamos en Firebase (Tu tabla 'gachapon' del esquema SQL)
        const nuevaEntradaRef = push(ref(db, 'gachapon'));
        await set(nuevaEntradaRef, {
            id_cliente: idCliente,
            nombre: pkm,
            habilidad: hab,
            fecha: new Date().toISOString()
        });

        alert(`¡Te ha tocado un ${pkm} con ${hab}!`);
    } catch (error) {
        console.error("Error:", error);
    }
}