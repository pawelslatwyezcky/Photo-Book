import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decodedData;
    if (token) {
      decodedData = jwt.verify(token, process.env.SECRET_TOKEN);
      req.userId = decodedData?.id;
    }
    next();
  } catch (error) {
    console.log("Middleware error:", error);
  }
};

export default auth;
