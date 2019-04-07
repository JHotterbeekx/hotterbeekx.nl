import React from 'react'
import { Link } from 'gatsby'
import Logo from '../images/logo.png';

const Header = ({ siteTitle, subTitle }) => (
  <div
    style={{
      background: '#000000',
      marginBottom: '1.45rem',
      position: 'sticky',
      top: 0,
      zIndex: 9999,
      borderBottom: '1px solid white',
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: 1100,
        padding: '0.25rem 0rem',
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
          <img src={Logo} alt="logo" style={{ width: '30px', float: 'left', marginRight: '5px' }} />
          <span style={{ fontSize: '1.8em' }}>{siteTitle}</span>
          <span style={{ fontSize: '0.8em', paddingLeft: '10px' }}>{subTitle}</span>
        </Link>
        
      </div>
    </div>
  </div>
)

export default Header
