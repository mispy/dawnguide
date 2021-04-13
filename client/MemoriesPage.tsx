import * as React from 'react'
import { Observer } from 'mobx-react-lite'
import { AppLayout } from './AppLayout'
import { MemoriesCollection } from '../common/MemoriesCollection'

export function MemoriesPage() {
    return <Observer>{() => {
        return <AppLayout title="Memories">
            <main className="MemoryPage">
                <MemoriesCollection />
            </main>
        </AppLayout>
    }}</Observer>
}