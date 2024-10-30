// importação das funções do Firestore
// collection: criar uma referencia a uma coleção no firestore;
//doc: criar uma referencia a um documento especifico;
//addDoc: adiciona um novo documento a uma coleção no firestore;
//getDocs: recupera todos os docs de uma coleção
//getDoc: recupera um documento especifico pelo ID
//updateDoc: atualizar os campos de um DocumentSnapshot;
//deleteDoc: remover um documento especifico no firestore.
const { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, setDoc } = require('firebase/firestore');

//importação da instancia do firestore
const db = require('../db/firebase');
const path = require('path')


//defini função produtosRoutes
//o parametro server é a instancia do express
const produtosRoutes = (server) => {

  //definição da rota para criação de produtos
  server.post('/produtos', async (req, res) => {

    try {

      //extração dos dados do corpo da requisição
      const { nome_produto, preco } = req.body;

      //validação dos dados
      if (!nome_produto || preco == null) {
        return res.status(400).send('Os campos "nome_produto" e "preco" são obrigatórios.');
      }

      //adicionando o produto ao Firestore
      const docRef = await addDoc(collection(db, 'produtos'), { nome_produto, preco });

      res.status(201).send(`Produto adicionado com ID: ${docRef.id}`);
    } catch (error) {
      res.status(500).send('Erro ao adicionar produto: ' + error.message);
    }
  });

  //definindo a rota GET para listagem de produtos
  server.get('/produtos', async (req, res) => {

    try {
      const busca = await getDocs(collection(db, 'produtos'));

      const produtos = busca.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      res.render(path.join(__dirname, '/../public/views/viewGetProdutos'), {
        produtos
      });


    } catch (error) {
      res.status(500).send('Erro ao buscar produtos: ' + error.message);
    }
  });

  server.get('/editarProduto', async (req, res) => {
    try {
      const id = req.query.id;  // Get the ID from the query parameter
      if (!id) {
        console.error("ID do produto não fornecido");
        res.render(path.join(__dirname, '/../public/views/viewCriarProduto'), {
        });
        return;
      }

      const produtoRef = doc(db, 'produtos', id);  // Reference to the document
      const produtoDoc = await getDoc(produtoRef);  // Fetch the document

      if (produtoDoc.exists()) {
        const produto = { id: produtoDoc.id, ...produtoDoc.data() };  // Combine ID with data

        res.render(path.join(__dirname, '/../public/views/viewEditarProduto'), {
          produto,
        });
      } else {
        res.status(404).send('Produto não encontrado');
      }

    } catch (error) {
      res.status(500).send('Erro ao buscar produto: ' + error.message);
    }
  });

  // Atualizar Produto por ID (PUT /produtos/:id)
  // definição da rota PUT para atualizar produto por ID
  server.post('/editarProduto', async (req, res) => {
    try {
      const { nome_produto, preco } = req.body;  // Destructure product name and price from the request body

      if (req.query.id) {
        const produtoRef = doc(db, 'produtos', req.query.id);
        const produtoSnapshot = await getDoc(produtoRef);
        if (produtoSnapshot.exists()) {
          // If the document exists, update it
          await setDoc(produtoRef, { nome_produto, preco }, { merge: true });
          console.log('Produto atualizado com sucesso!');
        }
      } else {
        // If the document does not exist, create it
        await addDoc(collection(db, 'produtos'), { nome_produto, preco });

        console.log('Produto criado com sucesso!');
      }

      // Redirect or respond with a success message
      res.redirect('/produtos');  // Redirect to a product listing page or any other page after saving
    } catch (error) {
      res.status(500).send('Erro ao atualizar ou criar produto: ' + error.message);
    }
  });



  // Remover Produto por ID (DELETE /produtos/:id)
  //definição da rota DELETE
  server.get('/deletarProduto', async (req, res) => {
    try {
      const id = req.query.id;  // Obtém o ID do produto a ser deletado a partir dos parâmetros de consulta

      // Referência ao documento a ser deletado
      const produtoRef = doc(db, 'produtos', id);

      // Deleta o documento
      await deleteDoc(produtoRef);
      console.log('Produto deletado com sucesso!');

      // Redireciona ou responde com uma mensagem de sucesso
      res.redirect('/produtos');  // Redireciona para a listagem de produtos ou outra página após a exclusão
    } catch (error) {
      res.status(500).send('Erro ao deletar produto: ' + error.message);
    }
  });



};

module.exports = produtosRoutes;
