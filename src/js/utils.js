function mettreEnMajuscules(id){
    let champ = document.getElementById(id);

    champ.addEventListener("input", function() {
        this.value = this.value.toUpperCase();
        this.value = this.value.replace(/[^A-Z]/g, "");
    });
}

function validerOACI(id) {
    let champ = document.getElementById(id);

    if (champ.value.length !=4){
        champ.classList.add("champ-erreur");
        console.log("Erreur sur " + id);
        return false;
    }
    else {
        champ.classList.remove("champ-erreur");
        return true;
    }
}

function validerIndicatif(id) {
    let champ = document.getElementById(id);

    if (champ.value.length != 5) {
        champ.classList.add("champ-erreur");
        console.log("Erreur sur " + id);
        return false;
    } else {
        champ.classList.remove("champ-erreur");
        return true;
    }
}

function validerPersonneABord(id) {
    let champ = document.getElementById(id);

    if (champ.value === "") {
        champ.classList.add("champ-erreur");
        console.log(id + " est vide");
        return false;
    }
    else if (isNaN(champ.value)) {
        champ.classList.add("champ-erreur");
        console.log(id + " n'est pas un nombre valide");
        return false;
    }
    else if (champ.value <= 0) {
        champ.classList.add("champ-erreur");
        console.log(id + " est négatif");
        return false;
    }
    else {
        champ.classList.remove("champ-erreur");
        return true;
    }
}

function validerHeure(id) {
    let champ = document.getElementById(id);

    if (champ.value === "") {
        champ.classList.add("champ-erreur");
        console.log(id + " est vide");
        return false;
    }

    // Récupérer l'heure actuelle en format HH:MM
    let maintenant = new Date();
    let heureActuelle = maintenant.getHours().toString().padStart(2, "0")
                      + ":"
                      + maintenant.getMinutes().toString().padStart(2, "0");

    if (champ.value <= heureActuelle) {
        champ.classList.add("champ-erreur");
        console.log(id + " est dans le passé !");
        return false;
    } else {
        champ.classList.remove("champ-erreur");
        return true;
    }
}

function sauvegarderChamp(id) {
    let champ = document.getElementById(id);

    let valeurSauvegardee = sessionStorage.getItem(id);

    if (valeurSauvegardee !== null) {
        champ.value = valeurSauvegardee;  // restaurer si déjà sauvegardé
    } else {
        sessionStorage.setItem(id, champ.value);  // sauvegarder la valeur par défaut
    }

    champ.addEventListener("change", function() {
        sessionStorage.setItem(id, this.value);
    });
}

function insererUneDonnee(id, donnee){
    let champ = document.getElementById(id);
    champ.value = donnee;
}