let ecTotal = 0; 
const maxEC = 60; 
const targetEC = 45; 

document.addEventListener('DOMContentLoaded', () => {
    calculateECTotal();
    updateProgressBar();
});

function calculateECTotal() {
    const tableRows = document.querySelectorAll('#courses tbody tr');

    ecTotal = 0; // Reset ecTotal before calculation

    tableRows.forEach((row, rowIndex) => {
        const cells = row.cells;

        // Controleer of er voldoende cellen zijn voor de grade en EC
        if (cells.length >= 5) {
            const gradeCell = cells[3]; // Grade column (index 3)
            const ecCell = cells[4]; // EC column (index 4)

            // Zorg ervoor dat de grade en EC cellen bestaan
            if (gradeCell && ecCell) {
                const grade = parseFloat(gradeCell.textContent);
                const ec = parseFloat(ecCell.textContent.replace(',', '.')); // Zorg voor correcte parsing

                // Tel de EC's op als de grade 5.5 of hoger is
                if (grade >= 5.5) {
                    ecTotal += ec; // Voeg de EC toe aan ecTotal
                    console.log("Grade: ", grade, "EC: ", ec, "Current EC Total: ", ecTotal);
                }
            }
        } else {
            console.log(`Row ${rowIndex} is missing enough cells.`);
        }
    });

    // Update de voortgangsbalk en weergave na berekening
    updateProgressBar();
}

function updateProgressBar() {
    const progressBar = document.getElementById('ecProgressBar');
    const ecCount = document.getElementById('ecCount');

    progressBar.value = ecTotal;
    progressBar.max = maxEC;
    ecCount.textContent = ecTotal.toFixed(2); // Display with two decimal places
}
