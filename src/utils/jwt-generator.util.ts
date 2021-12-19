import jwt from "jsonwebtoken";

const secret = (process.env.JWT_SECRET as string) || "";

const jwtGenerator = (): string => {
  return jwt.sign({}, secret, { expiresIn: "60s" });
};

export default jwtGenerator;
