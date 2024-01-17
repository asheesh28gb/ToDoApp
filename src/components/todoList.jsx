import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { doc, collection, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import "./TodoList.css";

const TodoList = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [list, setList] = useState("");
  const [blockArray, setBlockArray] = useState([]);

  const addList = () => {
    if (list) {
      const newBlock = {
        id: blockArray.length + 1,
        title: list,
        cards: [],
      };

      setBlockArray((prevTasks) => [...prevTasks, newBlock]);
      setList("");
    } else {
      alert("Please enter a list name.");
    }
  };

  const addTask = async () => {
    if (taskTitle && taskDescription && taskDueDate && taskPriority) {
      try {
        const taskRef = await addDoc(collection(db, "tasks"), {
          title: taskTitle,
          description: taskDescription,
          dueDate: taskDueDate,
          priority: taskPriority,
        });

        const newTask = {
          id: taskRef.id,
          title: taskTitle,
          description: taskDescription,
          dueDate: taskDueDate,
          priority: taskPriority,
        };

        const updatedBlockArray = blockArray.map((block) => {
          if (block.title === list) {
            return {
              ...block,
              cards: [...block.cards, newTask],
            };
          }
          return block;
        });

        setBlockArray(updatedBlockArray);
      } catch (error) {
        console.error("Error adding task to Firestore:", error);
      }

      setList("");
      setTaskTitle("");
      setTaskDescription("");
      setTaskDueDate("");
      setTaskPriority("");
    } else {
      alert("Please fill in all task details.");
    }
  };

  const removeTask = async (taskId, priority) => {
    try {
      await deleteDoc(doc(db, "tasks", taskId));

      const updatedBlockArray = blockArray.map((block) => {
        if (block.title === priority) {
          const updatedCards = block.cards.filter((task) => task.id !== taskId);
          return {
            ...block,
            cards: updatedCards,
          };
        }
        return block;
      });

      setBlockArray(updatedBlockArray);
    } catch (error) {
      console.error("Error removing task from Firestore:", error);
    }
  };

  const moveTask = (dragIndex, hoverIndex, dragBlock, hoverBlock) => {
    const draggedTask = blockArray.find((block) => block.title === dragBlock)
      .cards[dragIndex];
    const updatedBlockArray = [...blockArray];

    // Remove the task from the source block
    const sourceBlockIndex = updatedBlockArray.findIndex(
      (block) => block.title === dragBlock
    );
    updatedBlockArray[sourceBlockIndex].cards.splice(dragIndex, 1);

    // Add the task to the destination block
    const destinationBlockIndex = updatedBlockArray.findIndex(
      (block) => block.title === hoverBlock
    );
    updatedBlockArray[destinationBlockIndex].cards.splice(
      hoverIndex,
      0,
      draggedTask
    );

    setBlockArray(updatedBlockArray);
  };

  const Task = ({ task, index, block }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "task",
      item: { id: task.id, index, block },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: "task",
      hover: (draggedItem) => {
        if (draggedItem.block !== block) {
          moveTask(draggedItem.index, index, draggedItem.block, block);
          draggedItem.index = index;
          draggedItem.block = block;
        }
      },
    });

    return (
      <div
        ref={(node) => drag(drop(node))}
        style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}
      >
        <li>
          <div contentEditable="true" spellCheck="false">
            <strong>{task.title}</strong>
            <p>{task.description}</p>
            <p>Due Date: {task.dueDate}</p>
            <p>Priority: {task.priority}</p>
          </div>
          <button onClick={() => removeTask(task.id, block)}>Delete</button>
        </li>
      </div>
    );
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <>
      <h1>Todo List</h1>
      <div className="border">
        <div>
          <input
            type="text"
            value={list}
            placeholder="New List Name"
            onChange={(e) => setList(e.target.value)}
          />
          <button onClick={addList}>
            <b>Add List</b>
          </button>
        </div>
      </div>

      <div className="border">
        <div>
          <label>
            <b>Title:</b>
          </label>
          <input
            type="text"
            value={taskTitle}
            placeholder="Title"
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </div>

        <div>
          <label>
            <b>Description:</b>
          </label>
          <input
            type="text"
            value={taskDescription}
            placeholder="Desc..."
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </div>
        <div>
          <label>
            <b>Due Date:</b>
          </label>
          <input
            type="date"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
          />
        </div>

        <div>
          <label>
            <b>Priority:</b>
          </label>
          <select
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
          >
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label>
            <b>Select List</b>
          </label>
          <select value={list} onChange={(e) => setList(e.target.value)}>
            <option value="">Select List...</option>
            {blockArray.map((block) => (
              <option key={block.id} value={block.title}>
                {block.title}
              </option>
            ))}
          </select>
        </div>
        <button onClick={addTask}>
          <b>Add Task</b>
        </button>
        <DndProvider backend={HTML5Backend}>
          {blockArray.map((block) => (
            <div key={block.id} className="list-container">
              <div className="list">
                <h2>List: {block.title}</h2>
              </div>
              {["High", "Medium", "Low"].map((priority) => {
                const tasksWithPriority = block.cards.filter((task) => task.priority === priority);
                return (
                  <div key={priority} className="list-priority">
                    <h2>{priority}</h2>
                      {tasksWithPriority.map((task, index) => (
                        <Task 
                          key={index}
                          task={task}
                          index={index}
                          block={block.title}
                          onDrop={moveTask} 
                        />
                      ))}
                  </div>
                );
              })}
            </div>
          ))}
        </DndProvider>

        <nav style={{ color: "#fff", padding: "10px", textAlign: "center" }}>
          <div>
            <button
              style={{
                backgroundColor: "#e74c3c",
                color: "#fff",
                padding: "10px 15px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "1em",
              }}
              onClick={handleLogout}
            >
              LogOut
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default TodoList;
