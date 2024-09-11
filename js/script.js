let ecTotal = 0; 
const maxEC = 45; 

function addEC() {
    const ecInput = document.getElementById('ecInput').value;
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = ""; 


    if (ecInput === "" || isNaN(ecInput)) {
        errorMsg.textContent = "Voer een geldig aantal EC's in.";
        return;
    }

    const ecToAdd = parseFloat(ecInput);
    if (ecToAdd < 0) {
        errorMsg.textContent = "Het aantal EC's moet positief zijn.";
        return;
    }

    if (ecTotal + ecToAdd > maxEC) {
        errorMsg.textContent = "Je kunt niet meer dan 45 EC's toevoegen.";
        return;
    }

    ecTotal += ecToAdd;

    document.getElementById('ecProgressBar').value = ecTotal;
    document.getElementById('ecCount').textContent = ecTotal;
    document.getElementById('ecInput').value = "";
}
