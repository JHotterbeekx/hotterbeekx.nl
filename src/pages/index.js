import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'

const IndexPage = (props) => {
  const postList = props.data.allMarkdownRemark;
  return (
    <Layout>
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
      
      <div className="clear"></div>
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