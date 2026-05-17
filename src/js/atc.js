document.addEventListener("DOMContentLoaded", async function() {

    // ── Fréquences ──────────────────────────────────────────
    let oaciDepart      = sessionStorage.getItem("aerodrome-depart");
    let oaciDestination = sessionStorage.getItem("aerodrome-destination");

    if (oaciDepart && oaciDepart.length === 4) {
        let frequences = await getFrequences(oaciDepart);
        afficherFrequences(frequences, oaciDepart, "tableau-depart", "titre-depart");
    }

    if (oaciDestination && oaciDestination.length === 4) {
        let frequences = await getFrequences(oaciDestination);
        afficherFrequences(frequences, oaciDestination, "tableau-destination", "titre-destination");
    }

    // ── Textareas ────────────────────────────────────────────
    sauvegarderChamp("atc-mise-en-route");
    sauvegarderChamp("atc-taxi");
    sauvegarderChamp("atc-croisiere");
    sauvegarderChamp("atc-approche");
    sauvegarderChamp("atc-parking");

    // ── Lignes intermédiaires ────────────────────────────────
    let tbody = document.getElementById("tableau-intermediaires");
    let lignesSauvegardees = JSON.parse(sessionStorage.getItem("atc-intermediaires") || "[]");

    if (lignesSauvegardees.length === 0) {
        tbody.appendChild(creerLigne("", ""));
        tbody.appendChild(creerLigne("", ""));
    } else {
        lignesSauvegardees.forEach(function(l) {
            tbody.appendChild(creerLigne(l.indicatif, l.frequence));
        });
    }

    // ── Bouton ajouter ───────────────────────────────────────
    document.getElementById("btnAjouterLigne").addEventListener("click", function() {
        tbody.appendChild(creerLigne("", ""));
        sauvegarderIntermediaires();
    });

});

// ── Créer une ligne intermédiaire ────────────────────────────
function creerLigne(indicatif, frequence) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
        <td><input type="text" class="input-intermediaire" placeholder="ex: LFBD_CTR" value="${indicatif}"></td>
        <td><input type="text" class="input-intermediaire" placeholder="ex: 127.900" value="${frequence}"></td>
        <td><button type="button" class="btnSupprimerLigne">✕</button></td>
    `;

    tr.querySelectorAll("input").forEach(function(input) {
        input.addEventListener("input", sauvegarderIntermediaires);
    });

    tr.querySelector(".btnSupprimerLigne").addEventListener("click", function() {
        tr.remove();
        sauvegarderIntermediaires();
    });

    return tr;
}

// ── Sauvegarder les lignes intermédiaires ────────────────────
function sauvegarderIntermediaires() {
    let lignes = [];
    document.querySelectorAll("#tableau-intermediaires tr").forEach(function(tr) {
        let inputs = tr.querySelectorAll("input");
        lignes.push({
            indicatif: inputs[0].value,
            frequence:  inputs[1].value
        });
    });
    sessionStorage.setItem("atc-intermediaires", JSON.stringify(lignes));
}

// ── Extraire le nom de la ville depuis les descriptions ──────
function extraireVille(frequences) {
    for (let f of frequences) {
        let mots = f.description.split(" ");
        if (mots.length >= 2) {
            return mots.slice(0, -1).join(" ");
        }
    }
    return "";
}

// ── Récupérer les fréquences depuis le CSV ───────────────────
async function getFrequences(oaci) {
    let response   = await fetch("../../assets/data/airport-frequencies.csv");
    let texte      = await response.text();
    let lignes     = texte.split("\n");
    let frequences = [];

    lignes.forEach(function(ligne) {
        if (ligne.includes('"' + oaci + '"')) {
            let colonnes = ligne.split(",");
            let type     = colonnes[3].replace(/"/g, "");

            if (type !== "ATIS") {
                frequences.push({
                    type:        type,
                    description: colonnes[4].replace(/"/g, ""),
                    frequence:   colonnes[5].replace(/"/g, "")
                });
            }
        }
    });

    return frequences;
}

// ── Afficher les fréquences dans le tableau ──────────────────
function afficherFrequences(frequences, oaci, idTableau, idTitre) {
    let tbody = document.getElementById(idTableau);
    let titre = document.getElementById(idTitre);
    tbody.innerHTML = "";

    if (frequences.length === 0) {
        titre.textContent = "Aucune fréquence trouvée pour " + oaci;
        return;
    }

    let ville = extraireVille(frequences);
    titre.textContent = "Fréquences de " + oaci + " — " + ville;

    frequences.forEach(function(f) {
        tbody.innerHTML += `<tr>
            <td>${f.type}</td>
            <td>${f.frequence}</td>
        </tr>`;
    });
}