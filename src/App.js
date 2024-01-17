// App.js or your root component is the entry point to your app.
import SignUp from "./components/signUp.jsx";
import Login from "./components/login.jsx";
import Home from "./components/home.jsx";
import TodoList from "./components/todoList.jsx";
import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
 
function App() {
 
  return (
    <Router>
      <div style={{ backgroundColor: '#FCF6F5'}}>
        <section>                              
            <Routes>
               <Route path="/" element={<Home/>}/>
               <Route path="/signUp" element={<SignUp/>}/>
               <Route path="/logIn" element={<Login/>}/>
               <Route path="/todo" element={<TodoList/>}/>
            </Routes>                    
        </section>
      </div>
    </Router>
  );
}
 
export default App;