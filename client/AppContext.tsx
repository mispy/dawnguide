import { ClientApi } from "./ClientApi"
import * as React from 'react'
import { AppStore } from "./AppStore"
import { User } from "../common/types"
import { CanvasEffects } from "./CanvasEffects"

export const AppContext: React.Context<{ app: AppStore, api: ClientApi, user: User, effects: CanvasEffects }> = React.createContext({}) as any