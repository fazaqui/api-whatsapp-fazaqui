const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

// Configuração do Cliente WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--no-zygote',
            '--single-process'
        ]
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR CODE RECEBIDO, ESCANEIE COM O WHATSAPP');
});

client.on('ready', () => {
    console.log('CLIENTE WHATSAPP PRONTO!');
});

const prestadores = [
  { servico: 'eletricista', cidade: 'cachoeirinha', nome: 'Carlos Silva', contato: '51999999999' },
  { servico: 'encanador', cidade: 'cachoeirinha', nome: 'Marcos Souza', contato: '51888888888' }
];

client.on('message', async msg => {
    const text = msg.body.toLowerCase();
    
    // Lógica simples: "buscar eletricista em cachoeirinha"
    if (text.startsWith('buscar ')) {
        const parts = text.replace('buscar ', '').split(' em ');
        if (parts.length === 2) {
            const servico = parts[0].trim();
            const cidade = parts[1].trim();

            const encontrado = prestadores.find(p => 
                p.servico === servico && p.cidade === cidade
            );

            if (encontrado) {
                msg.reply(`Encontrei! Fale com ${encontrado.nome} no link: wa.me/${encontrado.contato}`);
            } else {
                msg.reply('Nenhum prestador encontrado para este serviço nesta cidade.');
            }
        } else {
            msg.reply('Por favor, use o formato: buscar [servico] em [cidade]');
        }
    }
});

app.post('/buscar-prestador', (req, res) => {
  const { servico, cidade } = req.body;
  
  const encontrado = prestadores.find(p => 
    p.servico === servico.toLowerCase() && p.cidade === cidade.toLowerCase()
  );

  if (encontrado) {
    return res.json({ mensagem: 'Encontrei! Fale com ' + encontrado.nome + ' no link: wa.me/' + encontrado.contato });
  }
  return res.json({ mensagem: 'Nenhum prestador encontrado nesta cidade.' });
});

client.initialize();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('API rodando na porta ' + PORT));
