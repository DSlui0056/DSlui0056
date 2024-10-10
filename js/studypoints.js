let ecTotal = 0;
const maxEC = 60;
const targetEC = 45;
let currentRow = null;

document.addEventListener('DOMContentLoaded', () => {
  loadCoursesFromStorage();
  calculateECTotal();
  updateProgressBar();
  setupCourseForm();
  setupPopupClose();
});

function setupPopupClose() {
  const closeAddPopup = document.querySelector('.close');
  const coursePopup = document.getElementById('coursePopup');

  closeAddPopup.addEventListener('click', () => {
    coursePopup.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === coursePopup) {
      coursePopup.style.display = 'none';
    }
  });
}

function loadCoursesFromStorage() {
  const courses = JSON.parse(localStorage.getItem('courses')) || [];
  courses.sort((a, b) => {
    const order = {
      'Block 1 S1': 1,
      'Block 2 S1': 2,
      'Block 1 S2': 3,
      'Block 2 S2': 4,
    };

    return (order[a.quarter] || Infinity) - (order[b.quarter] || Infinity);
  });

  courses.forEach(course => {
    if (!isCourseInTable(course.name)) {
      const displayGrade = (course.grade !== null && !isNaN(course.grade)) ? course.grade : '';
      const displayEC = (course.ec !== null && !isNaN(course.ec)) ? course.ec : '';
      addNewCourseToTable(course.quarter, course.name, course.exams, displayGrade, displayEC);
    }
  });
}

function isCourseInTable(courseName) {
  const tableRows = document.querySelectorAll('#courses tbody tr');
  return Array.from(tableRows).some(row => row.cells[1].textContent === courseName);
}

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
            row.classList.remove('grade-insufficient', 'grade-incomplete');
          } else if (grade > 0 && grade < 5.5) {
            row.classList.add('grade-insufficient');
            row.classList.remove('grade-sufficient', 'grade-incomplete');
          }
        } else {
          row.classList.add('grade-incomplete');
          row.classList.remove('grade-sufficient', 'grade-insufficient');
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
  const addForm = document.getElementById('addCourseForm');
  const showFormBtn = document.getElementById('addCourseButton');
  const editPopup = document.getElementById('editCoursePopup');
  const closeEditPopup = document.querySelector('.close-edit');
  const submitButton = addForm.querySelector('button[type="submit"]');

  showFormBtn.addEventListener('click', () => {
    const popup = document.getElementById('coursePopup');
    popup.style.display = 'block';
    resetAddForm();
    submitButton.textContent = 'Toevoegen';
  });

  closeEditPopup.addEventListener('click', () => {
    editPopup.style.display = 'none';
  });

  addForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const courseQuarter = document.getElementById('addCourseQuarter').value;
    const courseName = document.getElementById('addCourseName').value;
    const courseExams = document.getElementById('addCourseExams').value;
    const courseGrade = parseFloat(document.getElementById('addCourseGrade').value);
    const courseEC = parseFloat(document.getElementById('addCourseEC').value.replace(',', '.'));

    if (courseGrade < 0 || courseEC < 0) {
      alert("Grade and EC must be non-negative values.");
      return;
    }

    if (currentRow) {
      updateCourseInTable(courseQuarter, courseName, courseExams, courseGrade, courseEC);
      editPopup.style.display = 'none';
    } else {
      addNewCourseToTable(courseQuarter, courseName, courseExams, courseGrade, courseEC);
    }

    calculateECTotal();
    updateProgressBar();
    const popup = document.getElementById('coursePopup');
    popup.style.display = 'none';
    currentRow = null;
  });

  const editForm = document.getElementById('editCourseForm');
  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const courseQuarter = document.getElementById('editCourseQuarter').value;
    const courseName = document.getElementById('editCourseName').value;
    const courseExams = document.getElementById('editCourseExams').value;
    const courseGrade = parseFloat(document.getElementById('editCourseGrade').value);
    const courseEC = parseFloat(document.getElementById('editCourseEC').value.replace(',', '.'));

    if (courseGrade < 0 || courseEC < 0) {
      alert("Grade and EC must be non-negative values.");
      return;
    }

    updateCourseInTable(courseQuarter, courseName, courseExams, courseGrade, courseEC);
    editPopup.style.display = 'none';
    updateProgressBar();
  });
}

