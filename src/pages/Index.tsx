import { useState, useEffect, ChangeEvent, FormEvent, useRef, Fragment } from 'react'
import { useNavigate, Navigate, NavigateFunction } from 'react-router-dom'
import { auth } from '../firebase'
import { db } from '../firebase/index'
import { signOut } from 'firebase/auth'
import { collection, addDoc, getDocs, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { Tab } from '@headlessui/react'
import { useRecoilState } from 'recoil'
import { recoilUID } from '../script/recoil'
import { textPrototype, userPrototype, MESSAGE_ERROR, GITHUB } from '../script/constant'
import AppError from '../components/appError'
import WordWrapper from '../components/wordWrapper'
import type { IMessage, IText, IUser } from '../types'

// ----- Index Page -----
const Index = () => {
  // ナビゲーションを取得
  const navigate: NavigateFunction = useNavigate()
  // ステートを設定
  const [text, setText] = useState<IText>(textPrototype)
  const [user, setUser] = useState<IUser>(userPrototype)
  const [message, setMessage] = useState<IMessage[]>([])
  const [error, setError] = useState<string>('')
  const [uid, setUid] = useRecoilState(recoilUID)

  // ログアウト処理
  const handleLogout = (): void => {
    signOut(auth)
    setUid('')
    navigate('/Login')
  }

  // メッセージの変更を処理
  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setText({ text: e.target.value, timestamp: Date.now().toString() })
  }

  // メッセージの送信を処理
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    // 新しいメッセージオブジェクトを作成
    const newMessage: IMessage = {
      uid: user.uid,
      name: user.name,
      img: user.img,
      text: text.text,
      timestamp: text.timestamp,
    }

    const messagesCollectionRef = collection(db, 'message')

    try {
      await addDoc(messagesCollectionRef, newMessage)
      setText(textPrototype)
    } catch (error: unknown) {
      setError(MESSAGE_ERROR)
    }
  }

  // メッセージの監視
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const watchMessage = async (): Promise<void> => {
    const messageCollectionRef = collection(db, 'message')
    await onSnapshot(query(messageCollectionRef, orderBy('timestamp')), (querySnapshot) => {
      const newMessages: IMessage[] = querySnapshot.docs.map((doc) => {
        return doc.data() as IMessage
      })

      setMessage(newMessages)

      setTimeout((): void => {
        if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    })
  }

  // ユーザーデータの取得
  const fetchUserData = async (): Promise<void> => {
    const userCollectionRef = collection(db, 'user')
    const userQuery = query(userCollectionRef, where('uid', '==', uid))

    const querySnapshot = await getDocs(userQuery)
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as IUser
      setUser(userData)
    })
  }

  useEffect((): void => {
    fetchUserData()
    watchMessage()
  }, [])

  // ----- HTML -----
  if (!uid) {
    return <Navigate to='/Login' />
  } else {
    return (
      <section className='flex h-full w-full flex-col items-center'>
        {/* タイトル */}
        <div className='flex w-full flex-row items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-2 shadow-sm'>
          <div className='text-lg font-bold'>Chat-Room</div>

          <div>
            <a href={GITHUB} target='_blank' className='mr-4 hover:opacity-50' rel='noreferrer'>
              GitHub
            </a>

            <button onClick={handleLogout} className='text-btn chat-box'>
              ログアウト
            </button>
          </div>
        </div>

        {/* チャット */}
        <div className='h-full w-full flex-grow overflow-y-scroll pb-4'>
          <Tab.Group>
            <Tab.List className='border-b border-gray-200 bg-white p-2 pb-0'>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button className={selected ? 'tab-selected' : 'tab-unselected'}>chat-room 1</button>
                )}
              </Tab>

              <Tab as={Fragment}>
                {({ selected }) => (
                  <button className={selected ? 'tab-selected' : 'tab-unselected'}>chat-room 2</button>
                )}
              </Tab>
            </Tab.List>

            <Tab.Panels className='px-6 pb-4'>
              <Tab.Panel>
                {message.map((message, index) => (
                  <div key={`ChatMessage_${index}`} className='mb-2 mt-5 flex flex-row'>
                    <div>
                      <img
                        src={message.img}
                        alt='avatar'
                        className='h-1- w-10 rounded-full border border-gray-200 shadow-sm'
                      />
                    </div>

                    <div className='ml-3 flex flex-col'>
                      <div>{message.name}</div>
                      <WordWrapper text={message.text} maxCharsPerLine={20} />
                    </div>
                  </div>
                ))}

                {/* エラーメッセージを表示 */}
                {error && <AppError error={error} />}

                <div ref={messagesEndRef}></div>
              </Tab.Panel>

              <Tab.Panel>
                <div className='mt-5'>Coming Soon !</div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* ツールバー */}
        <div className='flex w-full flex-row items-center border-t border-gray-200 bg-gray-100 px-4 py-2 shadow-sm'>
          {/* メッセージ送信フォーム */}
          <form onSubmit={handleSubmit} className='mb-2 flex w-full flex-row'>
            <input
              type='text'
              value={text.text}
              maxLength={100}
              onChange={handleMessageChange}
              className='input'
              placeholder='chat-room 1 入力'
            />
            <button type='submit' className='text-btn chat-box ml-3 min-w-fit bg-gray-300 px-10'>
              送信
            </button>
          </form>
        </div>
      </section>
    )
  }
}

export default Index
