
import { register, removeUser, login, getAllUsers } from "../controllers/userController.js";
import express from "express";


const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.delete("/removeUser", removeUser);

router.get("/getAllUsers", getAllUsers);

export default router;