import { create } from 'zustand'

interface State{
    ready: boolean;
    isReady: ()=> void
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useStore = create<State>((set) => ({
    ready: false,
    isReady: ()=> set({ready: true})
}))
