import React, { useState, useEffect, useCallback } from "react";
import './Statistics.css';
import { AppBar, Toolbar, Typography, Button, Snackbar, Alert, Select, TextField, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const SERVER_URL = "http://127.0.0.1:5000";

const States = {

  PENDING: "PENDING",
  USER_CREATION: "USER_CREATION",
  USER_LOG_IN: "USER_LOG_IN",
  USER_AUTHENTICATED: "USER_AUTHENTICATED",

};

function Statistics() {
  let [changebuyindividual, setchangebuyinividual] = useState("");
  let [changesellindividual, setchangesellinividual] = useState("");
  let [changebuyoverall, setchangebuyoverall] = useState("");
  let [changeselloverall, setchangeselloverall] = useState("");


  const initgraph = [
    { Number: "Transaction 1" },


  ];

  const [selldata, setsellData] = useState(initgraph);
  const [buydata, setbuyData] = useState(initgraph);
  const [overallbuydata, setoverallbuyData] = useState(initgraph);
  const [overallselldata, setoverallsellData] = useState(initgraph);


  useEffect(() => {
    fetch(`${SERVER_URL}/graph_sell`)
      .then(response => response.json())
      .then(data => {
        setsellData(data)
        const length = data.length;
        const lastValue = data[length - 1]['Sell usd'];
        const secondLastValue = data[length - 2]['Sell usd'];
        setchangesellinividual(((lastValue - secondLastValue) / secondLastValue) * 100);

      })
  }, []);

  useEffect(() => {
    fetch(`${SERVER_URL}/graph_buy`)
      .then(response => response.json())
      .then(data => {
        setbuyData(data)
        const length = data.length;
        const lastValue = data[length - 1]['Buy usd'];
        const secondLastValue = data[length - 2]['Buy usd'];
        setchangebuyinividual(((lastValue - secondLastValue) / secondLastValue) * 100);
      })
  }, []);

  useEffect(() => {
    fetch(`${SERVER_URL}/graph_overallsell`)
      .then(response => response.json())
      .then(data => {
        setoverallsellData(data)
        const length = data.length;
        const lastValue = data[length - 1]['Overall Sell usd'];
        const secondLastValue = data[length - 2]['Overall Sell usd'];
        setchangeselloverall(((lastValue - secondLastValue) / secondLastValue) * 100);
      })
  }, []);

  useEffect(() => {
    fetch(`${SERVER_URL}/graph_overallbuy`)
      .then(response => response.json())
      .then(data => {
        setoverallbuyData(data)
        const length = data.length;
        const lastValue = data[length - 1]['Overall Buy usd'];
        const secondLastValue = data[length - 2]['Overall Buy usd'];
        setchangebuyoverall(((lastValue - secondLastValue) / secondLastValue) * 100);
      })
  }, []);

  return (
    <div className="App">
      <div className='wrapper'>
        <div className="section col-md-6">
          <Typography variant="h4">Statistics</Typography>
          <Typography variant="h5">
            The change percentage between the last two transactions for buying USD = {" "} %
            <span>{changebuyindividual}</span>
          </Typography>
          <Typography variant="h5">
            The change percentage between the last two transactions for selling USD = {" "} %
            <span>{changesellindividual}</span>
          </Typography>
          <Typography variant="h5">
            The total change in exchange rate for buying USD = {" "} %
            <span>{changebuyoverall}</span>
          </Typography>
          <Typography variant="h5">
            The total change in exchange rate for selling USD = {" "} %
            <span>{changeselloverall}</span>
          </Typography>
          <div className="section-content">

          </div>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item">

          <div className='wrapper'>
            <div className="section col-md-6">
              <h3 className="section-title">Buy USD Graph (Individual Transactions)</h3>
              <div className="section-content">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={buydata} margin={{ top: 15, right: 0, bottom: 15, left: 0 }}>
                    <defs>
                      <linearGradient id="buy-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FB8833" />
                        <stop offset="100%" stopColor="#FFB54F" />
                      </linearGradient>
                    </defs>
                    <Tooltip />
                    <XAxis dataKey="Number" stroke="#003399" />
                    <YAxis stroke="#003399" />
                    <CartesianGrid stroke="#003399" strokeDasharray="5 5" />
                    <Legend />
                    <Line type="monotone" dataKey="Buy usd" stroke="url(#buy-gradient)" strokeWidth={3} dot={{ stroke: "#FB8833", strokeWidth: 2, r: 6 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div class="grid-item">
          <div className='wrapper'>
            <div className="section col-md-6">
              <h3 className="section-title">Overall Buy USD Graph (Total Transactions)</h3>
              <div className="section-content">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={overallbuydata} margin={{ top: 15, right: 0, bottom: 15, left: 0 }}>
                    <defs>
                      <linearGradient id="overallbuy-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FB8833" />
                        <stop offset="100%" stopColor="#FFB54F" />
                      </linearGradient>
                    </defs>
                    <Tooltip />
                    <XAxis dataKey="Date" stroke="#003399" />
                    <YAxis stroke="#003399" />
                    <CartesianGrid stroke="#003399" strokeDasharray="5 5" />
                    <Legend />
                    <Line type="monotone" dataKey="Overall Buy usd" stroke="url(#overallbuy-gradient)" strokeWidth={3} dot={{ stroke: "#FB8833", strokeWidth: 2, r: 6 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div class="grid-item">
          <div className='wrapper'>
            <div className="section col-md-6">
              <h3 className="section-title">Sell USD Graph (Individual Transactions)</h3>
              <div className="section-content">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={selldata} margin={{ top: 15, right: 0, bottom: 15, left: 0 }}>
                    <defs>
                      <linearGradient id="sell-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FB8833" />
                        <stop offset="100%" stopColor="#FFB54F" />
                      </linearGradient>
                    </defs>
                    <Tooltip />
                    <XAxis dataKey="Number" stroke="#003399" />
                    <YAxis stroke="#003399" />
                    <CartesianGrid stroke="#003399" strokeDasharray="5 5" />
                    <Legend />
                    <Line type="monotone" dataKey="Sell usd" stroke="url(#sell-gradient)" strokeWidth={3} dot={{ stroke: "#FB8833", strokeWidth: 2, r: 6 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div class="grid-item">
          <div className='wrapper'>
            <div className="section col-md-6">
              <h3 className="section-title">Overall Sell USD Graph (Total Transactions)</h3>
              <div className="section-content">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={overallselldata} margin={{ top: 15, right: 0, bottom: 15, left: 0 }}>
                    <defs>
                      <linearGradient id="overallsell-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FB8833" />
                        <stop offset="100%" stopColor="#FFB54F" />
                      </linearGradient>
                    </defs>
                    <Tooltip />
                    <XAxis dataKey="Date" stroke="#003399" />
                    <YAxis stroke="#003399" />
                    <CartesianGrid stroke="#003399" strokeDasharray="5 5" />
                    <Legend />
                    <Line type="monotone" dataKey="Overall Sell usd" stroke="url(#overallsell-gradient)" strokeWidth={3} dot={{ stroke: "#FB8833", strokeWidth: 2, r: 6 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
      <script src="script.js"></script>
    </div >
  );
}

export default Statistics;
