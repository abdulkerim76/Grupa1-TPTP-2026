/**
 * Skripte za sajt restorana Mamma Mia (naslovnica, meni, kontakt).
 * Učitava se na svim stranicama; dio koda radi samo ako postoje odgovarajući elementi u HTML-u.
 */

/* =============================================================================
 * Slajd-show na naslovnici (sekcija „O nama“)
 * Funkcije su na window objektu jer ih HTML poziva preko atributa onclick na dugmićima i tačkama.
 * ============================================================================= */

let trenutniSlajd = 0;

/** Postavlja aktivni slajd i tačku po indeksu (s zaokruživanjem ako indeks izađe iz opsega). */
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

/* =============================================================================
 * Modalni dijalog (kontakt: poruke nakon slanja forme)
 * ============================================================================= */

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

/* =============================================================================
 * Svijetla / tamna tema
 * - Sačuvani izbor u localStorage (ključ ispod) postavlja atribut data-theme na <html>.
 * - Ako nema sačuvanog izbora, uklanja se data-theme i prati se prefers-color-scheme (postavka OS-a).
 * - Ista logika u inline <script> u <head> sprječava treperenje pri prvom crtanju stranice.
 * ============================================================================= */

const TPTP_THEME_KEY = 'tptp-theme';

function getStoredTheme() {
    try {
        const v = localStorage.getItem(TPTP_THEME_KEY);
        return v === 'light' || v === 'dark' ? v : null;
    } catch (e) {
        return null;
    }
}

/** Utvrđuje da li je trenutno „svijetla“ tema: eksplicitno u DOM-u ili podrazumijevano preko OS-a. */
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

/** Ažurira aria-label i slične atribute dugmeta za promjenu teme (pristupačnost). */
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

/* =============================================================================
 * Hamburger izbornik na užim ekranima
 * IIFE izoluje lokane varijable; na širini ≥961px meni je uobičajena vodoravna traka, ispod toga „ladica“ + overlay.
 * ============================================================================= */
(function () {
    const mqWide = window.matchMedia('(min-width: 961px)');
    const toggleBtn = document.getElementById('nav-menu-toggle');
    const overlay = document.getElementById('nav-overlay');
    const primaryNav = document.getElementById('primary-nav');

    document.body.classList.remove('nav-menu-open');
    if (overlay) {
        overlay.setAttribute('hidden', '');
        overlay.setAttribute('aria-hidden', 'true');
    }

    function navDrawerIsUsed() {
        return !mqWide.matches;
    }

    function setMenuOpen(open) {
        if (!navDrawerIsUsed()) {
            document.body.classList.remove('nav-menu-open');
            if (overlay) {
                overlay.setAttribute('hidden', '');
                overlay.setAttribute('aria-hidden', 'true');
            }
            if (toggleBtn) {
                toggleBtn.setAttribute('aria-expanded', 'false');
                toggleBtn.setAttribute('aria-label', 'Otvori meni');
            }
            return;
        }
        if (open) {
            document.body.classList.add('nav-menu-open');
            if (overlay) {
                overlay.removeAttribute('hidden');
                overlay.setAttribute('aria-hidden', 'false');
            }
        } else {
            document.body.classList.remove('nav-menu-open');
            if (overlay) {
                overlay.setAttribute('hidden', '');
                overlay.setAttribute('aria-hidden', 'true');
            }
        }
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggleBtn.setAttribute('aria-label', open ? 'Zatvori meni' : 'Otvori meni');
        }
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    function toggleMenu() {
        if (!navDrawerIsUsed()) return;
        setMenuOpen(!document.body.classList.contains('nav-menu-open'));
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    if (primaryNav) {
        primaryNav.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                if (navDrawerIsUsed()) closeMenu();
            });
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });

    mqWide.addEventListener('change', function (e) {
        if (e.matches) closeMenu();
    });
})();

/* Datum rezervacije: ne može biti u prošlosti; podrazumijevano je današnji dan. */
const inputDatum = document.getElementById('inputDatum');
if (inputDatum) {
    const danas = new Date().toISOString().split('T')[0];
    inputDatum.setAttribute('min', danas);
    inputDatum.value = danas;
}

/* Kontakt forma rezervacije: samo klijentska validacija i simulacija uspjeha (nema slanja na server). */
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

/* Knjiga utisaka: sprječava se osvježavanje stranice; poruka ide u modal ako postoji na stranici. */
const formaZal = document.getElementById('formaZalba');
if (formaZal) {
    formaZal.addEventListener('submit', function(e) {
        e.preventDefault();
        prikaziModal("Poslano!", "Vaša poruka je primljena.");
        this.reset();
    });
}

/**
 * Zatvaranje modala klikom na zaslon ispod sadržaja (prazan dio modala).
 * Napomena (audit): dodjeljivanje window.onclick zamijenjuje raniji handler na tom svojstvu;
 * pri dodavanju novih globalnih klik-obradnika bolje je koristiti addEventListener na document.
 */
window.onclick = function(event) {
    const modal = document.getElementById("mojModal");
    if (modal && event.target === modal) {
        zatvoriModal();
    }
};
