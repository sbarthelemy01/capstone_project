'use client'; 

import React, { useState } from 'react';
import Dropdown from '@/components/Dropdown'; //@ is a reference to the root directory (infomap-next)
import Map from '@/components/Map';

export default function HomePage() {
  const [activeIssue, setActiveIssue] = useState(null);

  return (
    <div style={{ paddingBottom: "100px" }}> {/* Padding prevents footer overlap */}
        <Dropdown activeIssue={activeIssue} setActiveIssue={setActiveIssue} />
        <Map activeIssue={activeIssue} />
    </div>
  );
}