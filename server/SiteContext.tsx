import * as React from 'react'
import type { AuthedState } from "../client/AuthedState"

/** 
 * SiteContext provides a common interface to very different rendering contexts.
 * Server-side: everything is undefined
 * Client-side without user: srs is provided by localstorage implementation
 * Client-side with user: full definitions, srs progress backed by api
 */
export const SiteContext: React.Context<{ authed?: AuthedState }> = React.createContext({})