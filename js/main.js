// main.js - small client-side behaviours for the SlewsIT static site
document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

// Contact form handling (no server): store demo submissions to localStorage and open default mail client
(function(){
  const form = document.getElementById('contactForm');
  const saveBtn = document.getElementById('saveLocal');
  const demoSec = document.getElementById('demoSubmissions');
  const subList = document.getElementById('subList');
  const clearBtn = document.getElementById('clearLocal');

  function loadSubs(){
    const raw = localStorage.getItem('slewsit_submissions');
    return raw ? JSON.parse(raw) : [];
  }
  function renderSubs(){
    const subs = loadSubs();
    if(!subs.length){ demoSec.style.display='none'; return; }
    demoSec.style.display='block';
    subList.innerHTML = subs.map(s=>`<li><strong>${escapeHtml(s.name)}</strong> (${escapeHtml(s.email)}): ${escapeHtml(s.message)}</li>`).join('');
  }
  function saveSub(obj){
    const subs = loadSubs();
    subs.unshift(obj);
    localStorage.setItem('slewsit_submissions', JSON.stringify(subs));
    renderSubs();
  }
  function escapeHtml(s){ return (''+s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]; }); }

  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      if(!name || !email || !message){ alert('Please fill all fields'); return; }
      // Save locally for demo
      saveSub({name, email, message, ts: Date.now()});
      // Open default mail client as fallback for real contact (mailto)
      const subject = encodeURIComponent('SlewsIT contact from ' + name);
      const body = encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')');
      window.location.href = 'mailto:info@slewsit.com?subject=' + subject + '&body=' + body;
    });
  }
  if(saveBtn){
    saveBtn.addEventListener('click', function(){
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      if(!name || !email || !message){ alert('Please fill all fields before saving demo'); return; }
      saveSub({name, email, message, ts: Date.now()});
      alert('Saved demo submission to localStorage.');
    });
  }
  if(clearBtn){
    clearBtn.addEventListener('click', function(){ localStorage.removeItem('slewsit_submissions'); renderSubs(); });
  }
  // initial render
  renderSubs();
})();