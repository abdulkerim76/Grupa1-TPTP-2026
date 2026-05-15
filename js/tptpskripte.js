///////////////////////////////////////////////////////////////////////////////////////////

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



///////////////////////////////////////////////////////////////////////////////////////////
// --- MODAL FUNKCIJE ---
function prikaziModal(naslov, poruka, ikona) {
    const modal = document.getElementById("mojModal");
    document.getElementById("modalNaslov").innerText = naslov;
    document.getElementById("modalPoruka").innerText = poruka;
    document.getElementById("modalIkona").innerText = ikona;
    modal.style.display = "block";
}

function zatvoriModal() {
    document.getElementById("mojModal").style.display = "none";
}

// --- TEMA ---
const themeToggle = document.getElementById('theme-toggle');
if(themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
    
        if(document.body.classList.contains('light-mode') ){ 
            document.getElementById('tema-tekst').textContent = 'Light Mode';

        }else { 
             document.getElementById('tema-tekst').textContent = 'Dark Mode';

        }
       
    });
}


const inputDatum = document.getElementById('inputDatum');
if(inputDatum) {
    const danas = new Date().toISOString().split('T')[0];
    inputDatum.setAttribute('min', danas);
    inputDatum.value = danas;
}


const formaRez = document.getElementById('formaRezervacija');
if(formaRez) {
    formaRez.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const ime = document.getElementById('ime').value;
        const brojOsoba = parseInt(document.getElementById('inputOsobe').value);
        const vrijeme = document.getElementById('inputVrijeme').value;
        const sat = parseInt(vrijeme.split(':')[0]);

        
        if (brojOsoba > 10) {
            prikaziModal("Greška!", "Maksimalan broj osoba je 10.", );
            return;
        }

        
        if (sat < 8 || sat >= 23) {
            prikaziModal("Zatvoreno!", "Radimo od 08:00 do 23:00h.");
            return;
        }

        
        prikaziModal("Uspješno!", "Hvala " + ime + ", rezervisali ste sto za " + brojOsoba + " osoba." );
        this.reset();
    });
}


const formaZal = document.getElementById('formaZalba');
if(formaZal) {
    formaZal.addEventListener('submit', function(e) {
        e.preventDefault(); // I OVDJE ZAUSTAVLJAMO REFRESH!
        prikaziModal("Poslano!", "Vaša poruka je primljena.", "📩");
        this.reset();
    });
}


window.onclick = function(event) {
    const modal = document.getElementById("mojModal");
    if (event.target == modal) {
        zatvoriModal();
    }
}
