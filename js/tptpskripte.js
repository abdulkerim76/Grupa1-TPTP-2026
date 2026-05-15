let trenutniSlajd = 0;

function prikaziSlajd(n) {
    const slajdovi = document.querySelectorAll('.slajd');
    const tacke = document.querySelectorAll('.tacka');

    if (slajdovi.length === 0) return; 

    slajdovi.forEach(s => s.classList.remove('aktivno'));
    tacke.forEach(t => t.classList.remove('aktivno'));

    trenutniSlajd = (n + slajdovi.length) % slajdovi.length;

    slajdovi[trenutniSlajd].classList.add('aktivno');
    tacke[trenutniSlajd].classList.add('aktivno');
}

window.promijeniSlajd = function(smjer) {
    prikaziSlajd(trenutniSlajd + smjer);
}

window.idiNaSlajd = function(n) {
    prikaziSlajd(n);
}

setInterval(() => {
    promijeniSlajd(1);
}, 5000);

