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

mettreEnMajuscules("indicatif-appel");
mettreEnMajuscules("aerodrome-depart");
mettreEnMajuscules("aerodrome-destination");
mettreEnMajuscules("aerodrome-deroutement");

// Bouton Enregistrer — uniquement la validation
document.getElementById("btnEnregistrer").addEventListener("click", function() {
    let valide = true;

    if (!validerIndicatif("indicatif-appel"))        valide = false;
    if (!validerOACI("aerodrome-depart"))             valide = false;
    if (!validerOACI("aerodrome-destination"))        valide = false;
    if (!validerOACI("aerodrome-deroutement"))        valide = false;
    if (!validerPersonneABord("personne-bord"))       valide = false;
    if (!validerHeure("heure-depart"))                valide = false;

    if (valide) {
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
        location.reload();
    }

});

document.getElementById("btnParDefaut").addEventListener("click", function() {
        let ind = document.getElementById("indicatif-appel");
        let depart= document.getElementById("aerodrome-depart");
        let heure= document.getElementById("heure-depart");
        let destination= document.getElementById("aerodrome-destination");
        let deroutement= document.getElementById("aerodrome-deroutement");
        let personne = document.getElementById("personne-bord");

        // Calculer l'heure actuelle + 10 minutes
        let maintenant = new Date();
        maintenant.setMinutes(maintenant.getMinutes() + 10);

        let heures  = maintenant.getHours().toString().padStart(2, "0");
        let minutes = maintenant.getMinutes().toString().padStart(2, "0");

        heure.value = heures + ":" + minutes;

        ind.value = "FBNXS";
        depart.value = "LFRN";
        heure.value = heures + ":" + minutes;
        destination.value = "LFRS";
        deroutement.value = "LFRB";
        personne.value = 2;
});