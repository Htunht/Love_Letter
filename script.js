const supabaseClient = supabase.createClient(
  'https://ibitsumdjzmfuybvcskz.supabase.co',
  'sb_publishable_R75rGIc-9u7n_76SqVskqw_-A-86nqw'
);

const TYPE_SPEED = 38, LINE_PAUSE = 260;
const rnd = Math.random;

document.addEventListener('click', e => {
  if (e.target.closest('#editor-container')) return;
  for (let i = 0; i < 5; i++) {
    const d = document.createElement('span');
    d.style.cssText = `position:fixed;z-index:999;pointer-events:none;border-radius:50%;` +
      `width:${3 + rnd() * 4}px;height:${3 + rnd() * 4}px;left:${e.clientX}px;top:${e.clientY}px;` +
      `background:rgba(${240 + rnd() * 15},${rnd() * 80},${85 + rnd() * 20},.75);` +
      `animation:heartBurst .7s ease-out forwards;--tx:${(rnd() - .5) * 60}px;--ty:${rnd() * -50 - 10}px`;
    document.body.appendChild(d);
    d.addEventListener('animationend', () => d.remove());
  }
});

const letterId = new URLSearchParams(window.location.search).get('id');
window.addEventListener('load', () => letterId ? initLetterViewer(letterId) : initLetterEditor());

