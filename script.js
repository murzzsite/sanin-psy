const LEAD_ENDPOINT = 'https://lead-relay.leestygpt.workers.dev/lead/WD4KGBV5Q6';
// Яндекс Метрика: впишите номер счётчика, цели form_submit и telegram_click заработают сразу
const YM_ID = 0;
if (YM_ID) {
  (function (m, e, t, r, i, k, a) { m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); }; m[i].l = 1 * new Date(); k = e.createElement(t); a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r; a.parentNode.insertBefore(k, a); })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
  ym(YM_ID, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
}
const goal = name => { try { if (YM_ID && window.ym) ym(YM_ID, 'reachGoal', name); } catch (e) {} };

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const TAU = Math.PI * 2;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = t => t * t * (3 - 2 * t);
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  };
  const CORAL = getComputedStyle(document.documentElement).getPropertyValue('--coral').trim() || '#D9482A';
  const TEAL = getComputedStyle(document.documentElement).getPropertyValue('--teal').trim() || '#1D6A70';

  $('#year') && ($('#year').textContent = new Date().getFullYear());

  /* header */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('is-open');
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
  });
  $$('a', nav).forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('is-open'); nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- ring renderer: two dots with motion ghosts ---------- */
  function makeRing(svg, { cx, cy, R, r, band, bandW, ghosts = 6 }) {
    const g = { cx, cy, R, r, ghosts };
    if (band) mk('circle', { cx, cy, r: R - bandW / 2 - 4, fill: '#F8F9F7', opacity: 0.6 }, svg);
    if (band) {
      g.band = mk('path', { fill: 'none', stroke: band, 'stroke-width': bandW, 'stroke-linecap': 'round' }, svg);
      setBand(g, 0);
    }
    const dot = color => {
      const arr = [];
      for (let k = ghosts; k >= 1; k--) arr.push(mk('circle', { r: r * Math.pow(0.93, k), fill: color, opacity: 0.34 * (1 - k / (ghosts + 1)) }, svg));
      arr.push(mk('circle', { r, fill: color }, svg));
      return arr;
    };
    g.c = dot(CORAL);
    g.t = dot(TEAL);
    return g;
  }
  const pt = (g, a) => [g.cx + g.R * Math.cos(a), g.cy + g.R * Math.sin(a)];
  function setBand(g, w) {
    if (!g.band) return;
    const a0 = -Math.PI / 2 + w, a1 = -Math.PI / 2 + TAU - w;
    const [x0, y0] = pt(g, a0), [x1, y1] = pt(g, a1);
    g.band.setAttribute('d', `M${x0.toFixed(2)} ${y0.toFixed(2)}A${g.R} ${g.R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`);
    g.band.setAttribute('stroke-linecap', w > 0.05 ? 'round' : 'butt');
  }
  function place(g, arr, a, spacing) {
    arr.forEach((el, i) => {
      const k = arr.length - 1 - i;
      const [x, y] = pt(g, a - k * spacing);
      el.setAttribute('cx', x.toFixed(2)); el.setAttribute('cy', y.toFixed(2));
    });
  }
  const draw = (g, ac, at, spacing) => { place(g, g.c, ac, spacing); place(g, g.t, at, spacing); };

  /* ---------- hero ring (time-driven) ---------- */
  const heroSvg = $('#heroDots');
  const hero = makeRing(heroSvg, { cx: 360, cy: 360, R: 318, r: 26, ghosts: 7 });
  let heroVisible = true, last = performance.now(), t0 = 0;
  const heroLoop = now => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (heroVisible && !document.hidden) {
      t0 += dt;
      const ac = -Math.PI / 2 + t0 * 0.7;
      const gap = 1.0 + 0.35 * Math.sin(t0 * 0.6);
      draw(hero, ac, ac + gap, 0.055 + 0.02 * Math.sin(t0 * 0.6));
    }
    requestAnimationFrame(heroLoop);
  };
  draw(hero, -Math.PI / 2 - 0.15, -Math.PI / 2 + 0.85, 0.055);
  if (!reduce) requestAnimationFrame(heroLoop);
  new IntersectionObserver(e => { heroVisible = e[0].isIntersecting; }).observe(heroSvg);

  /* smooth anchors */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const el = $(id); if (!el) return;
    e.preventDefault();
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: reduce ? 'auto' : 'smooth' });
  }));

  /* ---------- hero title split ---------- */
  const title = $('[data-split]');
  if (title) {
    const words = title.textContent.trim().split(/\s+/);
    title.setAttribute('aria-label', words.join(' '));
    title.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><i style="--i:${i}">${w}</i></span>`).join(' ');
    requestAnimationFrame(() => requestAnimationFrame(() => title.classList.add('is-in')));
  }

  /* ---------- reveal ---------- */
  const rev = $$('[data-r]');
  if ('IntersectionObserver' in window && window.innerWidth > 600) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { threshold: 0.01, rootMargin: '0px 0px 10% 0px' });
    const seen = new Map();
    rev.forEach(el => {
      const p = el.parentElement; const n = seen.get(p) || 0; seen.set(p, n + 1);
      el.style.setProperty('--d', (Math.min(n, 5) * 0.08) + 's');
      io.observe(el);
    });
  } else rev.forEach(el => el.classList.add('is-in'));

  /* ---------- counters ---------- */
  $$('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    if (reduce || !('IntersectionObserver' in window)) return;
    el.textContent = '0';
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      const st = performance.now(), dur = 1500;
      const tick = t => {
        const p = clamp((t - st) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
  });

  /* ---------- scene: the circle, stepped by click ---------- */
  const scene = $('#circle'), sceneSvg = $('#sceneSvg');
  const sg = makeRing(sceneSvg, { cx: 320, cy: 320, R: 228, r: 30, band: '#B4CCC9', bandW: 40, ghosts: 8 });
  const stages = $$('.stage'), tabs = $$('.steps__tab'), nextBtn = $('#sceneNext'), saysC = $('#saysC'), saysT = $('#saysT');
  const says = [
    ['Ты меня не слышишь!', 'Мне нужна тишина.'],
    ['Ты меня не слышишь!', 'Мне нужна тишина.'],
    ['Тебе вообще важно, что со мной?', 'Что ни скажу, будет хуже.'],
    ['Мне страшно тебя потерять.', 'Я хочу быть рядом.']
  ];
  const STEP_P = [0.1, 0.38, 0.62, 1];
  let curStage = -1, curP = STEP_P[0], fromP = curP, tgtP = curP, tStart = 0, lastAc = 0, sp = 0.05, drift = 0, sceneVisible = true;
  const seg = (p, a, b) => smooth(clamp((p - a) / (b - a)));
  function setStage(i) {
    if (i === curStage) return;
    curStage = i;
    stages.forEach((s, k) => s.classList.toggle('is-on', k === i));
    tabs.forEach((t, k) => { t.classList.toggle('is-on', k === i); t.setAttribute('aria-selected', k === i); });
    nextBtn.firstElementChild.textContent = i === 3 ? 'Записаться на консультацию' : 'Дальше';
    [saysC, saysT].forEach((el, k) => {
      el.classList.add('swap');
      setTimeout(() => { el.textContent = says[i][k]; el.classList.remove('swap'); }, 250);
    });
  }
  function renderScene(p) {
    const A = TAU * 3 * (1 - Math.cos(Math.PI * clamp(p / 0.72))) / 2;
    const gap = lerp(lerp(lerp(0.9, 1.5, seg(p, 0.2, 0.5)), 2.5, seg(p, 0.5, 0.72)), 0.26, seg(p, 0.74, 0.95));
    const cOff = lerp(0, -0.13, seg(p, 0.74, 0.95));
    const ac = -Math.PI / 2 + A + cOff + drift * (1 - seg(p, 0.5, 0.72)), at = ac + gap;
    sp = lerp(sp, Math.min(0.15, 0.03 + Math.abs(ac - lastAc) * 8), 0.2); lastAc = ac;
    draw(sg, ac, at, sp);
    setBand(sg, lerp(0, 0.6, seg(p, 0.78, 0.97)));
  }
  function goStage(i, instant) {
    setStage(i);
    tgtP = STEP_P[i];
    if (reduce || instant) { curP = tgtP; tStart = 0; renderScene(curP); return; }
    fromP = curP; tStart = performance.now();
  }
  let sl = performance.now();
  const sceneLoop = now => {
    const dt = Math.min(0.05, (now - sl) / 1000); sl = now;
    if (sceneVisible && !document.hidden) {
      drift += dt * 0.45;
      if (tStart) {
        const k = clamp((now - tStart) / 1700);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        curP = lerp(fromP, tgtP, e);
        if (k >= 1) tStart = 0;
      }
      renderScene(curP);
    }
    requestAnimationFrame(sceneLoop);
  };
  tabs.forEach(t => t.addEventListener('click', () => goStage(+t.dataset.i)));
  nextBtn.addEventListener('click', () => {
    if (curStage < 3) goStage(curStage + 1);
    else {
      const el = $('#contact');
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: reduce ? 'auto' : 'smooth' });
    }
  });
  scene.classList.add('is-live');
  goStage(0, true);
  if (!reduce) requestAnimationFrame(sceneLoop);
  new IntersectionObserver(e => { sceneVisible = e[0].isIntersecting; }).observe(sceneSvg);

  const fitName = () => {
    const el = $('.footer__name'); if (!el) return;
    const box = el.parentElement.clientWidth - 2 * parseFloat(getComputedStyle(el.parentElement).paddingLeft || 0);
    el.style.fontSize = '100px'; el.style.display = 'inline-block';
    const w = el.getBoundingClientRect().width;
    el.style.fontSize = (100 * box / w * 0.985).toFixed(2) + 'px';
  };
  document.fonts && document.fonts.ready.then(fitName); fitName();
  window.addEventListener('resize', fitName);

  /* ---------- picker + mini ring ---------- */
  const DATA = {
    a: { v: 1.5, gap: 0.8,
      out: 'Упрёки и претензии: «Ты меня не слышишь», «Тебе всё равно». Разговор превращается в допрос, и вы оба устаёте.',
      under: 'Страх оказаться ненужным и одиноким рядом с близким человеком. Он выглядит как злость, потому что злость проще показать.',
      do: 'Учимся говорить о страхе вместо претензии, чтобы партнёр мог ответить на него, а не защищаться.' },
    b: { v: 1.0, gap: 2.0,
      out: 'Уход от разговора: «Давай потом», работа, телефон, тишина. Хочется, чтобы всё прекратилось.',
      under: 'Ощущение, что что бы вы ни сделали, будет мало, и страх снова оказаться виноватым. Молчание защищает от этой боли.',
      do: 'Постепенно выходим из укрытия: учимся замечать, что происходит внутри, и называть это вслух, пусть коротко.' },
    c: { v: 1.2, gap: 1.2,
      out: 'Спор о том, кто сколько тратит и кто что не сделал. Тема меняется, а накал остаётся.',
      under: 'Вопрос «считаются ли со мной?» и «могу ли я на тебя положиться?». За деньгами и бытом стоят уважение и безопасность.',
      do: 'Переводим разговор с темы на чувство за ней. Практическое решение находить проще, когда понятно, о чём спор на самом деле.' },
    d: { v: 0.22, gap: 3.1,
      out: 'Вежливая тишина, разные комнаты, мало общих тем. Громких ссор нет, но близости тоже.',
      under: 'Тихое горе по утраченной близости и страх, что если начать говорить, будет больно. Отдаляются оба.',
      do: 'Осторожно возвращаем первый разговор вслух: что для вас было важно в паре и что стало недоступным.' },
    e: { v: 1.1, gap: 0.5,
      out: 'Вопрос «зачем?» по кругу, проверки, слёзы или холод. Каждый разговор возвращается к тому дню.',
      under: 'Потеря опоры, боль, стыд и страх потерять семью. У каждого своё переживание, и оно заслуживает, чтобы его услышали.',
      do: 'Сначала останавливаем «войну» и даём боли место. Решение, остаться или расстаться, принимаем без давления и спешки.' }
  };
  const miniSvg = $('#miniSvg');
  const mini = makeRing(miniSvg, { cx: 120, cy: 120, R: 88, r: 14, band: '#B4CCC9', bandW: 18, ghosts: 5 });
  setBand(mini, 0);
  let tgt = DATA.a, cur = { v: DATA.a.v, gap: DATA.a.gap }, miniVisible = true, mt = 0, ml = performance.now();
  const miniLoop = now => {
    const dt = Math.min(0.05, (now - ml) / 1000); ml = now;
    cur.v = lerp(cur.v, tgt.v, 0.06); cur.gap = lerp(cur.gap, tgt.gap, 0.06);
    if (miniVisible && !document.hidden) {
      mt += dt * cur.v;
      draw(mini, mt, mt + cur.gap, Math.min(0.2, 0.04 + cur.v * 0.045));
    }
    requestAnimationFrame(miniLoop);
  };
  draw(mini, 0, 0.8, 0.06);
  if (!reduce) requestAnimationFrame(miniLoop);
  new IntersectionObserver(e => { miniVisible = e[0].isIntersecting; }).observe(miniSvg);

  const pkOut = $('#pkOut'), pkUnder = $('#pkUnder'), pkDo = $('#pkDo'), pkText = $('.pick__text');
  const showCycle = key => {
    tgt = DATA[key];
    if (reduce) { cur = { v: tgt.v, gap: tgt.gap }; }
    pkText.classList.add('swap');
    setTimeout(() => {
      pkOut.textContent = tgt.out; pkUnder.textContent = tgt.under; pkDo.textContent = tgt.do;
      pkText.classList.remove('swap');
    }, 220);
  };
  pkOut.textContent = DATA.a.out; pkUnder.textContent = DATA.a.under; pkDo.textContent = DATA.a.do;
  $$('input[name="cycle"]').forEach(i => i.addEventListener('change', () => showCycle(i.value)));
  $('#pkGo').addEventListener('click', () => {
    const lab = $('input[name="cycle"]:checked').parentElement.textContent.trim();
    $('#msgField').value = 'Мой круг: ' + lab;
  });

  /* ---------- review dots ---------- */
  const dots = $('#dots');
  for (let i = 0; i < 237; i++) {
    const c = mk('circle', { cx: 11 + (i % 15) * 22, cy: 11 + Math.floor(i / 15) * 22, r: 8 }, dots);
    c.style.setProperty('--d', (i * 0.0025).toFixed(3) + 's');
  }
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { dots.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.02 });
    io.observe(dots);
  } else dots.classList.add('is-in');

  /* ---------- documents lightbox ---------- */
  const lb = $('#lightbox');
  if (lb && lb.showModal) {
    $$('[data-doc]').forEach(b => b.addEventListener('click', () => {
      const im = $('#lbImg'); im.src = b.dataset.doc; im.alt = b.dataset.alt; lb.showModal();
    }));
    $('#lbX').addEventListener('click', () => lb.close());
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  }

  /* ---------- price row -> form ---------- */
  $$('[data-fmt]').forEach(a => a.addEventListener('click', () => {
    const sel = $('#fmtSelect');
    const opt = [...sel.options].find(o => o.value === a.dataset.fmt || o.textContent === a.dataset.fmt);
    if (opt) sel.value = opt.value;
  }));

  /* ---------- magnetic buttons ---------- */
  if (!reduce && window.matchMedia('(pointer:fine)').matches) {
    $$('[data-magnet]').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px,${(e.clientY - r.top - r.height / 2) * 0.2}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* ---------- form ---------- */
  const form = $('#leadForm'), status = $('#formStatus');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form), payload = {};
    fd.forEach((v, k) => { payload[k] = v; });
    if (payload._gotcha) return;
    $$('.field', form).forEach(f => f.classList.remove('invalid'));
    status.className = 'form__status';
    if (!payload.name || !payload.contact) {
      if (!payload.name) form.name.closest('.field').classList.add('invalid');
      if (!payload.contact) form.contact.closest('.field').classList.add('invalid');
      status.textContent = 'Укажите имя и телефон или Telegram.'; status.classList.add('err'); return;
    }
    if (!form.consent.checked) { status.textContent = 'Нужно согласие на обработку данных.'; status.classList.add('err'); return; }
    payload.phone = payload.contact;
    delete payload.consent;
    const btn = form.querySelector('button[type="submit"]'), lab = btn.firstElementChild;
    btn.disabled = true; lab.textContent = 'Отправляем...';
    try {
      const resp = await fetch(LEAD_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      goal('form_submit');
      status.textContent = 'Заявка отправлена. Отвечу и предложу время.';
      form.reset();
    } catch (err) {
      console.error(err);
      status.textContent = 'Не удалось отправить. Напишите в Telegram: @psyegor.'; status.classList.add('err');
    } finally {
      lab.textContent = 'Отправить заявку'; btn.disabled = false;
    }
  });

  /* ---------- telegram goals ---------- */
  $$('[data-goal]').forEach(a => a.addEventListener('click', () => goal(a.dataset.goal)));

  /* ---------- sticky mobile CTA ---------- */
  const sticky = $('#stickyCta'), contactEl = $('#contact');
  let contactSeen = false;
  const updSticky = () => sticky.classList.toggle('is-on', window.scrollY > 500 && !contactSeen);
  new IntersectionObserver(e => { contactSeen = e[0].isIntersecting; updSticky(); }, { threshold: 0.15 }).observe(contactEl);
  window.addEventListener('scroll', updSticky, { passive: true });
  updSticky();
})();
