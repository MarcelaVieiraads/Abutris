// timeline.js
const DATA_PATH = 'data/timeline.json';

async function initTimeline(){
  const res = await fetch(DATA_PATH);
  const data = await res.json();

  const nav = document.getElementById('timelineNav');
  const panels = document.getElementById('timelinePanels');

  data.forEach((decade, idx) => {
    // Nav item (círculo)
    const navItem = document.createElement('button');
    navItem.className = 'nav-item';
    navItem.innerText = decade.decade;
    navItem.setAttribute('data-index', idx);
    navItem.setAttribute('aria-controls', `panel-${idx}`);
    navItem.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
      navItem.classList.add('active');
      document.getElementById(`panel-${idx}`).scrollIntoView({behavior:'smooth', inline:'center'});
    });
    nav.appendChild(navItem);

    // Panel
    const panel = document.createElement('section');
    panel.className = 'panel';
    panel.id = `panel-${idx}`;

    // left: text
    const left = document.createElement('div');
    left.className = 'panel-text';
    left.innerHTML = `<h3>${decade.decade} — ${escapeHtml(decade.title || '')}</h3>
                      <p>${escapeHtml(decade.summary || '')}</p>
                      <p><strong>Bandas:</strong> ${ (decade.bands || []).join(', ') }</p>
                      <p>${(decade.links || []).map(l => `<a href="${l.url}" target="_blank" rel="noopener">${escapeHtml(l.text)}</a>`).join(' • ')}</p>`;
    panel.appendChild(left);

    // right: images
    const right = document.createElement('div');
    right.className = 'panel-media';
    (decade.images || []).forEach(imgName => {
      const img = document.createElement('img');
      img.src = `assets/images/decades/${imgName}`;
      img.alt = `${decade.decade} image`;
      img.tabIndex = 0;
      img.addEventListener('click', () => openModal(decade, imgName));
      img.addEventListener('keypress', e => { if(e.key === 'Enter') openModal(decade, imgName); });
      right.appendChild(img);
    });
    panel.appendChild(right);

    panels.appendChild(panel);
  });

  // set first active
  const first = nav.querySelector('.nav-item');
  if(first) first.classList.add('active');

  setupControls();
  // observe panels to highlight nav item when panel in view
  observePanels();
}

function setupControls(){
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  const panels = [...document.querySelectorAll('.panel')];

  prev.addEventListener('click', () => {
    const currentIdx = panels.findIndex(p => isInView(p));
    const target = Math.max(0, currentIdx - 1);
    panels[target].scrollIntoView({behavior:'smooth', inline:'center'});
  });
  next.addEventListener('click', () => {
    const currentIdx = panels.findIndex(p => isInView(p));
    const target = Math.min(panels.length - 1, currentIdx + 1);
    panels[target].scrollIntoView({behavior:'smooth', inline:'center'});
  });
}

function isInView(el){
  const rect = el.getBoundingClientRect();
  const mid = window.innerWidth / 2;
  return rect.left <= mid && rect.right >= mid;
}

function observePanels(){
  const panels = document.querySelectorAll('.panel');
  const options = { root: null, threshold: 0.45 };
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const idx = entry.target.id.split('-')[1];
      const navItem = document.querySelector(`.nav-item[data-index="${idx}"]`);
      if(entry.isIntersecting){
        document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
        if(navItem) navItem.classList.add('active');
      }
    });
  }, options);
  panels.forEach(p => obs.observe(p));
}

/* simple modal API (we call functions in modal.js) */
function openModal(decade, imgName){
  // delegate to modal module
  if(window.modal && typeof window.modal.open === 'function'){
    const html = `<img src="assets/images/decades/${imgName}" style="max-width:100%;height:auto;margin-bottom:1rem;">
                  <p>${escapeHtml(decade.summary || '')}</p>
                  <p><strong>Bandas:</strong> ${ (decade.bands || []).join(', ') }</p>`;
    window.modal.open(decade.decade + ' — ' + (decade.title || ''), html);
  }
}

// small helper escaping
function escapeHtml(text){
  return (text || '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

document.addEventListener('DOMContentLoaded', initTimeline);
