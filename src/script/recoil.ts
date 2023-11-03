// * ------------------------------
// *
// * Recoil
// *
// * ------------------------------
import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({
  key: 'recoil-persist',
  storage: localStorage,
})

export const recoilUID = atom<string>({
  key: 'UID',
  default: '',
  effects_UNSTABLE: [persistAtom],
})
