type ChildComponentProps = {
  error: string
}

// ----- AppError Components -----
const AppError = ({ error }: ChildComponentProps) => {
  // ----- HTML -----
  return <div className='m-4 text-sm text-red-400'>{error}</div>
}

export default AppError
