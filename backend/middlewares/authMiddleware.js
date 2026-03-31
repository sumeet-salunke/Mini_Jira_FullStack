import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    //check header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }
    //extract token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: "No token"
      })
    }
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //attach user to request
    req.user = decoded;//contains {id:....}
    //continue
    next();


  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized - No token Provided",
    });
  }
};



// const authMiddleware = (req, res, next) => {
//   console.log("Auth middleware hit");

//   try {
//     const authHeader = req.headers.authorization;
//     console.log("Authorization header:", authHeader);

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         message: "Unauthorized - No token",
//       });
//     }

//     const token = authHeader.split(" ")[1];
//     console.log("Token:", token);

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded:", decoded);

//     req.user = decoded;

//     next();
//   } catch (error) {
//     console.log("Middleware error:", error.message);
//     return res.status(401).json({
//       message: "Unauthorized - Invalid token",
//     });
//   }
// };

export default authMiddleware;