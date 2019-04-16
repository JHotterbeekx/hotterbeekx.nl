import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import Sidebar from './sidebar'
import Header from './header'
import './layout.css'
import './style.css'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title, subTitle
          }
        }
      }
    `}
    render={data => (
      <div style={{ background: '#eee' }}>
        <Helmet
          title={data.site.siteMetadata.title}
          meta={[
            { name: 'description', content: 'Sample' },
            { name: 'keywords', content: 'sample, something' },
          ]}
        >
          <html lang="en" />
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous"></link>
        </Helmet>
        <Header siteTitle={data.site.siteMetadata.title} subTitle={data.site.siteMetadata.subTitle} />
        <div
          style={{
            paddingTop: 0,
            marginLeft: '20px',
            
          }}
        >
          <div className="container">
            <div className="content">
              {children}
            </div>
            <Sidebar />
            <div class="clear"></div>
          </div>
        </div>
      </div>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
