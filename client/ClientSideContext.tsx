import * as React from 'react'
import type { AuthedState } from "../client/AuthedState"

export const ClientSideContext: React.Context<{ authed?: AuthedState }> = React.createContext({})