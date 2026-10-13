/* Modelo 1 — rompe o selo e a capa sobe */
(function () {
  'use strict';
  var tela = document.getElementById('abertura'), btn = document.getElementById('abrir'), aberto = false;
  btn.addEventListener('click', function () {
    if (aberto) return; aberto = true;
    btn.classList.add('clicked');
    document.querySelector('.envelope-text').classList.add('sumiu');
    window.Convite.abrir(700);
    setTimeout(function () { tela.classList.add('saiu'); }, 700);
    setTimeout(function () { tela.remove(); }, 1600);
  });
})();
