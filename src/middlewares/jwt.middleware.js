import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  //1.Read the token
  const token = req.headers["authorization"];
  console.log(token)
  //2.If no token, return the error
  if (!token) {
    return res.status(401).send ("Unauthorised");
  }

  //3.Check if token is valid.
  try {
    const payload = jwt.verify(token, "C8g4fQ5agMcqdgE9kKYAAF95lMIeNAI7");
    req.userId = payload.userId;
    console.log(payload);
  } catch (err) {
    //4.return error
    return res.status(401).send("Unauthorised");
  }

  //5.Call next middleware
  next();
};

export default jwtAuth;
