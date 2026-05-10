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


/*
Add a footer to indicate who worked on project, what it’s about, 
have icons (ex: Made by Samantha Barthelemy, link to GitHub)


fix react tooltip so the pop up follows the mouse until the pointer leaves the country selected
*/


/* 
Climate Change: main factor is greenhouse gas emissions (include measurement)

* surface temperature changes
* severe weather patterns
* human health impacts
* environmental impacts
* climate policies


*/