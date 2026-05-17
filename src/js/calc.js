// ── Pente de montée / descente ───────────────────────────────
document.getElementById("btn-pente").addEventListener("click", function() {
    let altDepart = parseFloat(document.getElementById("pente-alt-depart").value) || 0;
    let altCible  = parseFloat(document.getElementById("pente-alt-cible").value)  || 0;
    let vs        = parseFloat(document.getElementById("pente-vs").value)          || 0;
    let taux      = parseFloat(document.getElementById("pente-taux").value)        || 0;

    if (vs <= 0 || taux <= 0) {
        alert("Veuillez renseigner la vitesse sol et le taux.");
        return;
    }

    let deltaAlt  = Math.abs(altCible - altDepart);         // ft
    let tempsMin  = deltaAlt / taux;                        // minutes
    let distanceNM = (vs * tempsMin) / 60;                  // NM
    let gradient  = (deltaAlt / (distanceNM * 6076)) * 100; // % (1 NM = 6076 ft)

    document.getElementById("pente-distance").textContent = distanceNM.toFixed(1) + " NM";
    document.getElementById("pente-temps").textContent    = tempsMin.toFixed(1) + " min";
    document.getElementById("pente-gradient").textContent = gradient.toFixed(1) + " %";
});

// ── Consommation carburant ───────────────────────────────────
document.getElementById("btn-carbu").addEventListener("click", function() {
    let conso   = parseFloat(document.getElementById("carbu-conso").value)   || 0;
    let duree   = parseFloat(document.getElementById("carbu-duree").value)   || 0;
    let reserve = parseFloat(document.getElementById("carbu-reserve").value) || 0;

    if (conso <= 0 || duree <= 0) {
        alert("Veuillez renseigner la consommation et la durée.");
        return;
    }

    let carbuTrajet  = (conso / 60) * duree;
    let carbuReserve = (conso / 60) * reserve;
    let carbuTotal   = carbuTrajet + carbuReserve;

    document.getElementById("carbu-trajet").textContent = carbuTrajet.toFixed(1);
    document.getElementById("carbu-res").textContent    = carbuReserve.toFixed(1);
    document.getElementById("carbu-total").textContent  = carbuTotal.toFixed(1);
});

// ── Temps de vol ─────────────────────────────────────────────
document.getElementById("btn-temps").addEventListener("click", function() {
    let distance = parseFloat(document.getElementById("temps-distance").value) || 0;
    let vs       = parseFloat(document.getElementById("temps-vs").value)       || 0;

    if (distance <= 0 || vs <= 0) {
        alert("Veuillez renseigner la distance et la vitesse sol.");
        return;
    }

    let tempsMin   = (distance / vs) * 60;
    let heures     = Math.floor(tempsMin / 60);
    let minutes    = Math.round(tempsMin % 60);
    let tempsHeure = heures + "h" + String(minutes).padStart(2, "0");

    document.getElementById("temps-min").textContent   = Math.round(tempsMin) + " min";
    document.getElementById("temps-heure").textContent = tempsHeure;
});

// ── Conversions ──────────────────────────────────────────────

// Vitesse — conversion en temps réel
document.getElementById("conv-kts").addEventListener("input", function() {
    let kts = parseFloat(this.value) || 0;
    document.getElementById("conv-kmh").value = (kts * 1.852).toFixed(1);
    document.getElementById("conv-mph").value = (kts * 1.15078).toFixed(1);
});

document.getElementById("conv-kmh").addEventListener("input", function() {
    let kmh = parseFloat(this.value) || 0;
    document.getElementById("conv-kts").value = (kmh / 1.852).toFixed(1);
    document.getElementById("conv-mph").value = (kmh / 1.60934).toFixed(1);
});

document.getElementById("conv-mph").addEventListener("input", function() {
    let mph = parseFloat(this.value) || 0;
    document.getElementById("conv-kts").value = (mph / 1.15078).toFixed(1);
    document.getElementById("conv-kmh").value = (mph * 1.60934).toFixed(1);
});

// Distance — conversion en temps réel
document.getElementById("conv-nm").addEventListener("input", function() {
    let nm = parseFloat(this.value) || 0;
    document.getElementById("conv-km").value = (nm * 1.852).toFixed(1);
});

document.getElementById("conv-km").addEventListener("input", function() {
    let km = parseFloat(this.value) || 0;
    document.getElementById("conv-nm").value = (km / 1.852).toFixed(1);
});

// Pression — conversion en temps réel
document.getElementById("conv-hpa").addEventListener("input", function() {
    let hpa = parseFloat(this.value) || 0;
    document.getElementById("conv-inhg").value = (hpa / 33.8639).toFixed(2);
});

document.getElementById("conv-inhg").addEventListener("input", function() {
    let inhg = parseFloat(this.value) || 0;
    document.getElementById("conv-hpa").value = (inhg * 33.8639).toFixed(1);
});

// Température — conversion en temps réel
document.getElementById("conv-celsius").addEventListener("input", function() {
    let c = parseFloat(this.value) || 0;
    document.getElementById("conv-fahrenheit").value = ((c * 9/5) + 32).toFixed(1);
});

document.getElementById("conv-fahrenheit").addEventListener("input", function() {
    let f = parseFloat(this.value) || 0;
    document.getElementById("conv-celsius").value = ((f - 32) * 5/9).toFixed(1);
});

// Carburant — densité Avgas = 0.72 kg/L, 1 gallon US = 3.785 L
const DENSITE_AVGAS = 0.72;
const LITRES_PAR_GALLON = 3.785;

document.getElementById("conv-litres").addEventListener("input", function() {
    let litres = parseFloat(this.value) || 0;
    document.getElementById("conv-kg").value      = (litres * DENSITE_AVGAS).toFixed(2);
    document.getElementById("conv-gallons").value = (litres / LITRES_PAR_GALLON).toFixed(2);
});

document.getElementById("conv-kg").addEventListener("input", function() {
    let kg = parseFloat(this.value) || 0;
    let litres = kg / DENSITE_AVGAS;
    document.getElementById("conv-litres").value  = litres.toFixed(2);
    document.getElementById("conv-gallons").value = (litres / LITRES_PAR_GALLON).toFixed(2);
});

document.getElementById("conv-gallons").addEventListener("input", function() {
    let gallons = parseFloat(this.value) || 0;
    let litres = gallons * LITRES_PAR_GALLON;
    document.getElementById("conv-litres").value = litres.toFixed(2);
    document.getElementById("conv-kg").value     = (litres * DENSITE_AVGAS).toFixed(2);
});