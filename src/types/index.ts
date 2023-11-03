// * ------------------------------
// *
// * Type
// *
// * ------------------------------

export interface IText {
  text: string
  timestamp: string
}

export interface IUser {
  uid: string
  name: string
  img: string
}

export type IMessage = IText & IUser

export type ChildComponentProps = {
  onAvatarChange: (a: string) => void
}
