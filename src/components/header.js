import React from 'react'
import { Link } from 'gatsby'
import Logo from '../images/logo.png';

const Header = ({ siteTitle, subTitle }) => (
  <div style={{
    background: '#000000',
    marginBottom: '20px',
    position: 'sticky',
    top: 0,
    zIndex: 9999,
    borderBottom: '1px solid white',
  }}>
  
    <div
      
    >
      <div
        style={{
          margin: '0 auto',
          maxWidth: 1060,
          padding: '0.25rem 0rem 0rem',
          textAlign: 'left',
        }}
      >
        <div style={{ fontWeight: 'bold', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif' }}>
          <Link
            to="/"
            style={{
              color: 'white',
              textDecoration: 'none',
              verticalAlign: 'middle'
            }}
          >
            <img className="logo" src={Logo} alt="logo" style={{  }} />
            <span className="title">{siteTitle}</span>
            <span className="sub-title">{subTitle}</span>
          </Link>
          
        </div>
      </div>
    </div>
    <div
    >
      <div
        style={{
          margin: '0 auto',
          maxWidth: 1060,
          textAlign: 'left',
        }}
      >
        <div className="header-menu">
          <Link to="/" className="header-menu-link">Blog</Link>&nbsp;|&nbsp; 
          <Link to="/projects" className="header-menu-link">Projects</Link>
        </div>
      </div>
    </div>
  </div>
)

export default Header
