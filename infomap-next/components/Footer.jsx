'use client';

import React from 'react';
import { Tooltip } from 'react-tooltip';
import Image from 'next/image';

import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        <p className="footer-text">
            This project consolidates global issue data for various countries onto 
            a single page, eliminating the need to search multiple sites. <br/>
            <b>Made by Samantha Barthelemy</b>
        </p>

        <div className="footer-icons">
            <a href="mailto:samanthabarthelemy12@gmail.com" target="_blank" rel="noreferrer">
                <Image
                    src="/images/mail.svg"
                    alt="Email Contact"
                    width={26}
                    height={26}
                    data-tooltip-id="info-tooltip"
                    data-tooltip-content="Contact"
                    data-tooltip-place="bottom"
                    className="footer-icon-img"
                />
            </a>
            
            <a href="https://github.com/sbarthelemy01/capstone_project" target="_blank" rel="noreferrer">
                <Image
                    src="/images/github.svg"
                    alt="GitHub Repository"
                    width={26}
                    height={26}
                    data-tooltip-id="info-tooltip" 
                    data-tooltip-content="GitHub"
                    className="footer-icon-img"
                />
            </a>
        </div>

        <Tooltip id="info-tooltip" />
        
      </div>
    </footer>
  );
};

export default Footer;