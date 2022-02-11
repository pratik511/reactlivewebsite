import React, { useEffect, useState } from 'react';
import './App.css';
import Alert from './component/Alert';
import List from './component/List';

const getLocalStorage = () => {
  let list = localStorage.getItem("todolist");
  if (list) {
    return (list = JSON.parse(localStorage.getItem("todolist")));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIdEditing] = useState(false);
  const [editId, setEditID] = useState(null);
  // const [check, setCheck] = useState(false);
  // console.log("Checked Button",check);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  useEffect(() => {
    localStorage.setItem("todolist", JSON.stringify(list));
  }, [list]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "danger", "Please Enter Valuess");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name }
          }
          return item
        })
      );
      setName("");
      setEditID(null);
      setIdEditing(false);
      showAlert(true, "success", "Value Change");
    } else {
      showAlert(true, "success", "Item Added to the List");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  }
  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  }

  const removeItem = (id) => {
    showAlert(true, "danger", "Item Removed");
    setList(list.filter((item) => item.id !== id));
  };
  const editItem = (id) => {
    const editItem = list.find((item) => item.id === id);
    setIdEditing(true);
    setEditID(id);
    setName(editItem.title);
  };
  const clearList = () => {
    showAlert(true, "danger", "Empty List");
    setList([]);
  };

  // const checkedItem = (id) =>{
  //     console.log(id);
  //     // console.log(setCheck(true));
  //     // setCheck(check !== true)
  //   };

  return (
    <section className="section-center">
      <form onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Todo List Itemsss</h3>
        <div className="mb-3 form">
          <input type="text" className="form-control" placeholder="Enter Value" onChange={(e) => setName(e.target.value)} value={name} />
          <button type="submit" className="btn btn-success">{isEditing ? "Edit" : "Submit"} </button>
        </div>
      </form>
      {list.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <div className="text-center">
            <button className="btn btn-warning" onClick={clearList}>Clear Items</button>
          </div>
        </div>
      )}
    </section>
  )
}

export default App;
