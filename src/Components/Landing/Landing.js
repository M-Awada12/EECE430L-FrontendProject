import React, { useState, useEffect, useCallback } from "react";
import './Landing.css';
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

function Landing() {

  const [buyUsdRate, setBuyUsdRate] = useState(null);
  const [sellUsdRate, setSellUsdRate] = useState(null);
  const [lbpInput, setLbpInput] = useState("");
  const [usdInput, setUsdInput] = useState("");

  let [transaction1, setTransaction1] = useState("usd-to-lbp");
  let [transaction2, setTransaction2] = useState("usd-to-lbp");
  let [userToken, setUserToken] = useState(getUserToken());
  let [authState, setAuthState] = useState(States.PENDING);
  let [rateResult, setrateResult] = useState("");
  let [amountInput, setAmountInput] = useState("");
  let [userTransactions, setUserTransactions] = useState([]);

  useEffect(fetchRates, []);

  const fetchUserTransactions = useCallback(() => {
    fetch(`${SERVER_URL}/transaction`, {
      headers: {
        Authorization: `bearer ${userToken}`
      }
    })
      .then((response) => response.json())
      .then((transactions) => setUserTransactions(transactions));
  }, [userToken]);

  useEffect(() => {
    if (userToken) {
      fetchUserTransactions();
    }
  }, [fetchUserTransactions, userToken]);

  function fetchRates() {
    fetch(`${SERVER_URL}/exchangeRate`)
      .then(response => response.json())
      .then(data => {
        setBuyUsdRate(data.lbp_to_usd);
        setSellUsdRate(data.usd_to_lbp);
      });
  }

  const handleCalculate = () => {
    const rate = transaction1 === "usd-to-lbp" ? sellUsdRate : buyUsdRate;
    const result = transaction1 === "usd-to-lbp" ? rate * amountInput : amountInput / rate;
    setrateResult(Math.round(100 * result) / 100);
  };

  function addItem(event) {
    event.preventDefault();
    const lbpInputValue = Number(lbpInput);
    const usdInputValue = Number(usdInput);

    if (!lbpInputValue || !usdInputValue) {
      alert("Please fill the required fields");
      return;
    }

    if (lbpInputValue <= 0 || usdInputValue <= 0) {
      alert("Please enter appropriate input");
      setLbpInput("");
      setUsdInput("");
      return;
    }

    const trans = transaction2 === "usd-to-lbp" ? 1 : 0;
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

    fetch(`${SERVER_URL}/transaction`, {
      method: "POST",
      headers,
      body: JSON.stringify(transactionData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Transaction added:", data);
        fetchRates();
      })
      .catch((error) => {
        console.error("Error adding transaction:", error);
      });

    setLbpInput("");
    setUsdInput("");
  }

  return (
    <div className="App">
      <div className="wrapper">
        <Typography variant="h4">Today's Exchange Rate</Typography>
        <Typography variant="subtitle1">LBP to USD Exchange Rate</Typography>
        <br />
        <Typography variant="h5">Buy USD: <span id="buy-usd-rate" type="number">{buyUsdRate ? buyUsdRate : "Not available yet"}</span></Typography>
        <Typography variant="h5">Sell USD: <span id="sell-usd-rate" type="number">{sellUsdRate ? sellUsdRate : "Not available yet"}</span></Typography>
        <hr />

        <div className="calculator">
          <Typography variant="h4">Rate Calculator</Typography>
          <Select
            labelId="transaction-type"
            id="transaction-type"
            value={transaction1}
            onChange={(e) => {
              setTransaction1(e.target.value);
              setrateResult("");
            }}
            style={{ fontSize: '15px', padding: '0px' }}
          >
            <MenuItem value="usd-to-lbp">USD to LBP</MenuItem>
            <MenuItem value="lbp-to-usd">LBP to USD</MenuItem>
          </Select>
          <br />
          <br />
          <form name="transaction-entry">
            <div className="amount-input">
              <Typography variant="h6" htmlFor="amount-input">
                {transaction1 === "usd-to-lbp"
                  ? "Amount in USD"
                  : "Amount in LBP"}
              </Typography>
              <TextField
                id="amount-input"
                type="number"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
              />
            </div>
            <Typography variant="h5">
              {transaction1 === "usd-to-lbp"
                ? "Amount in LBP"
                : "Amount in USD"} = {" "}
              <span id="rate-result">{rateResult}</span>
            </Typography>
            <br />
            <Button
              id="calculate-button"
              variant="contained"
              color="primary"
              onClick={handleCalculate}
            >
              Calculate
            </Button>
          </form>
        </div>

      </div>
      <div className="wrapper">
        <Typography variant="h4">
          Record a recent transaction
        </Typography>
        <Select
          labelId="transaction_type"
          id="transaction_type"
          value={transaction2}
          onChange={e => setTransaction2(e.target.value)}
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
            <TextField id="lbp-amount" type="number" value={lbpInput} onChange={e => setLbpInput(e.target.value)} />
          </div>
          <div className="amount-input">
            <Typography variant="h6" htmlFor="usd-amount">USD Amount</Typography>
            <TextField id="usd-amount" type="number" value={usdInput} onChange={e => setUsdInput(e.target.value)} />
          </div>
          <Button id="add-button" variant="contained" color="primary" onClick={addItem}>
            Add
          </Button>
        </form>
      </div>
      {
        userToken && (
          <div className="wrapper">
            <Typography variant="h4">Your Transactions</Typography>
            {userTransactions && userTransactions.transactions && (
              <DataGrid
                columns={[
                  { field: 'id', headerName: 'ID' },
                  { field: 'usd_amount', headerName: 'USD Amount' },
                  { field: 'lbp_amount', headerName: 'LBP Amount' },
                  { field: 'usd_to_lbp', headerName: 'Trans Type' },
                  { field: 'added_date', headerName: 'Date' },
                  { field: 'user_id', headerName: 'MyID' }]}
                rows={userTransactions.transactions}
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

export default Landing;
