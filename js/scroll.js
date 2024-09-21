document.querySelector('.scroll-down').addEventListener('click', function(e) {
    e.preventDefault(); 
    document.querySelector('#motivatie').scrollIntoView({
      behavior: 'smooth'
    });
  });