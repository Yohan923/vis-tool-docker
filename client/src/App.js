import React, { useEffect, useState } from 'react';
import { Uploader } from "./components/uploader";
import { Navbar, Nav, Container, Row, Col, NavDropdown, Alert } from 'react-bootstrap';
import { Visualizer } from "./components/visualizer";
import { getConfigs } from "./utils/requestHandlers";
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm'
import { USAGE_INFO, GRAPH_INFO} from './consts/app'
import './App.css';


function App() {

  const [loaded, setLoaded] = useState();
  const [configs, setConfigs] = useState({});
  const [selectedTool, setSelectedTool] = useState('');
  const [graphData, setData] =  useState(null);
  const [showHelp, setShowHelp] = useState(false)


  useEffect(function(){
    const onReceiveConfigs = (configs) => {
      setConfigs(configs)
      setSelectedTool(configs['default'])
    }
    getConfigs(onReceiveConfigs)
  }, [loaded])

  const renderToolSelection = (configs) => {

    var tools = []
    for (var e in configs) {
        if (e == 'default') {
          continue
        } else {
          tools.push(e)
        }
    }

    return (
      [
        (<NavDropdown title={selectedTool? selectedTool:'Select a Tool'} id="basic-nav-dropdown">
          {tools? tools.map((tool)=>{
            return <NavDropdown.Item onClick={e => setSelectedTool(tool)}>{tool}</NavDropdown.Item>
          }) : []
          }
        </NavDropdown>
        ),
        (<Nav.Link href={configs[selectedTool] && configs[selectedTool].homepage? configs[selectedTool].homepage : ""} target="_blank">
          Tool Homepage - {configs[selectedTool] && configs[selectedTool].homepage? configs[selectedTool].homepage : ""}
        </Nav.Link>
        )
      ]
    )
  }

  const onClickHelp = () => {
    setShowHelp(true)
  }

  const getTutorial = () => {
    if (selectedTool) console.log(configs[selectedTool].tutorial)
    return selectedTool? configs[selectedTool].tutorial : 'No tool selected'
  }

  return (
    <div >
      <div style={{display: showHelp? "block":"none"}}>
        <Alert variant="success" onClose={() => setShowHelp(false)} dismissible>
          <Alert.Heading>How get a graph</Alert.Heading>
          <p style={{}}>
            {USAGE_INFO}
          </p>
          <hr />
          <Alert.Heading>How to use the graph</Alert.Heading>
          <p>
            {GRAPH_INFO}
          </p>
          <hr />
          <Alert.Heading>Tool specific info</Alert.Heading>
          <ReactMarkdown linkTarget={"_blank"} remarkPlugins={[gfm]}>{getTutorial()}</ReactMarkdown>
        </Alert>
      </div>
      <div style={{display: showHelp? "none":"block"}}>
        <div>
          <Navbar bg="dark" expand="lg" variant="dark">
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link onClick={onClickHelp}>Help</Nav.Link>
                {renderToolSelection(configs)}
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
        <div className="App">
          <Container fluid>
            <Row>
              <Col>
                {selectedTool? <Uploader selectedTool={selectedTool} graphData={graphData} setData={setData} configs={configs}></Uploader>: ''}
              </Col>
              <Col id={'graphBox'} xs={9}>
                {
                graphData? 
                <Visualizer graphData={graphData} setData={setData}></Visualizer> : 
                <div style={{whiteSpace:'pre-wrap'}}>{"Select an example or input some source code\nClick on Help on left top corner for more information"}</div>
                }
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default App;
