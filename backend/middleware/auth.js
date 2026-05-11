import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {

  try {

    const token = req.headers.token;

    if (!token) {

      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decode = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // STORE USER INFO
    req.user = token_decode;

    next();

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: "Error",
    });
  }
};

export default authMiddleware;