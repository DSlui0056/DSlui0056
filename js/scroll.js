document.querySelector('.scroll-down').addEventListener('click', function(e) {
    e.preventDefault(); 
    document.querySelector('#motivatie-experience').scrollIntoView({
      behavior: 'smooth'
    });
  });