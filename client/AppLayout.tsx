import React = require('react')
import { useState, useEffect, useContext } from 'react'
import { Navbar, Container, Nav, Modal, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { AppStore } from './AppStore'
import { runInAction } from 'mobx'
import { AppContext } from './AppContext'
import { useObserver } from 'mobx-react-lite'
import { AppHeader } from './AppHeader'

export const AppLayout = (props: { children: any, noHeader?: boolean }) => {
  const noHeader = props.noHeader || false
  const [showAbout, setShowAbout] = useState(false)

  const { store } = useContext(AppContext)

  useEffect(() => {
    store.loadProgress()
  }, [])

  return useObserver(() => <div className="AppLayout">
    {!noHeader ? <AppHeader /> : undefined}
    {props.children}
    <Modal show={showAbout} onHide={() => setShowAbout(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowAbout(false)}>
          Close
                </Button>
        <Button variant="primary" onClick={() => setShowAbout(false)}>
          Save Changes
                </Button>
      </Modal.Footer>
    </Modal>
  </div>)
}