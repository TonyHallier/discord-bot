// /utils/errorHandler.js
const fs = require('fs');
const path = require('path');

// Suivi des erreurs
let errorTracker = {}; 

// Fonction pour enregistrer les erreurs dans un fichier de log
function logError(commandName, error, lineNumber) {
    const logMessage = `
    [${new Date().toISOString()}] Commande: ${commandName}
    Erreur: ${error.message}
    Lignes affectées: L${lineNumber} - ${error.stack.split('\n')[1].trim()}
    ------------------------------------------
    `;
    
    fs.appendFileSync(path.join(__dirname, '../logs/errorLogs.txt'), logMessage);
}

// Fonction pour incrémenter et vérifier les erreurs
function handleError(commandName, error) {
    if (!errorTracker[commandName]) {
        errorTracker[commandName] = { count: 0 };
    }

    errorTracker[commandName].count++;

    // Si une commande a échoué 3 fois, on log l'erreur
    if (errorTracker[commandName].count >= 3) {
        logError(commandName, error, error.stack.split('\n')[1].trim());
        errorTracker[commandName].count = 0;  // Réinitialiser après 3 erreurs
    }
}

module.exports = { handleError };
