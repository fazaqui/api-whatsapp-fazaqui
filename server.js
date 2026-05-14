const express = require('express');
const app = express();
app.use(express.json());

const prestadores = [
  { servico: 'eletricista', cidade: 'cachoeirinha', nome: 'Carlos Silva', contato: '51999999999' },
  { servico: 'encanador', cidade: 'cachoeirinha', nome: 'Marcos Souza', contato: '51888888888' }
];

app.post('/buscar-prestador', (req, res) => {
  const { servico, cidade } = req.body;
  
  const encontrado = prestadores.find(p => 
    p.servico === servico.toLowerCase() && p.cidade === city.toLowerCase()
  );

  if (encontrado) {
    return res.json({ mensagem: 'Encontrei! Fale com ' + encontrado.nome + ' no link: wa.me/' + encontrado.contato });
  }
  return res.json({ mensagem: 'Nenhum prestador encontrado nesta cidade.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('API rodando na porta ' + PORT));
