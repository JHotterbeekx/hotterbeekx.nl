import React from 'react'

const Sidebar = ({ siteTitle }) => (
  <div className="sidebar">
      <div className="item">
        <h2 className="title">About me</h2>
        <div><img style={{ width: "100%", objectFit: "cover", height: "auto", display: "block", maxHeight: "200px" }} alt="about me" height="234" id="Image1_img" src="https://spectrum.ieee.org/image/Mjc1NzQ0NQ.jpeg" width="350" /></div>
        <div style={{ height: "46px" }}>
          <center>
            <img className="profile-image" alt="profile_background" src="https://res.cloudinary.com/practicaldev/image/fetch/s--PL5vEYgU--/c_fill,f_auto,fl_progressive,h_320,q_auto,w_320/https://thepracticaldev.s3.amazonaws.com/uploads/user/profile_image/60370/909a6325-f0d1-4371-9b0f-9cc8650c7249.jpg" />
          </center>
        </div>
        <div className="profile-description">
          <h2 className="title">John Hotterbeekx</h2>
          Building software as a full-stack developer for more then 15 years, with a big interest in why and how we do things when building actual software.
        </div>
        <div className="profile-social" style={{ textAlign: "center" }}>
          <a href="https://dev.to/jhotterbeekx" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-dev" title="DEV.to Profile"></i>
          </a>
          <a href="https://www.linkedin.com/in/johnhotterbeekx/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin" title="LinkedIn Profile"></i>
          </a>
          <a href="https://github.com/JHotterbeekx" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github" title="GitHub Profile"></i>
          </a>
          <a href="https://www.facebook.com/j.hotterbeekx" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook" title="Facebook Profile"></i>
          </a>

          
        </div>
      </div>
  </div>
)

export default Sidebar
