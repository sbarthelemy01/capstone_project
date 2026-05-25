import { useState } from 'react';
import Map from './Map';
import Dropdown from './Dropdown';
import Footer from './Footer';

import './App.css';

function App() {

  //using state to track currently selected issue
  const [activeIssue, setActiveIssue] = useState('Climate Change');

  return (
    <>
      <Dropdown activeIssue={activeIssue} setActiveIssue={setActiveIssue} />
      <Map activeIssue={activeIssue} />
      <Footer />
    </>
  )
}

export default App