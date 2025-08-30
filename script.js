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
  


// ===== Articoli da JSON (bozzetto) =====
async function loadArticles(){
  const grid = document.getElementById('articlesGrid');
  if (!grid) return;
  try{
    const res = await fetch('articles.json', {cache: 'no-store'});
    const items = await res.json();

    // Mostra i primi 6
    items.slice(0,6).forEach(post => {
      const a = document.createElement('a');
      console.log(a);
      a.href = `articles.html?slug=${encodeURIComponent(post.slug)}`;
      a.className = 'card';
      a.addEventListener("click", openArticle);
      function openArticle(){
        window.open(post.html, "_blank");
      }

      a.innerHTML = `
        <img class="thumb" src="${post.cover}" alt="${post.title}" loading="lazy">
        <div class="meta">
          <div class="tags">
            ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
          <h3>${post.title}</h3>
          <p class="excerpt">${post.excerpt}</p>
          <div class="date">${new Date(post.date).toLocaleDateString('it-IT', {year:'numeric', month:'long', day:'numeric'})}</div>
        </div>
      `;
      grid.appendChild(a);
    });
  } catch(err){
    console.error('Errore caricamento articoli:', err);
    const p = document.createElement('p');
    p.textContent = 'Non riesco a caricare gli articoli al momento.';
    grid.appendChild(p);
  }
}
document.addEventListener('DOMContentLoaded', loadArticles);




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
//LOGICA PER IL SEARCH BAR
  const form = document.querySelector(".nav-search");
  const input = document.getElementById("q");
  const resultBox = document.getElementById("search-result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = input.value.trim().toLowerCase();

    if (!query) return;

    fetch("articles.json")
      .then(res => {
        if (!res.ok) throw new Error("Errore nel caricamento del JSON");
        return res.json();
      })
      .then(articles => {
        const match = articles.find(article =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.tags.some(tag => tag.toLowerCase().includes(query))
        );

        if (match) {
          window.location.href = match.html;
        } else {
          showToast("Nessun articolo trovato.");
        }
      })
      .catch(err => {
        console.error("Errore:", err);
        resultBox.textContent = "Impossibile cercare gli articoli in questo momento.";
      });
  });
  function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 3000); // Il messaggio scompare dopo 3 secondi
}
//SEZIONE FAQ 
  document.addEventListener("DOMContentLoaded", () => {
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(button => {
      button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        const answer = button.nextElementSibling;

        // Chiudi tutte le altre domande (comportamento accordion singolo)
        faqQuestions.forEach(btn => {
          btn.setAttribute("aria-expanded", "false");
          btn.nextElementSibling.hidden = true;
        });

        // Se non era già aperta, aprila
        if (!expanded) {
          button.setAttribute("aria-expanded", "true");
          answer.hidden = false;
        }
      });
    });
  });

