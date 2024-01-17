import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully");
        }).catch((error) => {
            // An error happened.
        });
    }

    const handleLogIn = () => {
        navigate("/login");
    }

    return (
        <>
            <nav style={{ backgroundColor: '#3498db', color: '#fff', padding: '10px', textAlign: 'center' }}>
                <p style={{ margin: '0' }}>
                    <h1 style={{ fontSize: '1.5em' }}>Welcome to TodoApp!</h1>
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                    <div style={{ flex: '1', margin: '0 10px' }}>
                        <button style={{ backgroundColor: '#2ecc71', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }} onClick={handleLogIn}>
                            LogIn
                        </button>
                    </div>

                    <div style={{ flex: '1', margin: '0 10px' }}>
                        <button style={{ backgroundColor: '#e74c3c', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }} onClick={handleLogout}>
                            LogOut
                        </button>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Home;
