/* =========================================================
   DADOS DO CONVITE — edite só este arquivo
   Texto vai entre aspas ' '. Para esconder uma parte, deixe ''.
   ========================================================= */
window.CONVITE = {
  noivo: 'Arthur',
  noiva: 'Paty',

  // Data e hora (manter o -03:00 no final = horário de Brasília)
  data: '2030-06-12T15:00:00-03:00',

  local: {
    nome: 'Natureza Buffet e Eventos',
    endereco: 'Av. Maximiliano Falck, 380',
    bairro: '',
    cidade: '',      // PENDENTE: ex 'Cidade - RJ'
    linkMaps: ''     // opcional: cole o link do Google Maps do salão
  },

  frase: 'Junto de nossas famílias',
  textoConvite: 'É com muita alegria que convidamos você para o nosso casamento.',
  textoEspecial: 'Prepare o coração para celebrar conosco o início de uma nova história.',
  despedida: 'Esperamos você para viver este momento conosco.',
  assinatura: 'Com carinho, os noivos',
  traje: '',         // ex 'Esporte fino'
  rsvpPrazo: '',     // ex 'Por favor, confirme até 12/05/2030'

  // Confirmação: um botão por linha. whatsapp = 55 + DDD + número, só números
  confirmacao: [
    { rotulo: 'Confirmar presença', detalhe: 'Enviar confirmação pelo WhatsApp', whatsapp: '5522998508630' }
  ],

  // Fotos na pasta "fotos". A 1ª é a capa; as outras vão para o carrossel
  fotos: ['fotos/foto1.jpg', 'fotos/foto2.jpg', 'fotos/foto3.jpg', 'fotos/foto4.jpg'],

  musica: 'musica.mp3',   // '' = sem música

  // Pix: o QR Code e o copia e cola são gerados sozinhos
  pix: {
    chave: '',       // PENDENTE: e-mail, telefone (+55...), CPF ou chave aleatória
    nome: 'Paty',    // nome de quem recebe
    cidade: ''       // cidade de quem recebe
  },
  presentesTexto: 'Sua presença é o nosso maior presente. Se desejar nos presentear, escolha um dos itens abaixo e contribua via Pix.',
  // ícones: aviao, taca, cama, xicara, panela, folha, coracao, presente, casa, concha
  presentes: [
    { icone: 'aviao', nome: 'Passagens da lua de mel', descricao: 'Para chegarmos ao destino', valor: 350 },
    { icone: 'concha', nome: 'Dia de praia na viagem', descricao: 'Sol, mar e descanso', valor: 180 },
    { icone: 'taca', nome: 'Jantar romântico', descricao: 'Uma noite especial a dois', valor: 150 },
    { icone: 'xicara', nome: 'Café da manhã', descricao: 'Para começar o dia juntinhos', valor: 80 },
    { icone: 'cama', nome: 'Enxoval do quarto', descricao: 'Lençóis e travesseiros novos', valor: 220 },
    { icone: 'panela', nome: 'Jogo de panelas', descricao: 'Para a cozinha da casa nova', valor: 190 },
    { icone: 'casa', nome: 'Casa nova', descricao: 'Ajude a montar o nosso lar', valor: 300 },
    { icone: 'folha', nome: 'Cantinho verde', descricao: 'Plantas para a varanda', valor: 70 }
  ],

  // true enquanto a cliente escolhe / false na entrega final
  demonstracao: false
};
