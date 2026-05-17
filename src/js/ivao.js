// Au chargement — restaure ET branche la sauvegarde automatique
sauvegarderChamp("indicatif-appel");
sauvegarderChamp("regime-vol");
sauvegarderChamp("type-vol");
sauvegarderChamp("nombre");
sauvegarderChamp("type-appareil");
sauvegarderChamp("aerodrome-depart");
sauvegarderChamp("heure-depart");
sauvegarderChamp("vitesse-croisiere");
sauvegarderChamp("niveau-croisiere");
sauvegarderChamp("aerodrome-destination");
sauvegarderChamp("aerodrome-deroutement");
sauvegarderChamp("personne-bord");


mettreEnMajuscules("aerodrome-depart");
mettreEnMajuscules("aerodrome-destination");
mettreEnMajuscules("aerodrome-deroutement");

document.getElementById("btnEnregistrer").addEventListener("click", function() {
    let valide = true;

    if (!validerIndicatif("indicatif-appel"))      valide = false;
    if (!validerOACI("aerodrome-depart"))           valide = false;
    if (!validerOACI("aerodrome-destination"))      valide = false;
    if (!validerOACI("aerodrome-deroutement"))      valide = false;
    if (!validerPersonneABord("personne-bord"))     valide = false;
    if (!validerHeure("heure-depart"))              valide = false;

    if (valide) {
        // Sauvegarde manuelle de tous les champs
        let ids = [
            "indicatif-appel", "regime-vol", "type-vol", "nombre",
            "type-appareil", "aerodrome-depart", "heure-depart",
            "vitesse-croisiere", "niveau-croisiere", "aerodrome-destination",
            "aerodrome-deroutement", "personne-bord"
        ];
        ids.forEach(function(id) {
            sessionStorage.setItem(id, document.getElementById(id).value);
        });

        alert("Formulaire enregistré !");
    } else {
        alert("Formulaire invalide !");
    }
});

document.getElementById("btnExporter").addEventListener("click", function(){
    let exporter = false;

    if(!exporter){
        alert("Impossible d'exporter le plan de vol");
    }

});

document.getElementById("btnReinitialiser").addEventListener("click", function() {
    let confirmation = confirm("Voulez-vous vraiment réinitialiser le formulaire ?");

    if (confirmation) {
        sessionStorage.clear();
        // Vider manuellement les champs avant le reload
        document.querySelectorAll("input, select, textarea").forEach(function(champ) {
            champ.value = "";
        });
        location.reload();
    }
});

document.getElementById("btnParDefaut").addEventListener("click", function() {
    let maintenant = new Date();
    maintenant.setMinutes(maintenant.getMinutes() + 10);
    let heures  = maintenant.getHours().toString().padStart(2, "0");
    let minutes = maintenant.getMinutes().toString().padStart(2, "0");

    document.getElementById("indicatif-appel").value       = "FBNXS";
    document.getElementById("aerodrome-depart").value      = "LFRN";
    document.getElementById("heure-depart").value          = heures + ":" + minutes;
    document.getElementById("aerodrome-destination").value = "LFRS";
    document.getElementById("aerodrome-deroutement").value = "LFRB";
    document.getElementById("personne-bord").value         = 2;

    // Sauvegarder immédiatement
    sessionStorage.setItem("indicatif-appel",        "FBNXS");
    sessionStorage.setItem("aerodrome-depart",       "LFRN");
    sessionStorage.setItem("heure-depart",           heures + ":" + minutes);
    sessionStorage.setItem("aerodrome-destination",  "LFRS");
    sessionStorage.setItem("aerodrome-deroutement",  "LFRB");
    sessionStorage.setItem("personne-bord",          "2");
});