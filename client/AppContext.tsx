import type { ClientApi } from "./ClientApi"
import * as React from 'react'
import type { AppStore } from "./AppStore"
import type { User } from "../common/types"
import type { CanvasEffects } from "./CanvasEffects"

export const AppContext: React.Context<{ app: AppStore, api: ClientApi, user: User, effects: CanvasEffects }> = React.createContext({}) as any