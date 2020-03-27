
import { AxiosError, AxiosResponse } from 'axios'
import * as _ from 'lodash'
import { Modal, Button } from 'react-bootstrap'
import { action } from 'mobx'
import { useContext } from 'react'
import { AppContext } from './AppContext'
import React = require('react')

export function ErrorModal(props: { error: Error | AxiosError }) {
    const { error } = props
    const { store } = useContext(AppContext)

    const dismiss = action(() => store.unexpectedError = undefined)

    const serverResponse = 'response' in error && error.response ? error.response : null

    let serverResponseHtml = ""
    if (serverResponse) {
        if (_.isString(serverResponse.data))
            serverResponseHtml = `<pre style="white-space: pre-wrap;">${serverResponse.data}</pre>`
        else
            serverResponseHtml = `<pre style="white-space: pre-wrap;">${JSON.stringify(serverResponse.data, null, 2)}</pre>`
    }

    return <Modal className="ErrorModal" size="lg" show={true} onHide={dismiss}>
        <Modal.Header>
            <div>
                {serverResponse
                    ? <>
                        <h5>{serverResponse.data.message ? serverResponse.data.message : 'Server error'}</h5>
                        <pre>{serverResponse.status} {serverResponse.statusText} from {(error as AxiosError).config.url}</pre>
                        <p>Sunpeep encountered an unexpected error. Please screenshot this message and report it to the development team.</p>
                        <iframe srcDoc={serverResponseHtml} />
                    </> : <>
                        <h5>{error.message}</h5>
                        <p>Sunpeep encountered an unexpected error. Please screenshot this message and report it to the development team.</p>
                    </>
                }
            </div>
        </Modal.Header>
        <Modal.Body>
            <pre>{error.stack}</pre>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={dismiss}>Close</Button>
        </Modal.Footer>
    </Modal>
}