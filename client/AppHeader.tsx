import React = require("react")
import { useContext } from "react"
import { Navbar, Container, Nav } from "react-bootstrap"
import { Link } from "react-router-dom"
import { AppContext } from "./AppContext"

export function AppHeader() {
  const { store } = useContext(AppContext)
  return <header className="AppHeader">
    <Navbar>
      <Container>
        <div>
          <Navbar.Brand href="/home">Sunpeep</Navbar.Brand>
          <span className="environment">alpha</span>
        </div>
        <Nav className="learnButtons">
          <ul className="navigation-shortcuts">
            <li className="navigation-shortcut navigation-shortcut--lessons">
              <Link to="/lesson">
                <span className={store.numLessons === 0 ? 'inactive' : undefined}>{store.numLessons}</span> Lessons
                                    </Link>
            </li>
            <li className="navigation-shortcut navigation-shortcut--reviews">
              <Link to="/review">
                <span className={store.numReviews === 0 ? 'inactive' : undefined}>{store.numReviews}</span> Reviews
                                </Link>
            </li>
          </ul>
        </Nav>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* <Nav onClick={() => setShowAbout(true)}>
                            <Nav.Link>About</Nav.Link>
                        </Nav> */}
          <Nav>
            <Nav.Link href="/logout">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </header>
}
