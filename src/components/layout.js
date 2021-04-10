import * as React from "react"
import { Link } from "gatsby"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { useStaticQuery, graphql } from "gatsby"
import ThemeToggle from './theme-toggle'
const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  const data = useStaticQuery(graphql`
    query BioQuery2 {
      site {
        siteMetadata {
          author {
            name
          }
          social {
            github
            linkedin
            email
          }
        }
      }
    }
  `)

  let header
  let toggleSize;

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }
  const socials = data.site.siteMetadata.social
  const ghLink = `https://github.com/${socials.github}`
  const linkedinLink = `https://www.linkedin.com/in/${socials.linkedin}`
  const mailLink = `mailto:${socials.email}`

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">
        {header}
        <ThemeToggle/>
      </header>
      <main>{children}</main>
      <footer>
        <div>
          © {new Date().getFullYear()} Tomasz Węgrzyn <br></br>
        </div>
        <div>
          <a href={mailLink}>
            <FontAwesomeIcon icon={faEnvelope} size="2x" />
          </a>
          <a href={ghLink}>
            <FontAwesomeIcon icon={faGithub} size="2x" />
          </a>
          <a href={linkedinLink}>
            <FontAwesomeIcon icon={faLinkedin} size="2x" />
          </a>
        </div>
      </footer>
    </div>
  )
}

export default Layout
