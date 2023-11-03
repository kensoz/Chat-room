import { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate, NavigateFunction, Navigate } from 'react-router-dom'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRecoilState } from 'recoil'
import { recoilUID } from '../script/recoil'
import AppError from '../components/appError'
import { EMAIL_ERROR, PASSWORD_LENGTH_ERROR, PASSWORD_ERROR, GITHUB } from '../script/constant'

// ----- Login Page -----
const Login = () => {
  // ナビゲーションを取得
  const navigate: NavigateFunction = useNavigate()
  // ステートを設定
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [uid, setUid] = useRecoilState(recoilUID)

  // メールアドレスの入力変更を処理
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value)
    setError('')
  }

  // パスワードの入力変更を処理
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value)
    setError('')
  }

  // ログインフォームを送信
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()

    // メールアドレスのバリデーション
    const emailRegex: RegExp = /\S+@\S+\.\S+/
    if (!emailRegex.test(email)) {
      setError(EMAIL_ERROR)
      return
    }

    // パスワードの長さを検証
    if (password.length < 6) {
      setError(PASSWORD_LENGTH_ERROR)
      return
    }

    // メールアドレスとパスワードでログインを試みる
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      setUid(user.uid)
      navigate('/')
    } catch (error: unknown) {
      setError(PASSWORD_ERROR)
    }
  }

  // 新規登録ボタンがクリックされたときの処理
  const handleSignupClick = (): void => {
    navigate('/Sign')
  }

  // ----- HTML -----
  if (uid) {
    return <Navigate to='/' />
  } else {
    return (
      <section className='chat-box mx-2 flex w-full flex-col items-center justify-center md:w-1/2 lg:w-1/4'>
        <form className='w-full' onSubmit={handleSubmit}>
          {/* タイトル */}
          <div className='my-5 border-b border-gray-200 pb-4 text-center text-2xl font-bold'>Chat-Room ログイン</div>

          {/* メールアドレスの入力欄 */}
          <div className='mx-4 mb-4'>
            <label htmlFor='email' className='m-2 font-bold'>
              メールアドレス
            </label>
            <input type='email' id='email' value={email} onChange={handleEmailChange} required className='input' />
          </div>

          {/* パスワードの入力欄 */}
          <div className='mx-4 mb-6'>
            <label htmlFor='password' className='m-2 font-bold'>
              パスワード
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

          {/* エラーメッセージを表示 */}
          {error && <AppError error={error} />}

          {/* ボタン */}
          <div className='flex flex-row justify-between border-t border-gray-200 p-4'>
            {/* ログインボタン */}
            <button type='submit' className='text-btn chat-box w-full'>
              ログイン
            </button>

            {/* 新規登録ボタン */}
            <button type='button' onClick={handleSignupClick} className='text-btn chat-box ml-3 w-full'>
              新規登録
            </button>
          </div>

          {/* インフォメーション */}
          <div className='mx-4 mb-4 text-xs'>
            <a href={GITHUB} target='_blank' className='hover:opacity-50' rel='noreferrer'>
              GitHub
            </a>
            にアクセス
          </div>
        </form>
      </section>
    )
  }
}

export default Login
