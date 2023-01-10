const express = require("express");
const {
  verificarUsuarioLogado,
} = require("./intermediarios/verificarUsuarioLogado");
const { cadastrarUsuario, login } = require("./controladores/usuarios");
const {
  listarProdutos,
  listarProduto,
  atualizarProdutos,
  deletarProduto,
  listarProdutosUsuario,
  cadastrarProduto,
} = require("./controladores/produtos");

const rotas = express();

rotas.post("/usuario", cadastrarUsuario);
rotas.post("/login", login);
rotas.get("/produtos", listarProdutos);
rotas.get("/produtos/:id", listarProduto);
rotas.use(verificarUsuarioLogado);
rotas.get("/produtosUsuario", listarProdutosUsuario);
rotas.post("/produtos", cadastrarProduto);
rotas.put("/produtos/:id", atualizarProdutos);
rotas.delete("/produtos/:id", deletarProduto);

module.exports = rotas;
