import React, { useEffect, useState } from 'react';
import './App.css';
import { Uploader } from "./components/uploader";
import { TOOLS } from "./consts/app";
import { Visualizer } from "./components/visualizer";
import { getConfigs } from "./utils/requestHandlers"


function App() {

  const [loaded, setLoaded] = useState();
  const [configs, setConfigs] = useState({});
  const [selectedTool, setTool] =  useState('');
  const [graphData, setData] =  useState('digraph{}');


  useEffect(function(){
    getConfigs(setConfigs)
  }, [loaded])


  return (
    <div className="App">
      <Uploader graphData={graphData} setData={setData} configs={configs}></Uploader>
      <Visualizer graphData={graphData} setData={setData}></Visualizer>
    </div>
  );
}

export default App;
