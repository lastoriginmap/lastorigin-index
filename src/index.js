import React from 'react';
import ReactDOM from 'react-dom';
import * as Common from './common.js';
import App from './App.js';
import './index.css';

var enemyIndex = Common.getURLParameter('enemy') || "NightChick_N";
var enemyLVL = Common.getURLParameter('lvl') || 1;

ReactDOM.render(<App enemyIndex = {enemyIndex} enemyLVL = {enemyLVL} />, document.getElementById('root'));
