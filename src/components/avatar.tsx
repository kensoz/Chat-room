import { useState, ChangeEvent, useCallback } from 'react'
import Cropper, { type Point, type Area } from 'react-easy-crop'
import getCroppedImg from '../script/crop'
import type { ChildComponentProps } from '../types'

// ----- Avatar Components -----
const Avatar = ({ onAvatarChange }: ChildComponentProps) => {
  // 画像関係ステートを設定
  const [avatar, setAvatar] = useState<string>('')
  const [uploadedImg, setUploadedImg] = useState<string>('')
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [rotation, setRotation] = useState<number>(0)
  const [zoom, setZoom] = useState<number>(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({ x: 0, y: 0, width: 0, height: 0 })

  // アバターの変更を処理
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files !== null) {
      const file: File = e.target.files[0]
      const fileSize: number = file.size / 1024 / 1024 // ファイルサイズ (MB)
      const allowedFileTypes: string[] = ['image/png', 'image/jpeg'] // ファイルタイプ

      if (fileSize > 2 || !allowedFileTypes.includes(file.type)) {
        alert('2MB 以下の PNG または JPG 画像をアップロードしてください')
      } else {
        const reader: FileReader = new FileReader()

        reader.onload = (f: ProgressEvent<FileReader>): void => {
          if (f.target !== null) {
            const base64 = f.target.result as string
            setUploadedImg(base64)
          }
        }

        reader.readAsDataURL(file)
      }
    }
  }

  // アバターの作成を処理
  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area): void => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const showavatar = useCallback(async (): Promise<void> => {
    const avatar = await getCroppedImg(uploadedImg, croppedAreaPixels, rotation)
    setAvatar(avatar)
    onAvatarChange(avatar)
  }, [croppedAreaPixels, rotation])

  // ----- HTML -----
  return (
    <div className='mx-4 mb-4 flex items-center justify-between'>
      <div className='mr-4 flex flex-col'>
        <label
          htmlFor='avatar'
          className='chat-box focus:shadow-outline flex min-w-max cursor-pointer items-center rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none'
        >
          <span>アバター選択</span>
        </label>

        {uploadedImg && (
          <button type='button' onClick={showavatar} className='chat-box text-btn mt-2'>
            画像確認
          </button>
        )}

        {avatar && (
          <div className='my-5'>
            <div className='mb-2'>アバター：</div>
            <img className='h-20 w-20' src={avatar} alt='avatar' />
          </div>
        )}
      </div>

      {uploadedImg && (
        <div className='z-1 relative h-32 w-52 overflow-hidden'>
          <Cropper
            image={uploadedImg}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            aspect={1 / 1}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
      )}

      <input type='file' id='avatar' accept='image/png, image/jpeg' onChange={handleAvatarChange} className='hidden' />
    </div>
  )
}

export default Avatar
