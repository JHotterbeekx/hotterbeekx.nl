import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'

const IndexPage = (props) => {
  const postList = props.data.allMarkdownRemark;
  return (
    <Layout>
      <div className="container">
        <div className="posts">
          {postList.edges.map(({ node }, i) => (
            <Link to={node.fields.slug} key={node.fields.slug} className="link" >
              <div className="post-list-item">
                <div className="post-image" style={{ backgroundImage: `url(${node.frontmatter.image.childImageSharp.resize.src})` }}></div>
                <div className="post-details">
                  <h2 className="post-title">{node.frontmatter.title}</h2>
                  <div className="post-description">{node.excerpt}</div>
                  <div className="post-meta">{node.frontmatter.date}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="sidebar">
            <div className="item">
              <h2 className="title">About me</h2>
              <div><img style={{ width: "100%", objectFit: "cover", height: "auto", display: "block", maxHeight: "200px" }} alt="about me" height="234" id="Image1_img" src="https://spectrum.ieee.org/image/Mjc1NzQ0NQ.jpeg" width="350" /></div>
              <div style={{ height: "46px" }}>
                <center>
                  <img className="profile-image" src="https://res.cloudinary.com/practicaldev/image/fetch/s--PL5vEYgU--/c_fill,f_auto,fl_progressive,h_320,q_auto,w_320/https://thepracticaldev.s3.amazonaws.com/uploads/user/profile_image/60370/909a6325-f0d1-4371-9b0f-9cc8650c7249.jpg" />
                </center>
              </div>
              <div className="profile-description">
                <h2 className="title">John Hotterbeekx</h2>
                Building software as a full-stack developer for more then 15 years, with a big interest in why and how we do things when building actual software.
              </div>
              <div className="profile-social" style={{ textAlign: "center" }}>
                <a href="https://dev.to/jhotterbeekx" target="_blank">
                  <i className="fab fa-dev" title="DEV.to Profile"></i>
                </a>
                <a href="https://www.linkedin.com/in/johnhotterbeekx/" target="_blank">
                  <i className="fab fa-linkedin" title="LinkedIn Profile"></i>
                </a>
                <a href="https://github.com/JHotterbeekx" target="_blank">
                  <i className="fab fa-github" title="GitHub Profile"></i>
                </a>
                <a href="https://www.facebook.com/j.hotterbeekx" target="_blank">
                  <i className="fab fa-facebook" title="Facebook Profile"></i>
                </a>

                
              </div>
            </div>
        </div>
        <div className="clear"></div>
      </div>
    </Layout>
  )
}

export default IndexPage;

export const listQuery = graphql`
  query ListQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          fields{
            slug
          }
          excerpt(pruneLength: 250)
          frontmatter {
            date(formatString: "MMMM Do YYYY")
            title
            image {
              childImageSharp {
                  resize(width: 780, height: 325) {
                  src
                  }
              }
            }
          }
        }
      }
    }
  }
`