document.addEventListener("DOMContentLoaded", async function() {

    let oaciDepart      = sessionStorage.getItem("aerodrome-depart");
    let oaciDestination = sessionStorage.getItem("aerodrome-destination");
    let oaciDeroutement = sessionStorage.getItem("aerodrome-deroutement");

    if (oaciDepart)      await afficherATIS(oaciDepart,      "bloc-depart");
    if (oaciDestination) await afficherATIS(oaciDestination, "bloc-destination");
    if (oaciDeroutement) await afficherATIS(oaciDeroutement, "bloc-deroutement");

});

async function afficherATIS(oaci, idBloc) {
    let bloc = document.getElementById(idBloc);
    bloc.innerHTML = `<h2>${oaci}</h2><p class="chargement">Chargement...</p>`;

    try {
        let proxy = "https://corsproxy.io/?";

        let urlMetar = proxy + encodeURIComponent(`https://aviationweather.gov/api/data/metar?ids=${oaci}&format=json`);
        let urlTaf   = proxy + encodeURIComponent(`https://aviationweather.gov/api/data/taf?ids=${oaci}&format=json`);

        let responseMetar = await fetch(urlMetar);
        let dataMetar     = await responseMetar.json();

        let responseTaf   = await fetch(urlTaf);
        let dataTaf       = await responseTaf.json();

        if (!dataMetar || dataMetar.length === 0) {
            bloc.innerHTML = `<h2>${oaci}</h2><p class="erreur-atis">Aucune donnée disponible</p>`;
            return;
        }

        let m = dataMetar[0];

        // Heure d'observation
        let heure = m.obsTime
            ? new Date(m.obsTime * 1000).toUTCString()
            : "N/A";

        // Vent
        let vent = m.wdir !== undefined
            ? `${m.wdir}° / ${m.wspd} kt` + (m.wgst ? ` (rafales ${m.wgst} kt)` : "")
            : "N/A";

        // Nuages
        let nuages = extraireNuages(m);

        // QNH
        let qnh = m.altim ? `${m.altim} hPa (${(m.altim / 33.8639).toFixed(2)} inHg)` : "N/A";

        // Température / rosée
        let temp = (m.temp !== undefined && m.dewp !== undefined)
            ? `${m.temp}°C / Rosée : ${m.dewp}°C`
            : "N/A";

        // METAR brut
        let metarBrut = m.rawOb || "N/A";

        // TAF
        let taf = (dataTaf && dataTaf.length > 0 && dataTaf[0].rawTAF)
            ? dataTaf[0].rawTAF
            : "Aucun TAF disponible";

        bloc.innerHTML = `
            <h2>${oaci}</h2>
            <table class="table-atis">
                <tbody>
                    <tr><th>Heure d'observation</th><td>${heure}</td></tr>
                    <tr><th>Vent</th><td>${vent}</td></tr>
                    <tr><th>Nuages</th><td>${nuages}</td></tr>
                    <tr><th>QNH</th><td>${qnh}</td></tr>
                    <tr><th>Température / Rosée</th><td>${temp}</td></tr>
                    <tr><th>METAR brut</th><td class="metar-brut">${metarBrut}</td></tr>
                    <tr><th>TAF</th><td class="metar-brut">${taf}</td></tr>
                </tbody>
            </table>

            <table class="table-atis table-saisie">
                <thead>
                    <tr><th colspan="2">Informations locales</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Information en cours (IVAO)</th>
                        <td><input type="text" class="input-atis" id="${oaci}-info" placeholder="ex: Information Delta"></td>
                    </tr>
                    <tr>
                        <th>Piste de décollage</th>
                        <td><input type="text" class="input-atis" id="${oaci}-piste-depart" placeholder="ex: 28R"></td>
                    </tr>
                    <tr>
                        <th>Piste d'atterrissage</th>
                        <td><input type="text" class="input-atis" id="${oaci}-piste-arrivee" placeholder="ex: 28L"></td>
                    </tr>
                    <tr>
                        <th>Main du tour de piste</th>
                        <td>
                            <select class="input-atis" id="${oaci}-main">
                                <option value="">--</option>
                                <option value="gauche">Gauche</option>
                                <option value="droite">Droite</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>Procédure d'approche</th>
                        <td><input type="text" class="input-atis" id="${oaci}-approche" placeholder="ex: ILS 28L"></td>
                    </tr>
                    <tr>
                        <th>Transition</th>
                        <td><input type="text" class="input-atis" id="${oaci}-transition" placeholder="ex: ATREX 3A"></td>
                    </tr>
                    <tr>
                        <th>Notes</th>
                        <td><textarea class="input-atis" id="${oaci}-notes" placeholder="Remarques..."></textarea></td>
                    </tr>
                </tbody>
            </table>
        `;

        // Sauvegarder les champs locaux
        let champsLocaux = ["info", "piste-depart", "piste-arrivee", "main", "approche", "transition", "notes"];
        champsLocaux.forEach(function(champ) {
            sauvegarderChamp(`${oaci}-${champ}`);
        });

    } catch (e) {
        bloc.innerHTML = `
            <h2>${oaci}</h2>
            <p class="erreur-atis">Données METAR indisponibles — saisie manuelle</p>

            <table class="table-atis table-saisie">
                <thead>
                    <tr><th colspan="2">METAR manuel</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Heure d'observation</th>
                        <td><input type="text" class="input-atis" id="${oaci}-heure" placeholder="ex: 1230Z"></td>
                    </tr>
                    <tr>
                        <th>Vent</th>
                        <td><input type="text" class="input-atis" id="${oaci}-vent" placeholder="ex: 280° / 12 kt"></td>
                    </tr>
                    <tr>
                        <th>Nuages</th>
                        <td><input type="text" class="input-atis" id="${oaci}-nuages" placeholder="ex: SCT 2500 ft"></td>
                    </tr>
                    <tr>
                        <th>QNH</th>
                        <td><input type="text" class="input-atis" id="${oaci}-qnh" placeholder="ex: 1013 hPa"></td>
                    </tr>
                    <tr>
                        <th>Température / Rosée</th>
                        <td><input type="text" class="input-atis" id="${oaci}-temp" placeholder="ex: 18°C / 12°C"></td>
                    </tr>
                </tbody>
            </table>

            <table class="table-atis table-saisie">
                <thead>
                    <tr><th colspan="2">Informations locales</th></tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Information en cours (IVAO)</th>
                        <td><input type="text" class="input-atis" id="${oaci}-info" placeholder="ex: Information Delta"></td>
                    </tr>
                    <tr>
                        <th>Piste de décollage</th>
                        <td><input type="text" class="input-atis" id="${oaci}-piste-depart" placeholder="ex: 28R"></td>
                    </tr>
                    <tr>
                        <th>Piste d'atterrissage</th>
                        <td><input type="text" class="input-atis" id="${oaci}-piste-arrivee" placeholder="ex: 28L"></td>
                    </tr>
                    <tr>
                        <th>Main du tour de piste</th>
                        <td>
                            <select class="input-atis" id="${oaci}-main">
                                <option value="">--</option>
                                <option value="gauche">Gauche</option>
                                <option value="droite">Droite</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>Procédure d'approche</th>
                        <td><input type="text" class="input-atis" id="${oaci}-approche" placeholder="ex: ILS 28L"></td>
                    </tr>
                    <tr>
                        <th>Transition</th>
                        <td><input type="text" class="input-atis" id="${oaci}-transition" placeholder="ex: ATREX 3A"></td>
                    </tr>
                    <tr>
                        <th>Notes</th>
                        <td><textarea class="input-atis" id="${oaci}-notes" placeholder="Remarques..."></textarea></td>
                    </tr>
                </tbody>
            </table>
        `;

        // Sauvegarder tous les champs
        let champsManuel = ["heure", "vent", "nuages", "qnh", "temp"];
        let champsLocaux = ["info", "piste-depart", "piste-arrivee", "main", "approche", "transition", "notes"];

        [...champsManuel, ...champsLocaux].forEach(function(champ) {
            sauvegarderChamp(`${oaci}-${champ}`);
        });
    }
    
}

function extraireNuages(m) {
    let couches = [];

    let niveaux = [
        { cvg: m.cldCvg1, bas: m.cldBas1 },
        { cvg: m.cldCvg2, bas: m.cldBas2 },
        { cvg: m.cldCvg3, bas: m.cldBas3 }
    ];

    niveaux.forEach(function(n) {
        if (n.cvg && n.cvg !== "CLR" && n.cvg !== "SKC") {
            couches.push(`${n.cvg} à ${n.bas} ft`);
        } else if (n.cvg === "CLR" || n.cvg === "SKC") {
            couches.push("Ciel dégagé");
        }
    });

    return couches.length > 0 ? couches.join(" — ") : "N/A";
}