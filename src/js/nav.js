// ── Récupération du vent depuis le sessionStorage ATIS ───────
function getVent() {
    let oaciDepart = sessionStorage.getItem("aerodrome-depart") || "";

    // Le vent est stocké sous forme "280° / 12 kt (rafales 18 kt)"
    // On récupère direction et vitesse
    let ventBrut = sessionStorage.getItem(oaciDepart + "-vent") || "";

    let direction = 0;
    let vitesse   = 0;

    // Tenter de lire depuis le METAR sauvegardé
    let matchDir = ventBrut.match(/(\d+)°/);
    let matchVit = ventBrut.match(/(\d+)\s*kt/);

    if (matchDir) direction = parseInt(matchDir[1]);
    if (matchVit) vitesse   = parseInt(matchVit[1]);

    return { direction, vitesse };
}

// ── Calcul de la vitesse vraie (TAS) ────────────────────────
function calculerTAS(ias, altitude) {
    if (!ias || ias <= 0) return 0;
    return ias * (1 + 0.02 * altitude / 1000);
}

// ── Calcul de la composante vent ────────────────────────────
function calculerComposanteVent(cap, vent) {
    let angleRad = (vent.direction - cap) * Math.PI / 180;
    return vent.vitesse * Math.cos(angleRad);
}

// ── Calcul vitesse sol ───────────────────────────────────────
function calculerVS(ias, altitude, cap) {
    let vent = getVent();
    let tas  = calculerTAS(ias, altitude);
    let composante = calculerComposanteVent(cap, vent);
    let vs = tas - composante;
    return Math.round(vs);
}

// ── Calcul du temps en minutes ───────────────────────────────
function calculerTemps(distanceNM, vs) {
    if (!vs || vs <= 0 || !distanceNM || distanceNM <= 0) return 0;
    return Math.round((distanceNM / vs) * 60);
}

// ── Mettre à jour tous les calculs du tableau ────────────────
function recalculerTout() {
    let lignes = document.querySelectorAll("#tbody-nav tr");
    let tempsCumule    = 0;
    let distanceCumulee = 0;

    lignes.forEach(function(tr) {
        let altitude  = parseFloat(tr.querySelector(".col-altitude").value)  || 0;
        let vi        = parseFloat(tr.querySelector(".col-vi").value)         || 0;
        let cap       = parseFloat(tr.querySelector(".col-azimut").value)     || 0;
        let distance  = parseFloat(tr.querySelector(".col-distance").value)   || 0;

        let vs    = vi > 0 ? calculerVS(vi, altitude, cap) : 0;
        let temps = calculerTemps(distance, vs);

        distanceCumulee += distance;
        tempsCumule     += temps;

        tr.querySelector(".col-vs").textContent           = vs > 0 ? vs : "—";
        tr.querySelector(".col-temps").textContent        = temps > 0 ? temps : "—";
        tr.querySelector(".col-temps-cum").textContent    = tempsCumule > 0 ? tempsCumule : "—";
        tr.querySelector(".col-dist-cum").textContent     = distanceCumulee > 0 ? distanceCumulee.toFixed(1) : "—";
    });

    sauvegarderNav();
}

// ── Créer une ligne ──────────────────────────────────────────
function creerLigneNav(data = {}) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
        <td><input type="text"   class="input-nav col-point"    placeholder="ex: VOR BRY" value="${data.point    || ""}"></td>
        <td><input type="number" class="input-nav col-altitude"  placeholder="2000"        value="${data.altitude || ""}"></td>
        <td><input type="number" class="input-nav col-vi"        placeholder="100"         value="${data.vi       || ""}"></td>
        <td class="col-vs readonly-nav">—</td>
        <td><input type="number" class="input-nav col-azimut"    placeholder="270"         value="${data.azimut   || ""}"></td>
        <td><input type="number" class="input-nav col-distance"  placeholder="25"          value="${data.distance || ""}"></td>
        <td class="col-temps readonly-nav">—</td>
        <td class="col-temps-cum readonly-nav">—</td>
        <td class="col-dist-cum readonly-nav">—</td>
        <td><input type="text"   class="input-nav col-obs"       placeholder="Remarques"   value="${data.obs      || ""}"></td>
        <td><button type="button" class="btnSupprimerLigne">✕</button></td>
    `;

    // Recalculer à chaque saisie
    tr.querySelectorAll("input").forEach(function(input) {
        input.addEventListener("input", recalculerTout);
    });

    // Supprimer la ligne
    tr.querySelector(".btnSupprimerLigne").addEventListener("click", function() {
        tr.remove();
        recalculerTout();
    });

    return tr;
}

// ── Sauvegarder le tableau dans le sessionStorage ────────────
function sauvegarderNav() {
    let lignes = [];
    document.querySelectorAll("#tbody-nav tr").forEach(function(tr) {
        lignes.push({
            point:    tr.querySelector(".col-point").value,
            altitude: tr.querySelector(".col-altitude").value,
            vi:       tr.querySelector(".col-vi").value,
            azimut:   tr.querySelector(".col-azimut").value,
            distance: tr.querySelector(".col-distance").value,
            obs:      tr.querySelector(".col-obs").value
        });
    });
    sessionStorage.setItem("nav-lignes", JSON.stringify(lignes));
}

// ── Initialisation ───────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function() {

    let tbody  = document.getElementById("tbody-nav");
    let lignes = JSON.parse(sessionStorage.getItem("nav-lignes") || "[]");

    if (lignes.length === 0) {
        tbody.appendChild(creerLigneNav());
        tbody.appendChild(creerLigneNav());
    } else {
        lignes.forEach(function(l) {
            tbody.appendChild(creerLigneNav(l));
        });
    }

    recalculerTout();

    document.getElementById("btnAjouterPoint").addEventListener("click", function() {
        tbody.appendChild(creerLigneNav());
        recalculerTout();
    });

});