async function initLetterViewer(id) {
  let lines = [], photos = [], recipient = 'My Love';

  try {
    const { data, error } = await supabaseClient.from('letters').select('*').eq('id', id).single();
    if (error) throw error;
    if (data) {
      recipient = data.title || 'My Love';
      lines = Array.isArray(data.lines) ? data.lines : [];
      photos = [data.photo_1, data.photo_2, data.photo_3];
    }
  } catch (err) {
    console.error('Fetch failed:', err);
  }

  document.getElementById('recipient-name').textContent = recipient;
  const d = new Date();
  document.getElementById('order-timestamp').textContent =
    `DATE: ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;

  photos.forEach((url, i) => {
    const slot = document.querySelectorAll('.slot')[i];
    if (!slot || !url) return;
    const img = slot.querySelector('img'), ph = slot.querySelector('.ph');
    img.src = url; img.style.display = 'block';
    if (ph) ph.style.display = 'none';
  });

  setTimeout(() => document.getElementById('loader')?.classList.add('loaded'), 650);

  const boxWrapEl = document.getElementById('sweet-box-wrap');
  const boxEl = document.getElementById('sweet-box');

  boxEl.addEventListener('click', function openBox() {
    if (!boxWrapEl.classList.contains('box-closed')) return;
    boxWrapEl.classList.replace('box-closed', 'box-opened');
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const r = boxEl.getBoundingClientRect();
        document.dispatchEvent(new MouseEvent('click', {
          clientX: r.left + r.width / 2 + (rnd() - .5) * 150,
          clientY: r.top + r.height / 2 + (rnd() - .5) * 100
        }));
      }, i * 30);
    }
    setTimeout(startTyping, 900);
    boxEl.removeEventListener('click', openBox);
  });

  function startTyping() {
    const el = document.getElementById('typed');
    let li = 0, ci = 0, buf = '';
    function t() {
      if (li >= lines.length) return;
      const line = lines[li];
      if (ci < line.length) {
        buf += line[ci++]; el.textContent = buf;
        setTimeout(t, TYPE_SPEED + rnd() * 20);
      } else {
        buf += '\n'; el.textContent = buf;
        li++; ci = 0;
        if (li < lines.length) setTimeout(t, LINE_PAUSE);
      }
    }
    t();
  }
}

function initLetterEditor() {
  document.getElementById('loader')?.classList.add('loaded');
  document.getElementById('scene').style.display = 'none';
  document.getElementById('editor-container').classList.remove('editor-hidden');

  for (let i = 1; i <= 3; i++) {
    const fileInput = document.getElementById(`photo-input-${i}`);
    const label = document.getElementById(`label-photo-${i}`);
    const removeBtn = document.getElementById(`btn-remove-${i}`);

    const resetSlot = () => {
      label.style.backgroundImage = '';
      label.classList.remove('has-file');
      label.querySelector('.upload-icon').innerText = '✧';
      label.querySelector('.ingredient-label').innerText = 'Select';
      removeBtn.style.display = 'none';
    };

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return resetSlot();
      const reader = new FileReader();
      reader.onload = e => {
        label.style.backgroundImage = `url('${e.target.result}')`;
        label.classList.add('has-file');
        label.querySelector('.upload-icon').innerText = '🍓';
        label.querySelector('.ingredient-label').innerText = 'Added';
        removeBtn.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    });

    removeBtn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      fileInput.value = ''; resetSlot();
    });
  }

  const form = document.getElementById('editor-form');
  const btnSeal = form.querySelector('.bake-btn');
  const btnText = btnSeal.textContent;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    btnSeal.disabled = true;
    btnSeal.textContent = 'Baking order... ✧';

    const sealLoader = document.getElementById('seal-loader');
    const targetCupcake = document.getElementById('seal-target-heart');
    targetCupcake.className = 'target-heart';
    updateProgress(0, 'Whisking ingredients... 🥣');
    sealLoader.classList.remove('loader-hidden');

    try {
      const titleVal = document.getElementById('editor-title').value.trim();
      const combinedLines = [
        `To ${titleVal}`, '',
        ...document.getElementById('editor-message').value.split('\n').map(l => l.replace('\r', ''))
      ];

      await animateProgress(0, 20, 'Preheating the oven... 🌡️', 500);

      const photoUrls = [];
      const steps = ['Folding photo memories in cream... 📸', 'Adding drops of sweetness... 🍯', 'Glazing the layers... 🍓'];

      for (let i = 1; i <= 3; i++) {
        const file = document.getElementById(`photo-input-${i}`).files[0];
        const s = 20 + (i - 1) * 20;
        if (file) {
          await animateProgress(s, s + 10, steps[i - 1], 400);
          const fileName = `${rnd().toString(36).substring(2)}-${Date.now()}.${file.name.split('.').pop()}`;
          const { error } = await supabaseClient.storage.from('letterPhotoes').upload(fileName, file);
          if (error) throw error;
          const { data: urlData } = supabaseClient.storage.from('letterPhotoes').getPublicUrl(fileName);
          photoUrls.push(urlData.publicUrl);
          await animateProgress(s + 10, s + 20, steps[i - 1], 400);
        } else {
          photoUrls.push(null);
        }
      }

      await animateProgress(80, 95, 'Putting on the ribbon... 🎀', 500);

      const { data, error } = await supabaseClient
        .from('letters').insert({ title: titleVal, lines: combinedLines, photo_1: photoUrls[0], photo_2: photoUrls[1], photo_3: photoUrls[2] })
        .select().single();
      if (error) throw error;

      await animateProgress(95, 100, 'Freshly baked! Serving... 🧁', 400);
      targetCupcake.classList.add('broken');
      await new Promise(r => setTimeout(r, 600));
      sealLoader.classList.add('loader-hidden');
      spawnBalloons();

      const shareLink = `${location.origin}${location.pathname}?id=${data.id}`;
      document.getElementById('share-link-input').value = shareLink;
      try { await navigator.clipboard.writeText(shareLink); } catch {}

      const modal = document.getElementById('success-modal');
      modal.style.display = 'flex';
      setTimeout(() => modal.classList.add('active'), 10);

    } catch (err) {
      console.error('Submit failed:', err);
      sealLoader.classList.add('loader-hidden');
      alert('Oops! Failed to bake your order. Please check your connection.');
      btnSeal.disabled = false;
      btnSeal.textContent = btnText;
    }
  });

  const linkInput = document.getElementById('share-link-input');
  const btnCopy = document.getElementById('btn-copy-link');

  btnCopy.addEventListener('click', () => {
    linkInput.select(); linkInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(linkInput.value);
    btnCopy.textContent = 'Copied!';
    setTimeout(() => btnCopy.textContent = 'Copy', 2000);
  });

  document.getElementById('btn-close-modal').addEventListener('click', () => {
    const val = linkInput.value;
    if (val) { location.href = val; return; }
    const modal = document.getElementById('success-modal');
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
      form.reset(); btnSeal.disabled = false; btnSeal.textContent = btnText;
      for (let i = 1; i <= 3; i++) {
        const lbl = document.getElementById(`label-photo-${i}`);
        lbl.style.backgroundImage = ''; lbl.classList.remove('has-file');
        lbl.querySelector('.upload-icon').innerText = '✧';
        lbl.querySelector('.ingredient-label').innerText = 'Select';
        document.getElementById(`btn-remove-${i}`).style.display = 'none';
      }
    }, 400);
  });
}

let lastStatus = '', statusTimer = null;

function typeStatusText(text) {
  const el = document.getElementById('seal-progress-status');
  if (!el) return;
  clearTimeout(statusTimer);
  let i = 0; el.textContent = '';
  (function step() {
    if (i < text.length) { el.textContent += text[i++]; statusTimer = setTimeout(step, 30); }
  })();
}

function updateProgress(pct, text) {
  const fill = document.getElementById('seal-progress-fill');
  const arrow = document.getElementById('seal-cupid-arrow');
  const label = document.getElementById('seal-progress-percentage');
  const target = document.getElementById('seal-target-heart');
  if (fill) fill.style.width = `${pct}%`;
  if (arrow) arrow.style.left = `${pct}%`;
  if (label) label.textContent = `${pct}%`;
  if (text && text !== lastStatus) { lastStatus = text; typeStatusText(text); }
  if (target) target.classList.toggle('beating', pct >= 80);
}

function animateProgress(start, end, text, ms = 600) {
  return new Promise(resolve => {
    const t0 = performance.now();
    (function update(now) {
      const p = Math.min((now - t0) / ms, 1);
      updateProgress(Math.floor(start + (end - start) * p), text);
      p < 1 ? requestAnimationFrame(update) : resolve();
    })(performance.now());
  });
}

function spawnBalloons() {
  const colors = ['#FF0055','#FF3377','#FFB3D1','#FF6699','#D90045','#FF80A3','#2D0010'];
  for (let i = 0; i < 18; i++) {
    const b = document.createElement('div');
    b.className = 'balloon';
    const size = 48 + rnd() * 18;
    b.style.cssText = `left:${rnd()*85+5}vw;background:${colors[Math.floor(rnd()*colors.length)]};` +
      `width:${size}px;height:${size*1.25}px;animation-duration:${3.5+rnd()*2}s;` +
      `animation-delay:${rnd()*1.5}s;--rot:${(rnd()-.5)*16}deg;` +
      `box-shadow:inset -3px -3px 8px rgba(0,0,0,.15),0 4px 10px rgba(0,0,0,.12);`;
    const str = document.createElement('div');
    str.className = 'balloon-string';
    b.appendChild(str);
    b.addEventListener('click', e => { e.stopPropagation(); popBalloon(b); });
    b.addEventListener('animationend', () => b.remove());
    document.body.appendChild(b);
  }
}

function popBalloon(b) {
  const r = b.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('span');
    p.textContent = rnd() > .5 ? '🍒' : '🍓';
    p.style.cssText = `position:fixed;z-index:999;font-size:${14+rnd()*10}px;left:${x}px;top:${y}px;pointer-events:none;` +
      `animation:heartBurst .6s ease-out forwards;--tx:${(rnd()-.5)*120}px;--ty:${(rnd()-.5)*-100-30}px`;
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
  b.remove();
}
