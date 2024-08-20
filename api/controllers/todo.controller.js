import Todo from "../models/todo.model.js";

// get all todos

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// add todo

const addTodo = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const todo = await Todo.create({ title });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// edit todo

const editTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const todo = await Todo.findByIdAndUpdate(id, title);
    if (!todo) throw new Error("To do not found");
    const updatedTodo = await Todo.findById(id);
    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) throw new Error("Todo not found");
    res.status(200).json({ message: "Todo removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getTodos, addTodo, editTodo, deleteTodo };
