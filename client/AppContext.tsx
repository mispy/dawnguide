import { ClientApi } from "./ClientApi"
import * as React from 'react'
import { AppStore } from "./AppStore"
import { Sunpedia } from "../shared/sunpedia"
import { User } from "../shared/types"

export const AppContext: React.Context<{ app: AppStore, api: ClientApi, sunpedia: Sunpedia, user: User }> = React.createContext({}) as any