function addNewCourseToTable(quarter, name, exams, grade, ec) {
  const tableBody = document.querySelector('#courses tbody');
  const newRow = document.createElement('tr');

  const displayGrade = (grade !== null && !isNaN(grade)) ? grade : '';
  const displayEC = (ec !== null && !isNaN(ec)) ? ec : '';

  newRow.innerHTML = `
      <td>${quarter}</td>
      <td>${name}</td>
      <td>${exams}</td>
      <td>${displayGrade}</td>
      <td>${displayEC}</td>
      <td>
        <button class="edit-btn">Bewerk</button>
        <button class="delete-btn">Verwijder</button>
      </td>
    `;

  const deleteBtn = newRow.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => {
    tableBody.removeChild(newRow);
    removeCourseFromStorage(name);
    calculateECTotal();
  });

  const editBtn = newRow.querySelector('.edit-btn');
  editBtn.addEventListener('click', () => {
    loadCourseForEditing(newRow);
    const popup = document.getElementById('editCoursePopup');
    popup.style.display = 'block';
  });

  tableBody.appendChild(newRow);
  saveCourseToStorage(quarter, name, exams, grade, ec);
}

function updateCourseInTable(quarter, name, exams, grade, ec) {
  currentRow.cells[0].textContent = quarter;
  currentRow.cells[1].textContent = name;
  currentRow.cells[2].textContent = exams;

  currentRow.cells[3].textContent = (grade !== null && !isNaN(grade)) ? grade : '';
  currentRow.cells[4].textContent = (ec !== null && !isNaN(ec)) ? ec : '';

  if (!isNaN(grade)) {
    if (grade >= 5.5) {
      currentRow.classList.add('grade-sufficient');
      currentRow.classList.remove('grade-insufficient', 'grade-incomplete');
    } else if (grade > 0 && grade < 5.5) {
      currentRow.classList.add('grade-insufficient');
      currentRow.classList.remove('grade-sufficient', 'grade-incomplete');
    } else {
      currentRow.classList.add('grade-incomplete');
      currentRow.classList.remove('grade-sufficient', 'grade-insufficient');
    }
  } else {
    currentRow.classList.add('grade-incomplete');
    currentRow.classList.remove('grade-sufficient', 'grade-insufficient');
  }

  updateCourseInStorage(name, quarter, exams, grade, ec);
}

function saveCourseToStorage(quarter, name, exams, grade, ec) {
  const courses = JSON.parse(localStorage.getItem('courses')) || [];
  const existingIndex = courses.findIndex(course => course.name === name);
  if (existingIndex === -1) {
    courses.push({ quarter, name, exams, grade, ec });
  } else {
    courses[existingIndex] = { quarter, name, exams, grade, ec };
  }
  localStorage.setItem('courses', JSON.stringify(courses));
}

function removeCourseFromStorage(name) {
  let courses = JSON.parse(localStorage.getItem('courses')) || [];
  courses = courses.filter(course => course.name !== name);
  localStorage.setItem('courses', JSON.stringify(courses));
}

function updateCourseInStorage(name, quarter, exams, grade, ec) {
  let courses = JSON.parse(localStorage.getItem('courses')) || [];
  const index = courses.findIndex(course => course.name === name);
  if (index !== -1) {
    courses[index] = { quarter, name, exams, grade, ec };
    localStorage.setItem('courses', JSON.stringify(courses));
  }
}

function loadCourseForEditing(row) {
  currentRow = row;
  document.getElementById('editCourseQuarter').value = row.cells[0].textContent;
  document.getElementById('editCourseName').value = row.cells[1].textContent;
  document.getElementById('editCourseExams').value = row.cells[2].textContent;
  document.getElementById('editCourseGrade').value = row.cells[3].textContent || '';
  document.getElementById('editCourseEC').value = row.cells[4].textContent || '';
}

function resetAddForm() {
  document.getElementById('addCourseQuarter').value = '';
  document.getElementById('addCourseName').value = '';
  document.getElementById('addCourseExams').value = '';
  document.getElementById('addCourseGrade').value = '';
  document.getElementById('addCourseEC').value = '';
}
