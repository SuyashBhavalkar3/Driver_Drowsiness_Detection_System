import './Button.css'

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${disabled || isLoading ? 'disabled' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="spinner"></span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
