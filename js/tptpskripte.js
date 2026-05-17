
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
};

window.idiNaSlajd = function(n) {
    prikaziSlajd(n);
};

/**
 * Automatska promjena slajda svakih 5 sekundi.
 */
setInterval(() => {
    promijeniSlajd(1);
}, 5000);

/* Modalni dijalog (kontakt: poruke nakon slanja forme)
  */

function prikaziModal(naslov, poruka) {
    const modal = document.getElementById("mojModal");
    if (!modal) return;
    const naslovEl = document.getElementById("modalNaslov");
    const porukaEl = document.getElementById("modalPoruka");
    if (naslovEl) naslovEl.innerText = naslov;
    if (porukaEl) porukaEl.innerText = poruka;
    modal.style.display = "block";
}

function zatvoriModal() {
    const modal = document.getElementById("mojModal");
    if (modal) modal.style.display = "none";
}

/* Svijetla / tamna tema */

const TPTP_THEME_KEY = 'tptp-theme';

function getStoredTheme() {
    try {
        const v = localStorage.getItem(TPTP_THEME_KEY);
        return v === 'light' || v === 'dark' ? v : null;
    } catch (e) {
        return null;
    }
}

/* Utvrđuje da li je trenutno „svijetla“ tema */
function resolvedThemeIsLight() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t === 'light') return true;
    if (t === 'dark') return false;
    return window.matchMedia('(prefers-color-scheme: light)').matches;
}

function applyThemeFromStorage() {
    const saved = getStoredTheme();
    if (saved === 'light' || saved === 'dark') {
        document.documentElement.setAttribute('data-theme', saved);
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}


function syncThemeUi() {
    const themeToggle = document.getElementById('theme-toggle');
    const isLight = resolvedThemeIsLight();
    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', isLight ? 'true' : 'false');
        themeToggle.setAttribute(
            'aria-label',
            isLight ? 'Prebaci na tamnu temu' : 'Prebaci na svijetlu temu'
        );
        themeToggle.setAttribute(
            'title',
            isLight ? 'Prebaci na tamnu temu' : 'Prebaci na svijetlu temu'
        );
    }
}

applyThemeFromStorage();
syncThemeUi();

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const next = resolvedThemeIsLight() ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        try {
            localStorage.setItem(TPTP_THEME_KEY, next);
        } catch (e) {}
        syncThemeUi();
    });
}

const colorSchemeMq = window.matchMedia('(prefers-color-scheme: light)');
colorSchemeMq.addEventListener('change', () => {
    if (getStoredTheme() === null) {
        syncThemeUi();
    }
});



/* Datum rezervacije */
const inputDatum = document.getElementById('inputDatum');
if (inputDatum) {
    const danas = new Date().toISOString().split('T')[0];
    inputDatum.setAttribute('min', danas);
    inputDatum.value = danas;
}

/* Kontakt forma rezervacije */
const formaRez = document.getElementById('formaRezervacija');
if (formaRez) {
    formaRez.addEventListener('submit', function(e) {
        e.preventDefault();

        const ime = document.getElementById('ime').value;
        const brojOsoba = parseInt(document.getElementById('inputOsobe').value);
        const vrijeme = document.getElementById('inputVrijeme').value;
        const sat = parseInt(vrijeme.split(':')[0]);

        if (brojOsoba > 10) {
            prikaziModal("Greška!", "Maksimalan broj osoba je 10.");
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

/* Knjiga utisaka */
const formaZal = document.getElementById('formaZalba');
if (formaZal) {
    formaZal.addEventListener('submit', function(e) {
        e.preventDefault();
        prikaziModal("Poslano!", "Vaša poruka je primljena.");
        this.reset();
    });
}

/**
 * Zatvaranje modala klikom na zaslon ispod sadržaja */
window.onclick = function(event) {
    const modal = document.getElementById("mojModal");
    if (modal && event.target === modal) {
        zatvoriModal();
    }
};
