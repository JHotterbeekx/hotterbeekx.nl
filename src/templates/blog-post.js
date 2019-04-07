import React from 'react';
import Layout from '../components/layout';
import Img from 'gatsby-image';
import Metatags from '../components/metatags';
import { graphql } from 'gatsby'

function BlogPost(props) {

    const post = props.data.markdownRemark;
    const url = props.data.site.siteMetadata.siteUrl
    const { title, description } = post.frontmatter;
    const thumbnail = post.frontmatter.image.childImageSharp.resize.src
    return (
        <Layout>
            <Metatags
                title={title}
                description={description}
                thumbnail={url + thumbnail}
                url={url}
                pathname={props.location.pathname}
            />
            <div className="post-full">
                    <Img className="post-image" fluid={post.frontmatter.image.childImageSharp.fluid} />
                <div className="post-content">
                    <h1 className="post-title">{title}</h1>
                    <div className="post-body" dangerouslySetInnerHTML={{ __html: post.html }} />
                </div>
            </div>
        </Layout>
    )
}


export default BlogPost


export const query = graphql`

 query PostQuery($slug: String!) {
     markdownRemark(fields: { slug: { eq: $slug } }) {
        html
        frontmatter {
            title
            description
            image {
            childImageSharp {
                resize(width: 1500, height: 1500) {
                src
                }
                fluid(maxWidth: 786) {
                ...GatsbyImageSharpFluid
                }
            }
        }
       }
   }
  site {
    siteMetadata {
        siteUrl
      }
   }
}
`