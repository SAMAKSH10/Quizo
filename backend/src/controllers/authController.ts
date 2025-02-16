import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authServices";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    user?: { id: number; username: string };
  }
}


export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  await registerUser(username, password);
  res.status(201).json({ message: "User registered successfully" });
};

export const login_user = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await loginUser(username, password);

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  req.session.user = { id: user.id, username: user.username };
  res.json({ message: "Logged in successfully" });
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => res.json({ message: "Logged out successfully" }));
};