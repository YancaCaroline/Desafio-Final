const pool = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const senhaJwt = require("../senhaUsuarios");

const cadastrarUsuario = async (req, res) => {
  const { nomeDaLoja, email, senha } = req.body;
  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const query = await pool.query(
      "insert into usuarios (nomeDaLoja, email, senha)values($1, $2, $3) returning *",
      [nomeDaLoja, email, senhaCriptografada]
    );
    const { rows } = query;
    const { senha: _, ...usuarioLogado } = rows[0];

    return res.json({ usuarioLogado });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const query = "select * from usuarios where email = $1";
    const { rows, rowCount } = await pool.query(query, [email]);

    if (rowCount < 1) {
      return res.status(404).json({ mensagem: "teste 1" });
    }
    const user = rows[0];
    const senhaValida = await bcrypt.compare(senha, user.senha);
    console.log(senhaValida);
    if (!senhaValida) {
      return res.status(400).json({ mensagem: "Teste 2" });
    }
    const token = jwt.sign({ id: user.id }, senhaJwt, {
      expiresIn: 100000000000,
    });
    const { senha: _, ...usuarioLogado } = user;

    return res.json({ usuario: usuarioLogado, token });
  } catch (error) {
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  cadastrarUsuario,
  login,
};
