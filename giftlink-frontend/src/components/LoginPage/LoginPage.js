import React, { useState, useEffect } from 'react';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState('');

    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('bearer-token');
    const { setIsLoggedIn } = useAppContext();

    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
          navigate('/app');
        }
      }, [navigate]);
  
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
                },
                body: JSON.stringify({    
                    email: email,
                    password: password,
                }),
            });

            const json = await response.json();

            if (json.authtokenk) {
                sessionStorage.setItem('bearer-token', json.authtoken);
                sessionStorage.setItem('user-name', json.userName);
                sessionStorage.setItem('user-email', json.userEmail);

                setIsLoggedIn(true);
                navigate('/app');
            } else {
                setIncorrect(json.error || 'Invalid email or password.');
            }
        } catch (e) {
            console.log("Error fetching details: " + e.message);
            document.getElementById("email").value="";
            document.getElementById("password").value="";
            setIncorrect('An error occurred. Please try again.');
            setTimeout(() => {
                setIncorrect("");
              }, 2000);
        }
    };

        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="login-card p-4 border rounded">
                            <h2 className="text-center mb-4 font-weight-bold">Login</h2>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <span style={{color:'red',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{incorrect}</span>
                            <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>  
                            <p className="mt-4 text-center">
                                New here? <a href="/app/register" className="text-primary">Register Here</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default LoginPage;