// anno footer
const y = document.getElementById('y');
if (y) y.textContent = new Date().getFullYear();

// menu mobile: scrim + drawer + hamburger → X
const navToggle = document.getElementById('navToggle');
const siteNav   = document.getElementById('siteNav');
const scrim     = document.getElementById('scrim');

function openMenu(){
  document.body.classList.add('menu-open');
  siteNav.setAttribute('data-collapsed','false');
  navToggle.setAttribute('aria-expanded','true');
  navToggle.setAttribute('aria-label','Chiudi menu');
  scrim.hidden = false;
}
function closeMenu(){
  document.body.classList.remove('menu-open');
  siteNav.setAttribute('data-collapsed','true');
  navToggle.setAttribute('aria-expanded','false');
  navToggle.setAttribute('aria-label','Apri menu');
  scrim.hidden = true;
}

if (navToggle && siteNav && scrim){
  navToggle.addEventListener('click', () => {
    const collapsed = siteNav.getAttribute('data-collapsed') === 'true';
    collapsed ? openMenu() : closeMenu();
  });
  scrim.addEventListener('click', closeMenu);
  // chiudi quando clicchi un link
  siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}
document.addEventListener("DOMContentLoaded", () => {
    const siteNav = document.getElementById('siteNav');
    const scrim = document.getElementById('scrim');
  
    if (siteNav && scrim) {
      const mql = window.matchMedia('(min-width: 960px)');
  
      function syncDesktopNav(e){
        if (e.matches){
          siteNav.setAttribute('data-collapsed','false');
          scrim.hidden = true;
          document.body.classList.remove('menu-open');
        } else {
          siteNav.setAttribute('data-collapsed','true');
        }
      }
  
      mql.addEventListener('change', syncDesktopNav);
      syncDesktopNav(mql);
    }
  });
  

  const allArticlesBtns = document.getElementById("allArticlesBtns");
  if (allArticlesBtns) {
    allArticlesBtns.addEventListener("click", loadArticles);
  }
  

// ===== Funzione condivisa per caricare articles.json =====
async function getArticlesJson() {
  try {
    const res = await fetch('../articles.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('404 da root');
    return await res.json();
  } catch (e1) {
    try {
      const res = await fetch('articles.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('404 da percorso relativo');
      return await res.json();
    } catch (e2) {
      throw new Error('Errore nel caricamento del JSON');
    }
  }
}

// ===== Articoli da JSON =====
async function loadArticles() {
  const grid = document.getElementById('articlesGrid');
  if (!grid) return;

  try {
    const items = await getArticlesJson();

    items.slice(0, 6).forEach(post => {
      const a = document.createElement('a');
      a.href = post.html;
      a.className = 'card';

      a.innerHTML = `
        <img class="thumb" src="${post.cover}" alt="${post.title}" loading="lazy">
        <div class="meta">
          <div class="tags">
            ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
          <h3>${post.title}</h3>
          <p class="excerpt">${post.excerpt}</p>
          <div class="date">${new Date(post.date).toLocaleDateString('it-IT', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}</div>
        </div>
      `;

      grid.appendChild(a);
    });

  } catch (err) {
    console.error('Errore caricamento articoli:', err);
    const p = document.createElement('p');
    p.textContent = 'Non riesco a caricare gli articoli al momento.';
    grid.appendChild(p);
  }
}

document.addEventListener('DOMContentLoaded', loadArticles);

// ===== CONTACT FORM =====
document.addEventListener('DOMContentLoaded', () => {
  const f = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  if (!f) return;

  f.addEventListener('submit', async (e) => {
    const hp = document.getElementById('hp');
    if (hp && hp.value.trim() !== '') { e.preventDefault(); return; } // bot
    e.preventDefault();

    if (statusEl) statusEl.textContent = 'Invio in corso…';

    try {
      const resp = await fetch(f.action, {
        method: 'POST',
        body: new FormData(f),
        headers: { 'Accept': 'application/json' }
      });
      if (resp.ok) {
        statusEl.textContent = 'Grazie! Ti risponderò al più presto.';
        f.reset();
      } else {
        statusEl.textContent = 'Ops! Qualcosa è andato storto. Riprova.';
      }
    } catch {
      statusEl.textContent = 'Errore di rete. Controlla la connessione.';
    }
  });
});

// ===== SEARCH BAR =====
const form = document.querySelector(".nav-search");
const input = document.getElementById("q");
const resultBox = document.getElementById("search-result");

if (form && input) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = input.value.trim().toLowerCase();

    input.blur();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);

    if (!query) return;

    getArticlesJson()
      .then(articles => {
        const match = articles.find(article =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.tags.some(tag => tag.toLowerCase().includes(query))
        );
        console.log("Match trovato:", match); // 👈 AGGIUNGI QUESTO

        if (match && match.html) {
             const url = '/' + match.html.replace(/^\/+/, '');
             console.log("Reindirizzo verso:", url); // 👈 E ANCHE QUESTO
             window.location.href = url;
        } else {
          showToast("NESSUN ARTICOLO TROVATO.");
        }
      })
      .catch(err => {
        console.error("Errore:", err);
        if (resultBox) {
          resultBox.textContent = "Impossibile cercare gli articoli in questo momento.";
        }
      });
  });
}

// ===== TOAST =====
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 2000);
}

// ===== FAQ =====
document.addEventListener("DOMContentLoaded", () => {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach(button => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      const answer = button.nextElementSibling;

      faqQuestions.forEach(btn => {
        btn.setAttribute("aria-expanded", "false");
        btn.nextElementSibling.hidden = true;
      });

      if (!expanded) {
        button.setAttribute("aria-expanded", "true");
        answer.hidden = false;
      }
    });
  });
});
