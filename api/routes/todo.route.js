import express from "express";
import {
  getTodos,
  addTodo,
  editTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";

const router = express.Router();

router.get("/", getTodos);
router.post("/", addTodo);
router.put("/:id", editTodo);
router.delete("/:id", deleteTodo);

export default router;
