import React from 'react'
import Layout from '../components/layout'

const projects = [
  {
    title: 'Hotterbeekx.nl',
    description: 'My personal website, with my articles and project scribbles.',
    source: 'https://github.com/JHotterbeekx/hotterbeekx.nl',
    demo: 'https://www.hotterbeekx.nl',
  },
 {
   title: 'Word-search-solver',
   description: 'NPM package that allows you to solve word search puzzles.',
   source: 'https://github.com/JHotterbeekx/word-search-solver',
   demo: undefined,
 },
 {
   title: 'Selenium Extensions',
   description: 'NuGet package with extension methods to make testing in Selenium easier.',
   source: 'https://github.com/JHotterbeekx/selenium-extensions',
   demo: undefined,
 },
 {
   title: 'Rating Image',
   description: 'Web component allowing you to render a customized rating image.',
   source: 'https://github.com/JHotterbeekx/rating-image',
   demo: undefined,
 },
 {
   title: 'Catify',
   description: 'Chrome extension that replaces all images by images of cats.',
   source: 'https://github.com/JHotterbeekx/CatifyChromeExtension',
   demo: 'https://chrome.google.com/webstore/detail/catify/ihjgbjdkgnploojjhjepdaigkoigianp',
 },
 {
   title: 'React-dice-roller',
   description: 'NPM package that gives you a react component to roll a customizable dice in your browser.',
   source: 'https://github.com/JHotterbeekx/react-dice',
   demo: 'http://dice.hotterbeekx.nl',
 },
 {
   title: 'Online dice tool',
   description: 'A website that allows you to play your favorite games when you don\'t have any actual dice.',
   source: 'https://github.com/JHotterbeekx/online-dice-tool',
   demo: 'http://dice.hotterbeekx.nl',
 }
]

function GetLinks(project) {
  const result = [];
  if (project.demo) result.push(<a className="card-link-demo" target="_blank" rel="noopener noreferrer" href={project.demo}>Demo</a>);
  if (project.source) result.push(<a className="card-link-source" target="_blank" rel="noopener noreferrer" href={project.source}>Source</a>);
  return result;
}

const ProjectPage = () => {
  return (
    <Layout>
      {projects.map(project => (
        <div className="card">
          <div className="card-title">{project.title}</div>
          <div className="card-description">{project.description}</div>
          <div className="card-links">
            {GetLinks(project)}            
          </div>
        </div>
      ))}
    </Layout>
  )
}

export default ProjectPage;