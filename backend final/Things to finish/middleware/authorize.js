exports.requireRole = (role) => {
  return (req, res, next) => {
    const userRole = req.headers["role"];

    if (!userRole) {
      return res.status(403).json({ message: "Role required" });
    }

    if (userRole !== role) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
