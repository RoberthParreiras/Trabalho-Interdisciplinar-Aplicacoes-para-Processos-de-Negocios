import jwt from "jsonwebtoken";

function autenticar(req, res, next) {
  const jwtToken = req.cookies.jwt;

  if (!jwtToken) {
    return res.status(401).json({ error: "Acesso negado" });
  }

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido ou expirado." });
  }
}

export { autenticar };
