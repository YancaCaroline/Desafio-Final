const jwt = require("jsonwebtoken");
const pool = require("../conexao");
const senhaUsuarios = require("../senhaUsuarios");

const verificarUsuarioLogado = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ mensagem: "Não autorizado" });
  }
  try {
    const token = authorization.replace("Bearer", "").trim();
    const { id } = jwt.verify(token, senhaUsuarios);
    const query = "select * from usuarios where id = $1";
    const { rows, rowCount } = await pool.query(query, [id]);

    if (rowCount === 0) {
      return res.status(401).json({ mensagem: "Não autorizado" });
    }
    const { senha, ...usuario } = rows[0];

    req.usuario = usuario;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ mensagem: "Não autorizado" });
  }
};

module.exports = { verificarUsuarioLogado };
