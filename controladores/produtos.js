const pool = require("../conexao");
const cadastrarProduto = async (req, res) => {
  const usuario_id = req.usuario.id;
  const { titulo, categoria, descricao, preco, estoque, imagem } = req.body;

  if (!descricao) {
    return res.status(400).json({ mensagem: "Descrição é obrigatório" });
  }
  if (!titulo) {
    return res.status(400).json({ mensagem: "Titulo é obrigatório" });
  }
  if (!categoria) {
    return res.status(400).json({ mensagem: "Categoria é obrigatório" });
  }
  if (!preco) {
    return res.status(400).json({ mensagem: "preço é obrigatório" });
  }
  if (!estoque) {
    return res.status(400).json({ mensagem: "Estoque é obrigatório" });
  }
  if (!imagem) {
    return res.status(400).json({ mensagem: "Imagem é obrigatório" });
  }
  try {
    const query = await pool.query(
      "insert into produtos (titulo, categoria, descricao, preco, estoque, imagem, usuario_id)values($1, $2, $3, $4, $5, $6, $7) returning *",
      [titulo, categoria, descricao, preco, estoque, imagem, usuario_id]
    );
    if (query.rowCount === 0) {
      return res
        .status(500)
        .json({ mensagem: "Não foi possível cadastrar produto" });
    }
    return res.status(201).json(query.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const atualizarProdutos = async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.usuario.id;
  const { titulo, categoria, descricao, preco, estoque, imagem } = req.body;

  if (!descricao) {
    return res.status(400).json({ mensagem: "Descrição é obrigatório" });
  }
  if (!titulo) {
    return res.status(400).json({ mensagem: "Titulo é obrigatório" });
  }
  if (!categoria) {
    return res.status(400).json({ mensagem: "Categoria é obrigatório" });
  }
  if (!preco) {
    return res.status(400).json({ mensagem: "preço é obrigatório" });
  }
  if (!estoque) {
    return res.status(400).json({ mensagem: "Estoque é obrigatório" });
  }
  if (!imagem) {
    return res.status(400).json({ mensagem: "Imagem é obrigatório" });
  }
  try {
    const queryProduto =
      "select * from  produtos where id = $1 and usuario_id = $2";
    const { rowCount: produtoExistente } = await pool.query(queryProduto, [
      id,
      usuario_id,
    ]);
    if (!produtoExistente) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    const query =
      "update produtos set titulo=$1, categoria=$2, descricao=$3, preco=$4, estoque=$5, imagem=$6 where id = $7";
    const { rows } = await pool.query(query, [
      titulo,
      categoria,
      descricao,
      preco,
      estoque,
      imagem,
      id,
    ]);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const deletarProduto = async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.usuario.id;
  try {
    const queryProduto =
      "select * from produtos where id = $1 and usuario_id = $2";
    const { rowCount: produtoExistente } = await pool.query(queryProduto, [
      id,
      usuario_id,
    ]);
    if (!produtoExistente) {
      return res.status(404).json({ mensagem: "Produto não encontrada" });
    }

    const query = "delete from produtos where id=$1 and usuario_id =$2";
    const { rowCount } = await pool.query(query, [id, usuario_id]);

    if (rowCount < 1) {
      return res.status(404).json({ mensagem: "Produto não excluído" });
    }
    return res.status(200).send();
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

const listarProduto = async (req, res) => {
  const { id } = req.params;
  try {
    const query = "select * from produtos where id=$1";
    const { rows, rowCount } = await pool.query(query, [id]);
    if (rowCount < 1)
      return res.status(400).json({ mensagem: "Produto não encontrado!" });
    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const listarProdutos = async (req, res) => {
  try {
    const query = "select * from produtos";
    const { rows, rowCount } = await pool.query(query);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

//teste

const listarProdutosUsuario = async (req, res) => {
  const usuario_id = req.usuario.id;
  try {
    const query = "select * from produtos where usuario_id=$1";
    const { rows } = await pool.query(query, [usuario_id]);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  cadastrarProduto,
  atualizarProdutos,
  deletarProduto,
  listarProdutosUsuario,
  listarProduto,
  listarProdutos,
};
