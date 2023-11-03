# 🗨 chat-room

![github](https://github.com/kensoz/chat-room/actions/workflows/main.yml/badge.svg)  ![Node](https://img.shields.io/badge/Node.js-v19.4.0-fb7185.svg?logo=&style=flat-square) ![License](https://img.shields.io/badge/License-MIT-0284C7.svg?logo=&style=flat-square)

[LINK](https://kensoz.github.io/chat-room)



## 機能

+ 画像とユーザーネームを用いて会員登録ができる
+ リアルタイムの会話を複数人で行える



## 技術スタック

- ⚡️ **React.js + TypeScript + Vite**：指定されたフレームワーク使用
- 🎨 **TailwindCSS**：レスポンシブ対応
- 📑 **ESLint + Prettier + Husky**：コードチェックと整形
- 🔩 **GitHub Actions + GitHub-Pages**：CD/CIと自動デプロイ
- 💽 **Firebase**：データとユーザー認証



## 質問事項

#### 1.自分の強みが発揮されているコードはどこですか？またそれはなぜですか？

+ 要件機能全部実装

+ デザインから、フルスタック開発、デプロイまでの能力：開発、[CD/CI環境](CD/CI環境)を整える

+ 複雑なユーザー画像処理対応：[画像のトリミング](https://github.com/kensoz/chat-room/blob/main/src/script/crop.ts)

+ UI/UXを意識した開発：TailwindCSSによるスタイル追加、レスポンシブ対応

+ コンポーネントによる開発、汎用コンポーネント抽出：[画像アップロードコンポーネント](https://github.com/kensoz/chat-room/blob/main/src/components/avatar.tsx)など

+ TypeScript、整形と静的チェックツールを使ってコード品質確保：[ESLint](https://github.com/kensoz/chat-room/blob/main/.eslintrc.json)、[Prettier](https://github.com/kensoz/chat-room/blob/main/.prettierrc.json)、[Husky](https://github.com/kensoz/chat-room/blob/main/.husky/pre-commit)、[コマンドライン](https://github.com/kensoz/chat-room/blob/main/package.json)

  ```
      "js:check": "eslint",
      "js:fix": "eslint --fix",
      "format:check": "prettier --check .",
      "format:fix": "prettier --write .",
      "fix:all": "run-s js:fix format:fix",
      "check:all": "run-s js:check format:check",
      "prepare": "husky install"
  ```

+ フォーム認証：基本的なフォーム認証を整える

  ```typescript
     //...
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
      //...
  ```



#### 2.どのような拡張性を想定し、何をもって備えていますか？

+ 1.メール認証
  + 確認しやすいため、実際のメール認証はしていませんが、Firebaseによるメール認証機能実装は可能です
+ 2.Chat-room増設
  + `Tab`によるChat機能を開発、Chat-roomが増設する時`Tab`による対応します
+ 3.エラー処理
  + 現在サイト全体的には`const [error, setError] = useState<string>('')`によるエラーを一時的に記録・表示していますが、将来的にRecoilなどによる管理をして、Sentryなど外部サービスを導入してエラー処理を対応します
  + [エラーメッセージ抽出](https://github.com/kensoz/chat-room/blob/main/src/script/constant.ts)による対応追加しやすいようにしています
+ 4.Recoil
  + サイト全体的な状態を管理する時に使えます、例えば、エラーとユーザー情報など
+ 5.肥大化防止
  + [汎用コンポーネント](https://github.com/kensoz/chat-room/blob/main/src/components/appError.tsx)と[定数](https://github.com/kensoz/chat-room/blob/main/src/script/constant.ts)抽出
+ 6.マイページ
  + FireStoreにでユーザー基本情報を保存しているuser collectionを作成しましたので、ユーザー基本情報のCRUDが可能
+ 7.[長いテキスト対応](https://github.com/kensoz/chat-room/blob/main/src/components/wordWrapper.tsx)



### 3.TODO

- [ ] 自動テスト
- [ ] マイページ作成
- [ ] ダークモードとi18n対応
- [ ] Firebase API抽出
- [ ] さらに汎用コンポーネントと関数を抽出
- [ ] ビジネスロジックとデザインを分離
- [ ] さらにCD/CIを整える（pull-requestなど）
- [ ] ユーザー情報キャッシュ
- [ ] パフォーマンス最適化とセキュリティ対策



## 利用

ダウンロード

```bash
git clone https://github.com/kensoz/chat-room.git
```

インストール

```bash
yarn
```

開発

```bash
yarn dev
```

ビルド

```bash
yarn build
```

