const server = require('./server');

const produtosRoutes = require('./rotas/produtos');

produtosRoutes(server);

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
