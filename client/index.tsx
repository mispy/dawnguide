import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { observer } from 'mobx-react'
import * as _ from 'lodash'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom"

import './index.scss'
import { Navbar, Nav, Container } from 'react-bootstrap'

@observer
class AppLayout extends React.Component {
    render() {
        return <>
            <header className="AppHeader">
                <Navbar>
                    <Container>
                        <Navbar.Brand href="#home">Sunpeep</Navbar.Brand>
                        <Nav className="learnButtons">
                            <ul className="navigation-shortcuts">
                                <li className="navigation-shortcut navigation-shortcut--lessons">
                                    <Link to="/lesson">
                                        <span>49</span> Lessons
                                    </Link>
                                </li>
                                <li className="navigation-shortcut navigation-shortcut--reviews">
                                    <Link to="/review">
                                        <span>194</span> Reviews
                                    </Link>
                                </li>
                            </ul>
                        </Nav>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav>
                                <Nav.Link href="/logout">Logout</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
            <main className="container">
                {this.props.children}
            </main>
        </>
    }
}

@observer
class Home extends React.Component {
    render() {
        return <AppLayout>
            <div style={{ marginTop: "8rem", textAlign: "center" }}>
                Homepage! Nothing much here yet 😝
            </div>
        </AppLayout>
    }
}

@observer
class App extends React.Component {
    render() {
        return <Router>
            <Switch>
                <Route path="/home">
                    <Home />
                </Route>
            </Switch>
        </Router>
    }
}

ReactDOM.render(<App />, document.getElementById("root"))