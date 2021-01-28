import type { ClientApi } from "./ClientApi"
import * as React from 'react'
import type { AppStore } from "./AppStore"
import type { User } from "../common/types"

export const AppContext: React.Context<{ app: AppStore, api: ClientApi, user: User }> = React.createContext({}) as any