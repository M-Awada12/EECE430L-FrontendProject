import React, { useState, useEffect } from "react";
import './Navbar.css';
import UserCredentialsDialog from './UserCredentialsDialog/UserCredentialsDialog';
import { AppBar, Toolbar, Typography, Button, Snackbar, Alert, Select, TextField, MenuItem } from '@mui/material';
import { getUserToken, saveUserToken, clearUserToken } from "../../localStorage"
import { NavLink } from "react-router-dom";



const SERVER_URL = "http://127.0.0.1:5000";

const States = {

    PENDING: "PENDING",
    USER_CREATION: "USER_CREATION",
    USER_LOG_IN: "USER_LOG_IN",
    USER_AUTHENTICATED: "USER_AUTHENTICATED",

};

function Navbar() {

    let [userToken, setUserToken] = useState(getUserToken());
    let [authState, setAuthState] = useState(States.PENDING);
    const [click, setClick] = useState(false);
    let [x, setx] = useState(0);

    function login(username, password) {
        return fetch(`${SERVER_URL}/authentication`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_name: username,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((body) => {
                window.location.reload();
                setAuthState(States.USER_AUTHENTICATED);
                setUserToken(body.token);
                saveUserToken(body.token);
            });
    }

    function createUser(username, password) {
        return fetch(`${SERVER_URL}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_name: username,
                password: password,
            }),
        }).then((response) => login(username, password))
        .then((body) => {
            window.location.reload();
        });
    }

    function logout() {
        setUserToken(null);
        clearUserToken();
        if (x == 0)
        {
            window.location.reload();
        }
    }

    const handleClick = () => {setClick(!click); setx(0);}
    const handleClick1 = () => {setClick(!click); setx(1);}
    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h5" className="title">
                        Exchange Tracker
                    </Typography>
                    <div className="navlinks">
                        {userToken !== null ? (
                            <>
                                <NavLink
                                    exact
                                    to="/"
                                    activeClassName="active"
                                    className="nav-link"
                                    onClick={handleClick}
                                >
                                    <Button color="inherit">Home</Button>
                                </NavLink>
                                <NavLink
                                    exact
                                    to="/Statistics"
                                    activeClassName="active"
                                    className="nav-link"
                                    onClick={handleClick}
                                >
                                    <Button color="inherit">Statistics</Button>
                                </NavLink>
                                <NavLink
                                    exact
                                    to="/Exchange"
                                    activeClassName="active"
                                    className="nav-link"
                                    onClick={handleClick1}
                                >
                                    <Button color="inherit">Exchange</Button>
                                </NavLink>
                                <NavLink
                                    exact
                                    to="/"
                                    activeClassName="active"
                                    className="nav-link"
                                    onClick={handleClick}
                                >
                                    <Button color="inherit" onClick={logout}>
                                        Logout
                                    </Button>
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    exact
                                    to="/"
                                    activeClassName="active"
                                    className="nav-link"
                                    onClick={handleClick}
                                >
                                    <Button color="inherit">Home</Button>
                                </NavLink>
                                <NavLink
                                    exact
                                    to="/Statistics"
                                    activeClassName="active"
                                    className="nav-link"
                                    onClick={handleClick}
                                >
                                    <Button color="inherit">Statistics</Button>
                                </NavLink>
                                <NavLink
                                    exact
                                    to="/"
                                    activeClassName="active"
                                    className="nav-link"
                                    onClick={handleClick}
                                >
                                    <Button
                                        color="inherit"
                                        onClick={() => setAuthState(States.USER_CREATION)}
                                    >
                                        Register
                                    </Button>
                                </NavLink>
                                <NavLink
                                    exact
                                    to="/"
                                    activeClassName="active"
                                    className="nav-link"
                                    onClick={handleClick}
                                >
                                    <Button
                                        color="inherit"
                                        onClick={() => setAuthState(States.USER_LOG_IN)}
                                    >
                                        Login
                                    </Button>
                                </NavLink>
                            </>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
            <UserCredentialsDialog open={authState === States.USER_CREATION} onClose={() => setAuthState(States.PENDING)} onSubmit={(username, password) => createUser(username, password)} title="Register" submitText="Register" />
            <UserCredentialsDialog open={authState === States.USER_LOG_IN} onClose={() => setAuthState(States.PENDING)} onSubmit={(username, password) => login(username, password)} title="Login" submitText="Login" />
            <Snackbar
                elevation={6}
                variant="filled"
                open={authState === States.USER_AUTHENTICATED}
                autoHideDuration={2000}
                onClose={() => setAuthState(States.PENDING)}
            >
                <Alert severity="success">Success</Alert>
            </Snackbar>
            <script src="script.js"></script>
        </div >
    );
}

export default Navbar;