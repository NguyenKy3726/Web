const sections = document.querySelectorAll('.section[id]');
const links = document.querySelectorAll('.sidebar__link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
});

links.forEach(l => {
    l.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(l.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
