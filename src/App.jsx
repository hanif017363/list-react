import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [name, setName] = useState([]);
  const [input, setInput] = useState("");
  const [filterName, setFilteredName] = useState(null);

  const getData = async () => {
    try {
      const res = await fetch(`http://localhost:3000/list`);
      const data = await res.json();
      setName(data);
      setFilteredName(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    let filtered = [...name];
    if (input) {
      filtered = filtered.filter(
        (pokemon) =>
          pokemon.name.toLowerCase().includes(input.toLowerCase()) ||
          pokemon.id.toString().includes(input)
      );
    }
    setFilteredName(filtered);
  }, [name, input]);
  const handleAddTask = async (text) => {
    if (!text.trim()) return;

    // Generate a unique ID (increment from the last item's ID)

    const newName = {
      id: Date.now() + "",
      name: text,
      date: new Date().toISOString(),
      order: name.length + 1,
    };

    try {
      await fetch(`http://localhost:3000/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newName),
      });

      setInput(""); // Clear input field
      getData(); // Refresh list after adding
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    const updatedList = name.filter((item) => item.id !== id);
    setFilteredName(updatedList);
    setName(updatedList);
    try {
      await fetch(`http://localhost:3000/list/${id}`, {
        method: "DELETE",
      });

      getData();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Main List</h1>
      <div className="card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTask(input);
          }}
        >
          <input
            value={input} // Controlled input fix
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Add your task here"
            style={{ width: "300px", height: "30px", padding: "6px" }}
          />
          <button type="submit">Add</button>
        </form>
      </div>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th style={{ padding: "1rem" }}>Action</th>
              <th style={{ padding: "1rem" }}>Serial No</th>
              <th style={{ padding: "1rem" }}>Name</th>
              <th style={{ padding: "1rem" }}>Date</th>
              <th style={{ padding: "1rem" }}>Order</th>
            </tr>
          </thead>
          <tbody>
            {filterName?.map((item, index) => (
              <tr key={item.id}>
                <td style={{ padding: "1rem" }}>
                  <button onClick={() => handleDeleteTask(item.id)}>x</button>
                </td>
                <td style={{ padding: "1rem" }}>{index + 1}</td>

                <td style={{ padding: "1rem" }}>{item.name}</td>
                <td>
                  {new Date(item.date).toLocaleString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                  })}
                </td>
                <td style={{ padding: "1rem" }}>{item.order}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
