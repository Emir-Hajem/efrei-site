/* ============================================
   EFREI - Département Informatique
   Fichier JavaScript principal (script.js)
   ============================================ */

/* ============================
   1. MENU BURGER (mobile)
   ============================ */
function initMenuBurger() {
    var burger = document.querySelector('.burger');
    var nav    = document.querySelector('nav');

    if (!burger || !nav) return;

    burger.addEventListener('click', function () {
        nav.classList.toggle('ouvert');
    });

    // Fermer si on clique ailleurs
    document.addEventListener('click', function (e) {
        if (!burger.contains(e.target) && !nav.contains(e.target)) {
            nav.classList.remove('ouvert');
        }
    });
}

/* ============================
   2. CARROUSEL
   ============================ */
function initCarrousel() {
    var piste  = document.querySelector('.carrousel-piste');
    var points = document.querySelectorAll('.point');
    var btnPrev = document.querySelector('.carr-prev');
    var btnNext = document.querySelector('.carr-next');

    if (!piste) return;

    var slides  = document.querySelectorAll('.carrousel-slide');
    var total   = slides.length;
    var courant = 0;

    function allerA(index) {
        if (index >= total) index = 0;
        if (index < 0)     index = total - 1;
        courant = index;
        piste.style.transform = 'translateX(-' + (courant * 100) + '%)';
        points.forEach(function (p, i) {
            p.classList.toggle('actif', i === courant);
        });
    }

    if (btnNext) btnNext.addEventListener('click', function () { allerA(courant + 1); });
    if (btnPrev) btnPrev.addEventListener('click', function () { allerA(courant - 1); });

    points.forEach(function (p, i) {
        p.addEventListener('click', function () { allerA(i); });
    });

    // Défilement automatique toutes les 4 secondes
    setInterval(function () { allerA(courant + 1); }, 4000);
}

/* ============================
   3. ONGLETS (formations)
   ============================ */
function initOnglets() {
    var boutons   = document.querySelectorAll('.onglet-btn');
    var contenus  = document.querySelectorAll('.onglet-contenu');

    boutons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var cible = btn.getAttribute('data-onglet');

            boutons.forEach(function (b)  { b.classList.remove('actif'); });
            contenus.forEach(function (c) { c.classList.remove('actif'); });

            btn.classList.add('actif');
            var el = document.getElementById(cible);
            if (el) el.classList.add('actif');
        });
    });
}

/* ============================
   4. FAQ ACCORDÉON
   ============================ */
function initFAQ() {
    var questions = document.querySelectorAll('.faq-question');

    questions.forEach(function (question) {
        question.addEventListener('click', function () {
            var reponse = question.nextElementSibling;
            var estOuvert = question.classList.contains('ouvert');

            // Fermer toutes les autres
            document.querySelectorAll('.faq-question').forEach(function (q) {
                q.classList.remove('ouvert');
                var r = q.nextElementSibling;
                if (r) r.classList.remove('ouvert');
            });

            // Ouvrir ou fermer celle-ci
            if (!estOuvert) {
                question.classList.add('ouvert');
                if (reponse) reponse.classList.add('ouvert');
            }
        });
    });
}

/* ============================
   5. VALIDATION FORMULAIRE
   ============================ */
function initFormulaire() {
    var form = document.getElementById('formulaire-contact');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var valide = true;

        // Réinitialiser les erreurs
        form.querySelectorAll('.msg-erreur').forEach(function (m) {
            m.style.display = 'none';
        });
        form.querySelectorAll('input, textarea').forEach(function (f) {
            f.classList.remove('erreur');
        });

        // Vérifier le nom
        var nom = document.getElementById('nom');
        if (nom && nom.value.trim() === '') {
            afficherErreur(nom, 'Le nom est obligatoire.');
            valide = false;
        }

        // Vérifier l'email
        var email = document.getElementById('email');
        if (email) {
            var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value.trim() === '') {
                afficherErreur(email, "L'email est obligatoire.");
                valide = false;
            } else if (!regexEmail.test(email.value)) {
                afficherErreur(email, "Format d'email invalide.");
                valide = false;
            }
        }

        // Vérifier le message
        var message = document.getElementById('message');
        if (message && message.value.trim() === '') {
            afficherErreur(message, 'Le message est obligatoire.');
            valide = false;
        }

        if (valide) {
            var succes = document.querySelector('.msg-succes');
            if (succes) succes.style.display = 'block';
            form.reset();
            afficherToast('✅ Message envoyé avec succès !');
        }
    });
}

function afficherErreur(champ, texte) {
    champ.classList.add('erreur');
    var msg = champ.parentElement.querySelector('.msg-erreur');
    if (msg) {
        msg.textContent = texte;
        msg.style.display = 'block';
    }
}

/* ============================
   6. TOAST NOTIFICATION
   ============================ */
function afficherToast(texte) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = texte;
    toast.classList.add('visible');
    setTimeout(function () { toast.classList.remove('visible'); }, 3000);
}

/* ============================
   7. ANIMATION COMPTEURS
   ============================ */
function animerCompteurs() {
    var compteurs = document.querySelectorAll('.stat-nombre');
    if (compteurs.length === 0) return;

    compteurs.forEach(function (el) {
        var cible   = parseInt(el.getAttribute('data-cible'));
        var suffixe = el.getAttribute('data-suffixe') || '';
        var courant = 0;
        var pas     = Math.ceil(cible / 60);

        var timer = setInterval(function () {
            courant += pas;
            if (courant >= cible) {
                courant = cible;
                clearInterval(timer);
            }
            el.textContent = courant + suffixe;
        }, 25);
    });
}

/* ============================
   8. ANIMATION AU SCROLL
   ============================ */
function initAnimationScroll() {
    var elements = document.querySelectorAll('.carte, .prof-carte, .evenement');

    elements.forEach(function (el) {
        el.style.opacity    = '0';
        el.style.transform  = 'translateY(25px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    function verifier() {
        elements.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 60) {
                el.style.opacity   = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }

    window.addEventListener('scroll', verifier);
    verifier();
}

/* ============================
   9. LIEN ACTIF dans la nav
   ============================ */
function marquerLienActif() {
    var page  = window.location.pathname.split('/').pop() || 'index.html';
    var liens = document.querySelectorAll('nav ul li a');
    liens.forEach(function (lien) {
        if (lien.getAttribute('href') === page) {
            lien.classList.add('active');
        }
    });
}

/* ============================
   10. FILTRE TABLEAU
   ============================ */
function initFiltreTableau() {
    var input  = document.getElementById('filtre-tableau');
    var table  = document.getElementById('tableau-formations');
    if (!input || !table) return;

    input.addEventListener('input', function () {
        var query = input.value.toLowerCase();
        var lignes = table.querySelectorAll('tbody tr');
        lignes.forEach(function (tr) {
            tr.style.display = tr.textContent.toLowerCase().includes(query) ? '' : 'none';
        });
    });
}

/* ============================
   INITIALISATION
   ============================ */
document.addEventListener('DOMContentLoaded', function () {
    initMenuBurger();
    initCarrousel();
    initOnglets();
    initFAQ();
    initFormulaire();
    initAnimationScroll();
    marquerLienActif();
    initFiltreTableau();

    // Compteurs uniquement sur la page d'accueil
    if (document.querySelector('.stat-nombre')) {
        setTimeout(animerCompteurs, 400);
    }
});
