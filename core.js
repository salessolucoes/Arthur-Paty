/* =========================================================
   Núcleo do convite — Sales Soluções
   Não precisa editar. Os dados ficam no config.js
   ========================================================= */
(function () {
  'use strict';
  var C = window.CONVITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  var alvo = new Date(C.data);
  var p = {};
  try {
    new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', weekday: 'long', hour12: false })
      .formatToParts(alvo).forEach(function (x) { p[x.type] = x.value; });
  } catch (e) {}
  var dia = p.day || '', mes = p.month || '', ano = p.year || '', hora = (p.hour || '') + ':' + (p.minute || '');
  var semana = (p.weekday || '').replace('-feira', '');
  var mesNome = MESES[parseInt(mes, 10) - 1] || '';
  var nomes = C.noivo + ' & ' + C.noiva;
  var local = C.local || {};
  var endereco = [local.endereco, local.bairro, local.cidade].filter(Boolean).join(' · ');

  var textos = {
    noivo: C.noivo, noiva: C.noiva, nomes: nomes,
    'inicial-noivo': (C.noivo || '').charAt(0), 'inicial-noiva': (C.noiva || '').charAt(0),
    dia: dia, mes: mes, ano: ano, hora: hora, semana: semana.toUpperCase(), 'semana-normal': semana,
    'mes-nome': mesNome.toUpperCase(), 'mes-normal': mesNome,
    'data-hora': dia + ' · ' + mes + ' · ' + ano + ' · ' + hora,
    'data-pontos': dia + ' · ' + mes + ' · ' + ano,
    'data-extenso': dia + ' de ' + mesNome + ' de ' + ano,
    'local-nome': local.nome, 'local-endereco': endereco,
    frase: C.frase, convite: C.textoConvite, especial: C.textoEspecial, traje: C.traje, prazo: C.rsvpPrazo,
    'presentes-texto': C.presentesTexto, despedida: C.despedida, assinatura: C.assinatura
  };
  $$('[data-c]').forEach(function (el) { var v = textos[el.getAttribute('data-c')]; if (v) el.textContent = v; });
  $$('[data-se]').forEach(function (el) {
    var v = el.getAttribute('data-se').split('.').reduce(function (o, k) { return o ? o[k] : undefined; }, C);
    if (!v || (Array.isArray(v) && !v.length)) el.hidden = true;
  });
  document.title = nomes + ' | Convite';

  // ---------- Fotos ----------
  var fotos = (C.fotos || []).filter(Boolean);
  $$('[data-foto]').forEach(function (img) {
    var k = img.getAttribute('data-foto');
    var src = k === 'circulo' ? (C.fotoCirculo || fotos[0]) : (fotos[parseInt(k, 10) || 0] || fotos[0]);
    if (src) { img.src = src; img.alt = nomes; }
  });

  // ---------- Carrossel (troca suave, automático, arrastar com o dedo) ----------
  var car = $('#carrossel');
  if (car) {
    var lista = fotos.slice(1);
    if (!lista.length && C.demonstracao) lista = [fotos[0], null, null];
    if (!lista.length) { var sec = car.closest('section'); if (sec) sec.hidden = true; }
    else {
      var slides = [], dots = [], atual = 0, timer;
      var caixaDots = document.createElement('div'); caixaDots.className = 'car-dots';
      lista.forEach(function (src, i) {
        var s = document.createElement('div'); s.className = 'car-slide' + (i === 0 ? ' ativo' : '');
        if (src) { var im = document.createElement('img'); im.src = src; im.alt = 'Foto do casal ' + (i + 1); if (i) im.loading = 'lazy'; s.appendChild(im); }
        else { s.classList.add('car-vazio'); var t = document.createElement('span'); t.textContent = 'Sua foto aqui'; s.appendChild(t); }
        car.appendChild(s); slides.push(s);
        var d = document.createElement('button'); d.type = 'button'; d.className = 'car-dot' + (i === 0 ? ' ativo' : ''); d.setAttribute('aria-label', 'Foto ' + (i + 1));
        d.addEventListener('click', function () { mostrar(i); iniciar(); });
        caixaDots.appendChild(d); dots.push(d);
      });
      if (lista.length > 1) car.appendChild(caixaDots);
      var mostrar = function (i) {
        atual = (i + slides.length) % slides.length;
        slides.forEach(function (s, n) { s.classList.toggle('ativo', n === atual); });
        dots.forEach(function (d, n) { d.classList.toggle('ativo', n === atual); });
      };
      var iniciar = function () { clearInterval(timer); if (slides.length > 1) timer = setInterval(function () { mostrar(atual + 1); }, 4200); };
      var x0 = null;
      car.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      car.addEventListener('touchend', function (e) {
        if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
        if (Math.abs(dx) > 40) { mostrar(atual + (dx < 0 ? 1 : -1)); iniciar(); }
      });
      iniciar();
    }
  }

  // ---------- Contagem ----------
  var cd = ['dias', 'horas', 'minutos', 'segundos'].map(function (id) { return $('#cd-' + id); });
  function tick() {
    var d = Math.max(0, alvo - Date.now());
    var v = [Math.floor(d / 864e5), Math.floor(d % 864e5 / 36e5), Math.floor(d % 36e5 / 6e4), Math.floor(d % 6e4 / 1e3)];
    cd.forEach(function (el, i) { if (el) el.textContent = String(v[i]).padStart(2, '0'); });
  }
  if (cd[0]) { tick(); setInterval(tick, 1000); }

  // ---------- Local / agenda / compartilhar ----------
  var q = [local.nome, local.endereco, local.bairro, local.cidade].filter(Boolean).join(', ');
  var links = {
    maps: local.linkMaps || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q),
    waze: 'https://waze.com/ul?q=' + encodeURIComponent(q) + '&navigate=yes'
  };
  $$('[data-link]').forEach(function (a) { a.href = links[a.getAttribute('data-link')]; });
  $$('a[href^="http"]').forEach(function (a) { a.target = '_blank'; a.rel = 'noopener noreferrer'; });

  function ics(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  var fimEv = new Date(alvo.getTime() + 6 * 36e5);
  $$('[data-acao="agenda"]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      if (!/iphone|ipad|ipod/i.test(navigator.userAgent)) {
        window.open('https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('Casamento ' + nomes) +
          '&dates=' + ics(alvo) + '/' + ics(fimEv) + '&location=' + encodeURIComponent(q), '_blank', 'noopener');
        return;
      }
      var txt = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sales Solucoes//Convite//PT', 'BEGIN:VEVENT', 'UID:' + ics(alvo) + '@convite',
        'DTSTAMP:' + ics(new Date()), 'DTSTART:' + ics(alvo), 'DTEND:' + ics(fimEv), 'SUMMARY:Casamento ' + nomes,
        'LOCATION:' + q.replace(/,/g, '\\,'), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/calendar' }));
      a.download = 'casamento.ics'; document.body.appendChild(a); a.click(); a.remove();
    });
  });
  $$('[data-acao="compartilhar"]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      if (navigator.share) navigator.share({ title: 'Casamento ' + nomes, text: 'Você é nosso convidado! ' + nomes, url: location.href }).catch(function () {});
      else copiar(location.href, 'Link copiado!');
    });
  });

  // ---------- Gaveta inferior ----------
  function abrirFolha(el) { el.hidden = false; document.body.classList.add('travado'); requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('aberto'); }); }); }
  function fecharFolha(el) { el.classList.remove('aberto'); document.body.classList.remove('travado'); setTimeout(function () { el.hidden = true; }, 320); }
  $$('.folha').forEach(function (f) {
    f.addEventListener('click', function (e) { if (e.target === f) fecharFolha(f); });
    $$('[data-fechar]', f).forEach(function (b) { b.addEventListener('click', function () { fecharFolha(f); }); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') $$('.folha.aberto').forEach(fecharFolha); });

  // ---------- Confirmação pelo WhatsApp ----------
  function limpar(t, max) { return String(t || '').replace(/[\u0000-\u001F\u007F<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max); }
  var folhaR = $('#folha-rsvp'), destino = null, vai = true;
  var caixa = $('#rsvp-botoes');
  if (caixa) {
    (C.confirmacao || []).forEach(function (d) {
      if (!d || !d.rotulo) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'acao';
      b.innerHTML = '<span class="acao-icone" aria-hidden="true"></span><span class="acao-txt"><b></b><small></small></span><em aria-hidden="true">›</em>';
      $('.acao-icone', b).textContent = d.tipo === 'online' ? '◉' : '♡';
      $('b', b).textContent = d.rotulo; $('small', b).textContent = d.detalhe || 'Enviar pelo WhatsApp';
      b.addEventListener('click', function () { destino = d; $('#rsvp-para').textContent = d.detalhe || d.rotulo; abrirFolha(folhaR); });
      caixa.appendChild(b);
    });
  }
  if (folhaR) {
    $$('[data-vai]', folhaR).forEach(function (b) {
      b.addEventListener('click', function () {
        vai = b.getAttribute('data-vai') === 'sim';
        $$('[data-vai]', folhaR).forEach(function (x) { x.classList.toggle('ativo', x === b); x.setAttribute('aria-pressed', x === b); });
        $('#campo-qtd').hidden = !vai;
      });
    });
    $('#rsvp-enviar').addEventListener('click', function () {
      var f = $('#rsvp-form'), nome = limpar(f.nome.value, 60);
      if (nome.length < 2) { aviso('Digite seu nome, por favor'); f.nome.focus(); return; }
      var num = String(destino && destino.whatsapp || '').replace(/\D/g, '');
      if (num.length < 12) { aviso(C.demonstracao ? 'Demonstração: aqui abre o WhatsApp dos noivos' : 'Número não configurado'); return; }
      var qtd = Math.min(20, Math.max(1, parseInt(f.qtd.value, 10) || 1)), msg = limpar(f.recado.value, 300);
      var online = destino.tipo === 'online';
      var l = vai
        ? ['Olá! ' + (online ? 'Vou acompanhar on-line' : 'Confirmo minha presença') + ' no casamento de ' + nomes + ' 🤍', '', '*Nome:* ' + nome].concat(online ? [] : ['*Pessoas:* ' + qtd])
        : ['Olá! Infelizmente não poderei ir ao casamento de ' + nomes + '.', '', '*Nome:* ' + nome];
      if (msg) l.push('*Recado:* ' + msg);
      window.open('https://wa.me/' + num + '?text=' + encodeURIComponent(l.join('\n')), '_blank', 'noopener');
      fecharFolha(folhaR); folhas();
    });
  }

  // ---------- Pix (QR gerado no próprio celular) ----------
  function tlv(id, v) { v = String(v); return id + String(v.length).padStart(2, '0') + v; }
  function semAcento(s, max) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9 ]/g, '').toUpperCase().slice(0, max).trim(); }
  function crc16(s) { var c = 0xFFFF; for (var i = 0; i < s.length; i++) { c ^= s.charCodeAt(i) << 8; for (var j = 0; j < 8; j++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF; } return c.toString(16).toUpperCase().padStart(4, '0'); }
  function pix(valor) {
    var px = C.pix || {};
    var s = tlv('00', '01') + tlv('26', tlv('00', 'br.gov.bcb.pix') + tlv('01', String(px.chave).trim())) + tlv('52', '0000') + tlv('53', '986') +
      (valor ? tlv('54', Number(valor).toFixed(2)) : '') + tlv('58', 'BR') + tlv('59', semAcento(px.nome, 25) || 'NOIVOS') +
      tlv('60', semAcento(px.cidade, 15) || 'BRASIL') + tlv('62', tlv('05', '***')) + '6304';
    return s + crc16(s);
  }
  function qr(el, texto) {
    el.textContent = ''; if (!window.QRCodeLib) return;
    var q2 = new window.QRCodeLib.QRCode(-1, window.QRCodeLib.L.M); q2.addData(texto); q2.make();
    var n = q2.getModuleCount(), c = 6, b = 3, t = (n + b * 2) * c, cv = document.createElement('canvas');
    cv.width = cv.height = t; var g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, t, t); g.fillStyle = '#17251d';
    for (var r = 0; r < n; r++) for (var k = 0; k < n; k++) if (q2.isDark(r, k)) g.fillRect((k + b) * c, (r + b) * c, c, c);
    cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', 'QR Code Pix'); el.appendChild(cv);
  }
  var temPix = C.pix && String(C.pix.chave || '').trim().length > 3;
  function brl(v) { return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
  var folhaP = $('#folha-pix');
  function abrirPix(it) {
    if (!folhaP) return;
    $('#pix-titulo').textContent = it ? it.nome : 'Presente em Pix';
    $('#pix-valor').textContent = it && it.valor ? brl(it.valor) : 'Valor livre';
    var area = $('#pix-qr'), cop = $('#pix-copia'), av = $('#pix-aviso');
    if (temPix) { var code = pix(it ? it.valor : 0); qr(area, code); area.hidden = false; cop.hidden = false; av.hidden = true; cop.onclick = function () { copiar(code, 'Pix copia e cola copiado!'); }; }
    else { area.hidden = true; cop.hidden = true; av.hidden = false; }
    abrirFolha(folhaP);
  }
  $$('[data-acao="pix-livre"]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); abrirPix(null); }); });

  var ICONES = {
    aviao: 'M2.5 13.5l19-6.5-19-6.5 3.5 6.5-3.5 6.5zM6 7h15.5',
    taca: 'M8 3h8l-.7 5.5a3.3 3.3 0 0 1-6.6 0L8 3zm4 8.8V20m-3.5 0h7',
    cama: 'M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 14h18M6.5 9V7.5h4V9M3 18v2m18-2v2',
    xicara: 'M4 9h12v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9zm12 1.5h1.5a2 2 0 0 1 0 4H16M8 4.5v2m4-2v2',
    panela: 'M4 10h16v5.5A3.5 3.5 0 0 1 16.5 19h-9A3.5 3.5 0 0 1 4 15.5V10zm-2 0h2m16 0h2M9 7h6',
    folha: 'M5 19C5 10 11 4.5 19.5 4.5 19.5 13 14 19 5 19zm0 0l8.5-8.5',
    coracao: 'M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z',
    presente: 'M4 11h16v9H4zM3 7.5h18V11H3zM12 7.5V20M12 7.5C10 3.8 6.4 4.6 7.6 7.5M12 7.5c2-3.7 5.6-2.9 4.4 0',
    casa: 'M4 11l8-7 8 7v9H4v-9zm6 9v-5h4v5',
    concha: 'M12 19L4.5 9a8 8 0 0 1 15 0L12 19zm0 0V7m0 12L8 8.5m4 10.5l4-10.5'
  };
  var lp = $('#lista-presentes');
  if (lp) (C.presentes || []).forEach(function (it) {
    var card = document.createElement('button'); card.type = 'button'; card.className = 'presente rv';
    card.innerHTML = '<span class="pr-icone"><svg viewBox="0 0 24 24" aria-hidden="true"><path/></svg></span><b></b><small></small><span class="pr-valor"></span><span class="pr-btn">Presentear</span>';
    $('path', card).setAttribute('d', ICONES[it.icone] || ICONES.presente);
    $('b', card).textContent = it.nome; $('small', card).textContent = it.descricao || ''; $('.pr-valor', card).textContent = brl(it.valor);
    card.addEventListener('click', function () { abrirPix(it); });
    lp.appendChild(card);
  });

  // ---------- Música ----------
  var audio = $('#musica'), btnSom = $('#btn-som');
  if (audio && C.musica) { audio.src = C.musica; audio.volume = 0.3; } else { audio = null; if (btnSom) btnSom.hidden = true; }
  function tocar() { if (!audio) return; audio.play().then(function () { if (btnSom) btnSom.classList.add('tocando'); }).catch(function () {}); }
  if (btnSom) btnSom.addEventListener('click', function () { if (!audio) return; if (audio.paused) tocar(); else { audio.pause(); btnSom.classList.remove('tocando'); } });

  // ---------- Revelar ao rolar ----------
  function observar() {
    var itens = $$('.rv:not(.vis)');
    if (!('IntersectionObserver' in window)) { itens.forEach(function (e) { e.classList.add('vis'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    itens.forEach(function (e) { io.observe(e); });
  }

  // ---------- Folhinhas subindo ----------
  function folhas() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cv = document.createElement('canvas'); cv.className = 'confete'; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv);
    var W = cv.width = innerWidth, H = cv.height = innerHeight, g = cv.getContext('2d'), ps = [];
    var cores = C.coresFolhas || ['#6f7d5c', '#879574', '#aeb99a', '#b8985b'];
    for (var i = 0; i < 24; i++) ps.push({ x: W / 2 + (Math.random() - .5) * 120, y: H * .45, vx: (Math.random() - .5) * 1.8, vy: -(Math.random() * 2 + .9), s: Math.random() * 7 + 7, r: Math.random() * 6.28, sp: (Math.random() - .5) * .05, life: 0, max: Math.random() * 40 + 60, c: cores[i % cores.length] });
    (function loop() {
      g.clearRect(0, 0, W, H);
      ps = ps.filter(function (q3) { return q3.life < q3.max; });
      ps.forEach(function (q3) {
        q3.x += q3.vx + Math.sin(q3.life / 9) * .4; q3.y += q3.vy; q3.r += q3.sp; q3.life++;
        g.save(); g.globalAlpha = Math.max(0, 1 - q3.life / q3.max); g.translate(q3.x, q3.y); g.rotate(q3.r); g.fillStyle = q3.c;
        g.beginPath(); g.ellipse(0, 0, q3.s * .42, q3.s, .55, 0, 6.283); g.fill();
        g.beginPath(); g.moveTo(0, -q3.s * .8); g.lineTo(0, q3.s * .8); g.strokeStyle = '#d8c27d'; g.lineWidth = .7; g.stroke(); g.restore();
      });
      if (ps.length) requestAnimationFrame(loop); else cv.remove();
    })();
  }

  function aviso(t) {
    var el = $('#toast'); if (!el) { el = document.createElement('div'); el.id = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove('on'); }, 2600);
  }
  function copiar(t, ok) {
    function fb() { var ta = document.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', ''); ta.className = 'fora'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); aviso(ok); } catch (e) { aviso('Não deu pra copiar'); } ta.remove(); }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(function () { aviso(ok); }, fb); else fb();
  }

  // ---------- Abrir o convite (chamado pela abertura de cada modelo) ----------
  window.Convite = {
    abrir: function (atraso) {
      tocar(); folhas();
      setTimeout(function () {
        document.body.classList.remove('travado'); document.body.classList.add('aberto');
        window.scrollTo(0, 0); observar();
      }, atraso || 0);
    },
    folhas: folhas, tocar: tocar
  };
  if (!document.body.classList.contains('travado')) observar();
})();
