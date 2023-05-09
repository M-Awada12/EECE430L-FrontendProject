import React, { useState, useEffect, useCallback } from "react";
import './Exchange.css';
import { AppBar, Toolbar, Typography, Button, Snackbar, Alert, Select, TextField, MenuItem } from '@mui/material';
import { getUserToken } from "../../localStorage";
import { DataGrid } from '@mui/x-data-grid';

const SERVER_URL = "http://127.0.0.1:5000";

const States = {

    PENDING: "PENDING",
    USER_CREATION: "USER_CREATION",
    USER_LOG_IN: "USER_LOG_IN",
    USER_AUTHENTICATED: "USER_AUTHENTICATED",

};

function Exchange() {
    const [lbpInput1, setLbpInput1] = useState("");
    const [usdInput1, setUsdInput1] = useState("");
    const [accept, setaccept] = useState("");

    let [transaction3, setTransaction3] = useState("usd-to-lbp");
    let [userToken, setUserToken] = useState(getUserToken());
    let [userrequests, setUserrequests] = useState([]);
    let [useraccepted, setUseraccpted] = useState([]);
    let [useroffered, setUseroffered] = useState([]);
    let [others, setothers] = useState([]);




    const fetchUserRequests = useCallback(() => {
        fetch(`${SERVER_URL}/getuserrequests`, {
            headers: {
                Authorization: `bearer ${userToken}`
            }
        })
            .then((response) => response.json())
            .then((requests) => setUserrequests(requests));
    }, [userToken]);

    useEffect(() => {
        if (userToken) {
            fetchUserRequests();
        }
    }, [fetchUserRequests, userToken]);


    const fetchUseraccepted = useCallback(() => {
        fetch(`${SERVER_URL}/getaccepteduserrequests`, {
            headers: {
                Authorization: `bearer ${userToken}`
            }
        })
            .then((response) => response.json())
            .then((requests) => setUseraccpted(requests));
    }, [userToken]);

    useEffect(() => {
        if (userToken) {
            fetchUseraccepted();
        }
    }, [fetchUseraccepted, userToken]);


    const fetchUseroffered = useCallback(() => {
        fetch(`${SERVER_URL}/getacceptedotherrequests`, {
            headers: {
                Authorization: `bearer ${userToken}`
            }
        })
            .then((response) => response.json())
            .then((requests) => setUseroffered(requests));
    }, [userToken]);

    useEffect(() => {
        if (userToken) {
            fetchUseroffered();
        }
    }, [fetchUseroffered, userToken]);


    const fetchothers = useCallback(() => {
        fetch(`${SERVER_URL}/getotherrequests`, {
            headers: {
                Authorization: `bearer ${userToken}`
            }
        })
            .then((response) => response.json())
            .then((requests) => setothers(requests));
    }, [userToken]);

    useEffect(() => {
        if (userToken) {
            fetchothers();
        }
    }, [fetchothers, userToken]);

    function addrequest(event) {
        event.preventDefault();
        const lbpInputValue = Number(lbpInput1);
        const usdInputValue = Number(usdInput1);

        if (!lbpInputValue || !usdInputValue) {
            alert("Please fill the required fields");
            return;
        }

        if (lbpInputValue <= 0 || usdInputValue <= 0) {
            alert("Please enter appropriate input");
            setLbpInput1("");
            setUsdInput1("");
            return;
        }

        const trans = transaction3 === "usd-to-lbp" ? 1 : 0;
        const transactionData = {
            lbp_amount: lbpInputValue,
            usd_amount: usdInputValue,
            usd_to_lbp: trans
        };

        const headers = {
            "Content-Type": "application/json"
        };

        if (userToken) {
            headers.Authorization = `Bearer ${userToken}`;
        }

        fetch(`${SERVER_URL}/addrequest`, {
            method: "POST",
            headers,
            body: JSON.stringify(transactionData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Request added:", data);
            })
            .catch((error) => {
                console.error("Error adding transaction:", error);
            });

        setLbpInput1("");
        setUsdInput1("");
    }

    function addaccept(event) {
        event.preventDefault();
        const lbpInputValue = Number(accept);

        if (!lbpInputValue) {
            alert("Please fill the required fields");
            return;
        }

        if (lbpInputValue <= 0) {
            alert("Please enter appropriate input");
            setLbpInput1("");
            setUsdInput1("");
            return;
        }

        const transactionData = {
            id: lbpInputValue,
        };

        const headers = {
            "Content-Type": "application/json"
        };

        if (userToken) {
            headers.Authorization = `Bearer ${userToken}`;
        }

        fetch(`${SERVER_URL}/acceptexchange`, {
            method: "PUT",
            headers,
            body: JSON.stringify(transactionData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Request accepted:", data);
            })
            .catch((error) => {
                console.error("Error accepting transaction:", error);
            });

        setaccept("");
    }


    return (
        <div className="App">
            {
                userToken && (
                    <div className="wrapper">
                        <Typography variant="h4">
                            Add a Transaction Request
                        </Typography>
                        <Select
                            labelId="transaction_type"
                            id="transaction_type"
                            value={transaction3}
                            onChange={e => setTransaction3(e.target.value)}
                            style={{ fontSize: '15px', padding: '0px' }}
                        >
                            <MenuItem value="usd-to-lbp">USD to LBP</MenuItem>
                            <MenuItem value="lbp-to-usd">LBP to USD</MenuItem>
                        </Select>
                        <br />
                        <br />
                        <form name="transaction-entry">
                            <div className="amount-input">
                                <Typography variant="h6" htmlFor="lbp-amount">LBP Amount</Typography>
                                <TextField id="lbp-amount" type="number" value={lbpInput1} onChange={e => setLbpInput1(e.target.value)} />
                            </div>
                            <div className="amount-input">
                                <Typography variant="h6" htmlFor="usd-amount">USD Amount</Typography>
                                <TextField id="usd-amount" type="number" value={usdInput1} onChange={e => setUsdInput1(e.target.value)} />
                            </div>
                            <Button id="add-button" variant="contained" color="primary" onClick={addrequest}>
                                Add
                            </Button>
                        </form>
                    </div>
                )
            }

            {
                userToken && (
                    <div className="wrapper">
                        <Typography variant="h4">Available Transactions</Typography>
                        {others && others.requests && (
                            <DataGrid
                                columns={[
                                    { field: 'id', headerName: 'ID' },
                                    { field: 'usd_amount', headerName: 'USD Amount' },
                                    { field: 'lbp_amount', headerName: 'LBP Amount' },
                                    { field: 'usd_to_lbp', headerName: 'Trans Type' },
                                    { field: 'added_date', headerName: 'Date' },
                                    { field: 'user_id', headerName: 'MyID' },
                                    { field: 'accepted', headerName: 'accepted' },
                                    { field: 'receiver_id', headerName: 'Receiver ID' }]}
                                rows={others.requests}
                                autoHeight
                            />
                        )}
                    </div>

                )
            }
            {
                userToken && (
                    <div className="wrapper">
                        <Typography variant="h4">
                            Accept a Transaction
                        </Typography>
                        <br />
                        <br />
                        <form name="transaction-entry">
                            <div className="amount-input">
                                <Typography variant="h6" htmlFor="usd-amount">Enter Transaction ID</Typography>
                                <TextField id="usd-amount" type="number" value={accept} onChange={e => setaccept(e.target.value)} />
                            </div>
                            <Button id="add-button" variant="contained" color="primary" onClick={addaccept}>
                                Accept
                            </Button>
                        </form>
                    </div>
                )
            }
            {
                userToken && (
                    <div className="wrapper">
                        <Typography variant="h4">Your Pending Requests</Typography>
                        {userrequests && userrequests.requests && (
                            <DataGrid
                                columns={[
                                    { field: 'id', headerName: 'ID' },
                                    { field: 'usd_amount', headerName: 'USD Amount' },
                                    { field: 'lbp_amount', headerName: 'LBP Amount' },
                                    { field: 'usd_to_lbp', headerName: 'Trans Type' },
                                    { field: 'added_date', headerName: 'Date' },
                                    { field: 'user_id', headerName: 'MyID' },
                                    { field: 'accepted', headerName: 'accepted' },
                                    { field: 'receiver_id', headerName: 'Receiver ID' }]}
                                rows={userrequests.requests}
                                autoHeight
                            />
                        )}
                    </div>

                )
            }
            {
                userToken && (
                    <div className="wrapper">
                        <Typography variant="h4">Your Accepted Requests</Typography>
                        {useraccepted && useraccepted.requests && (
                            <DataGrid
                                columns={[
                                    { field: 'id', headerName: 'ID' },
                                    { field: 'usd_amount', headerName: 'USD Amount' },
                                    { field: 'lbp_amount', headerName: 'LBP Amount' },
                                    { field: 'usd_to_lbp', headerName: 'Trans Type' },
                                    { field: 'added_date', headerName: 'Date' },
                                    { field: 'user_id', headerName: 'MyID' },
                                    { field: 'accepted', headerName: 'accepted' },
                                    { field: 'receiver_id', headerName: 'Receiver ID' }]}
                                rows={useraccepted.requests}
                                autoHeight
                            />
                        )}
                    </div>

                )
            }
            {
                userToken && (
                    <div className="wrapper">
                        <Typography variant="h4">Requests Accepted by You</Typography>
                        {useroffered && useroffered.requests && (
                            <DataGrid
                                columns={[
                                    { field: 'id', headerName: 'ID' },
                                    { field: 'usd_amount', headerName: 'USD Amount' },
                                    { field: 'lbp_amount', headerName: 'LBP Amount' },
                                    { field: 'usd_to_lbp', headerName: 'Trans Type' },
                                    { field: 'added_date', headerName: 'Date' },
                                    { field: 'user_id', headerName: 'MyID' },
                                    { field: 'accepted', headerName: 'accepted' },
                                    { field: 'receiver_id', headerName: 'Receiver ID' }]}
                                rows={useroffered.requests}
                                autoHeight
                            />
                        )}
                    </div>

                )
            }

            <script src="script.js"></script>
        </div >
    );
}

export default Exchange;
