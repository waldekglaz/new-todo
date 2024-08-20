import { useState, useEffect } from "react";

interface Todo {
  title: string;
  _id: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [isEditOn, setIsEditOn] = useState<boolean>(false);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  const handleDelete = (id: string) => {
    fetch(`http://localhost:3000/api/todos/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTodos(todos.filter((todo) => todo._id !== id));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: userInput }),
    })
      .then((res) => res.json())
      .then((data) => setTodos([...todos, data]));
    setUserInput("");
  };

  const handleEdit = (e) => {
    e.preventDefault();
    console.log(userInput, "userInput");
    if (!activeTodo) return;
    fetch(`http://localhost:3000/api/todos/${activeTodo?._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: userInput }),
    })
      .then((res) => res.json())
      .then((updatedTodo) => {
        console.log(updatedTodo, "updatedTodo");
        setTodos(
          todos.map((todo) =>
            todo._id === activeTodo._id ? updatedTodo : todo
          )
        );
        setIsEditOn(false);
        setUserInput("");
        setActiveTodo(null);
      });
  };

  useEffect(() => {
    fetch("http://localhost:3000/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  const editTodo = (todo: Todo) => {
    setIsEditOn(true);
    setUserInput(todo.title);
    setActiveTodo(todo);
  };

  const toggleCompleted = (id: string) => {
    const currentTodo = todos.find((todo) => todo._id === id);
    fetch(`http://localhost:3000/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: currentTodo?.completed ? false : true,
        title: activeTodo?.title,
      }),
    }).then(() => {
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    });
  };

  console.log(todos);

  return (
    <main>
      <h1 className="title">Todo App</h1>

      <div>
        <form
          onSubmit={!isEditOn ? (e) => handleSubmit(e) : (e) => handleEdit(e)}
        >
          <input
            type="text"
            placeholder={!isEditOn ? "Add a new todo" : "Edit todo"}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button type="submit">{!isEditOn ? "Add" : "Edit"}</button>
        </form>

        <ul>
          {todos.length > 0 ? (
            todos.map((todo) => (
              <li key={todo.title} className="todo">
                <div>
                  <span
                    className={todo.completed ? "completed" : ""}
                    onClick={() => editTodo(todo)}
                  >
                    {todo.title}
                  </span>{" "}
                  <button onClick={() => handleDelete(todo._id)}>X</button>
                  <button onClick={() => toggleCompleted(todo._id)}>
                    {todo.completed ? "Undo" : "Complete"}
                  </button>
                </div>
              </li>
            ))
          ) : (
            <div>No todos yet</div>
          )}
        </ul>
      </div>
      <div>
        <li>To add todo enter todo and click Add or press Enter</li>
        <li>To edit todo click on todo text</li>
        <li>To delete todo click X button</li>
      </div>
    </main>
  );
}

export default App;
