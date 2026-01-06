
// Scroll suave para seções
document.querySelectorAll('h2').forEach(heading => {
  heading.style.scrollMarginTop = '80px';
});

// Scroll suave para links de navegação
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

console.log('Script carregado');
