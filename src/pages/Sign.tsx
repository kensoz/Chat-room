import { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate, NavigateFunction } from 'react-router-dom'
import { auth } from '../firebase/index'
import { db } from '../firebase/index'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, addDoc } from 'firebase/firestore'
import Avatar from '../components/avatar'
import AppError from '../components/appError'
import { useSetRecoilState } from 'recoil'
import { recoilUID } from '../script/recoil'
import {
  base64Prototype,
  EMAIL_ERROR,
  PASSWORD_LENGTH_ERROR,
  PASSWORD_TYPE_ERROR,
  USER_ERROR,
  LOGIN_ERROR,
} from '../script/constant'

// ----- SignUp Page -----
const Sign = () => {
  // ナビゲーションを取得
  const navigate: NavigateFunction = useNavigate()
  // ステートを設定
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [avatar, setAvatar] = useState<string>('')
  const setUid = useSetRecoilState(recoilUID)

  // メールアドレスの変更を処理
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
    setError('')
  }

  // パスワードの変更を処理
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value)
    setError('')
  }

  // ユーザー名の変更を処理
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value)
    setError('')
  }

  // 確認用パスワードの変更を処理
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(e.target.value)
    setError('')
  }

  // アバター処理
  const handleAvatarFromChild = (a: string): void => {
    setAvatar(a)
    setError('')
  }

  // フォームの送信を処理
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    // メールアドレスを検証
    const emailRegex: RegExp = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      setError(EMAIL_ERROR)
      return
    }

    // パスワードを検証
    if (password.length < 6) {
      setError(PASSWORD_LENGTH_ERROR)
      return
    }

    // パスワードの一致を確認
    if (password !== confirmPassword) {
      setError(PASSWORD_TYPE_ERROR)
      return
    }

    // ユーザー名を確認
    if (!username) {
      setError(USER_ERROR)
      return
    }

    // ユーザー登録
    try {
      const userCollectionRef = collection(db, 'user')
      const { user } = await createUserWithEmailAndPassword(auth, email, password)

      if (user) {
        setUid(user.uid)

        await addDoc(userCollectionRef, {
          uid: user.uid,
          name: username,
          img: avatar === '' ? base64Prototype : avatar,
          email: user.email,
        })

        navigate('/')
      }
    } catch (error: unknown) {
      setError(LOGIN_ERROR)
    }
  }

  // ログインボタンがクリックされたときの処理
  const handleLoginClick = (): void => {
    navigate('/Login')
  }

  // ----- HTML -----
  return (
    <section className='chat-box mx-2 flex w-full flex-col items-center justify-center md:w-1/2 lg:w-1/3'>
      <form className='w-full' onSubmit={handleSubmit}>
        {/* タイトル */}
        <div className='my-5 border-b border-gray-200 pb-4 text-center text-2xl font-bold'>Chat-Room 新規登録</div>

        {/* メールアドレスの入力欄 */}
        <div className='mx-4 mb-4'>
          <label htmlFor='email' className='m-2 font-bold'>
            メールアドレス <span className='text-sm text-red-400'>*</span>
          </label>
          <input type='email' id='email' value={email} onChange={handleEmailChange} required className='input' />
        </div>

        {/* パスワードの入力欄 */}
        <div className='mx-4 mb-4'>
          <label htmlFor='password' className='m-2 font-bold'>
            パスワード（6文字以上） <span className='text-sm text-red-400'>*</span>
          </label>
          <input
            type='password'
            id='password'
            value={password}
            maxLength={10}
            onChange={handlePasswordChange}
            required
            className='input'
          />
        </div>

        {/* パスワードの確認欄 */}
        <div className='mx-4 mb-4'>
          <label htmlFor='confirm-password' className='m-2 font-bold'>
            パスワード確認 <span className='text-sm text-red-400'>*</span>
          </label>
          <input
            type='password'
            id='confirm-password'
            value={confirmPassword}
            maxLength={10}
            onChange={handleConfirmPasswordChange}
            required
            className='input'
          />
        </div>

        {/* ユーザー名の入力欄 */}
        <div className='mx-4 mb-4'>
          <label htmlFor='username' className='m-2 font-bold'>
            ユーザー名 <span className='text-sm text-red-400'>*</span>
          </label>
          <input
            type='text'
            id='username'
            value={username}
            maxLength={20}
            onChange={handleUsernameChange}
            required
            className='input'
          />
        </div>

        {/* アバターの入力欄 */}
        <Avatar onAvatarChange={handleAvatarFromChild} />

        {/* エラーメッセージを表示 */}
        {error && <AppError error={error} />}

        {/* ボタン */}
        <div className='flex flex-row justify-between border-t border-gray-200 p-4'>
          {/* 新規登録ボタン */}
          <button type='submit' className='text-btn chat-box w-full'>
            登録
          </button>

          {/* ログインボタン */}
          <button type='button' onClick={handleLoginClick} className='text-btn chat-box ml-3 w-full'>
            ログインに戻る
          </button>
        </div>
      </form>
    </section>
  )
}

export default Sign
