import bcrypt from "bcryptjs";
import { pool } from "../config/database";

export const registerUser = async (username: string, password: string) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      "INSERT INTO users (username, password) VALUES (?, ?)", 
      [username, hashedPassword]
    );

    return { success: true, message: "User registered successfully" };
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Username already exists. Please choose another.");
    }
    throw new Error("Database error: " + error.message);
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const [rows]: any = await pool.execute(
      "SELECT * FROM users WHERE username = ? LIMIT 1", 
      [username]
    );

    if (!rows.length) return null; // No user found

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    
    return isValid ? user : null;
  } catch (error) {
    throw new Error("Database error: " + error);
  }
};
