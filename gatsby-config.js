module.exports = {
  siteMetadata: {
    title: 'Hotterbeekx.nl',
    subTitle: 'Writings about software development',
    siteUrl: 'https://www.hotterbeekx.nl'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Hotterbeekx.nl',
        short_name: 'hotterbeekx.nl',
        start_url: '/',
        background_color: '#000000',
        theme_color: '#000000',
        display: 'standalone',
        icon: 'src/images/icon.png', // This path is relative to the root of the site.
      },
    },
    
    'gatsby-plugin-draft',
    'gatsby-plugin-sitemap',
    'gatsby-transformer-remark',
    'gatsby-plugin-offline',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-image',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages",
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 778,
            },
          },
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank",
            }
          },
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: "UA-21543155-1",
        head: true,
      },
    },
  ],
}
