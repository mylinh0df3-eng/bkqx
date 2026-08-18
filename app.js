function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
}
document.getElementById('introButtons').style.display = 'block';
document.querySelector('[data-action="write"]').addEventListener('click', () => showPage('letter-choice'));
document.querySelector('[data-action="browse"]').addEventListener('click', () => showPage('home'));
