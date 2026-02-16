import React, { useState } from 'react';
import './RegisterPage.css';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';
import { urlConfig } from '../../config';

function RegisterPage() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState('');  

    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    const handleRegister = async () => {
        console.log("Register invoked");

    try {
        const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            }),
        });

        //const data = await response.json();
        const json = await response.json();
        console.log('json data', json);
        console.log('er', json.error);
        
        if (response.ok) {
            //if (data.authtoken) {
            if (json.authtoken) {
                //sessionStorage.setItem('auth-token', data.authtoken);
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', firstName);
                //sessionStorage.setItem('email', data.email);
                sessionStorage.setItem('email', json.email);
            }
            
            setIsLoggedIn(true);
            //navigate('/dashboard');
            navigate('/app');
        } else {
            //setShowerr(data.error || 'An error occurred. Please try again.');
            setShowerr(json.error || 'An error occurred. Please try again.');
        }
    } catch (e) {
        console.log("Error fetching details: " + e.message);
        setShowerr('An error occurred. Please try again.');
    }
};

         return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="register-card p-4 border rounded">
                            <h2 className="text-center mb-4 font-weight-bold">Register</h2>
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter your first name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter your last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
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
                            {showerr && <div className="text-danger">{showerr}</div>}
                            <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>Register</button>
                            <p className="mt-4 text-center">
                                Already a member? <a href="/app/login" className="text-primary">Login</a>
                            </p>
                         </div>
                    </div>
                </div>
            </div>
         )
}

export default RegisterPage;