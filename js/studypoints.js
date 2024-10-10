let ecTotal = 0;
const maxEC = 60;
const targetEC = 45;

document.addEventListener('DOMContentLoaded', () => {
  calculateECTotal();
  updateProgressBar();
  setupCourseForm();
});

function calculateECTotal() {
  const tableRows = document.querySelectorAll('#courses tbody tr');
  ecTotal = 0;

  tableRows.forEach((row) => {
    const cells = row.cells;

    if (cells.length >= 5) {
      const gradeCell = cells[3];
      const ecCell = cells[4];

      if (gradeCell && ecCell) {
        const grade = parseFloat(gradeCell.textContent);
        const ec = parseFloat(ecCell.textContent.replace(',', '.'));

        if (!isNaN(grade)) {
          if (grade >= 5.5) {
            ecTotal += ec;
            row.classList.add('grade-sufficient');
          } else if (grade > 0 && grade < 5.5) {
            row.classList.add('grade-insufficient');
          }
        } else {
          row.classList.add('grade-incomplete');
        }
      }
    }
  });
  updateProgressBar();
}

function updateProgressBar() {
  const progressBar = document.getElementById('ecProgressBar');
  const ecCount = document.getElementById('ecCount');
  const nbsaWarning = document.getElementById('nbsaWarning');

  progressBar.value = ecTotal;
  progressBar.max = maxEC;
  ecCount.textContent = ecTotal.toFixed(2);

  nbsaWarning.style.display = ecTotal < targetEC ? 'block' : 'none';
}

function setupCourseForm() {
  const form = document.getElementById('addCourseForm');
  const showFormBtn = document.getElementById('addCourseButton');
  const popup = document.getElementById('coursePopup');
  const closePopup = document.querySelector('.close');

  showFormBtn.addEventListener('click', () => {
    popup.style.display = 'block';
  });

  closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const courseQuarter = document.getElementById('courseQuarter').value;
    const courseName = document.getElementById('courseName').value;
    const courseExams = document.getElementById('courseExams').value;
    const courseGrade = parseFloat(document.getElementById('courseGrade').value);
    const courseEC = parseFloat(document.getElementById('courseEC').value);


    if (courseGrade < 0 || courseEC < 0) {
      alert("Grade and EC must be non-negative values.");
      return;
    }

    addNewCourseToTable(courseQuarter, courseName, courseExams, courseGrade, courseEC);

    calculateECTotal();
    updateProgressBar();

    popup.style.display = 'none'; 
  });

  window.addEventListener('click', (event) => {
    if (event.target === popup) {
      popup.style.display = 'none';
    }
  });
}

function addNewCourseToTable(quarter, name, exams, grade, ec) {
  const tableBody = document.querySelector('#courses tbody');
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${quarter}</td>
    <td>${name}</td>
    <td>${exams}</td>
    <td>${grade}</td>
    <td>${ec}</td>
  `;

  tableBody.appendChild(newRow);
}
