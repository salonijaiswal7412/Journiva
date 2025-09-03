import React, { useState } from 'react'
import styles from './signup.module.css'
import LiquidChrome from '../../components/LiquidChrome/LiquidChrome'
import BlurText from '../../components/Texts/BlurText'

// ✅ Left visual wrapped in memo so it won't re-render
const LeftVisual = React.memo(() => {
  return (
    <div className={styles.left}>
      <LiquidChrome
        baseColor={[0.4, 0.3, 0.8]}
        speed={0.2}
        amplitude={0.4}
        interactive={false}
      />
    </div>
  )
})

function Signup() {
  const [isLogin, setIsLogin] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const redirectToDashboard = () => {
    window.location.href = '/dashboard'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.username || !formData.password || (!isLogin && !formData.email)) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    try {
      const endpoint = isLogin ? '/login' : '/signup'
      const body = isLogin 
        ? { username: formData.username, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password }

      const response = await fetch(`http://localhost:5000/api/users${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text()
        console.log('Non-JSON response:', textResponse)
        setError('Server returned non-JSON response. Check console for details.')
        setLoading(false)
        return
      }

      const data = await response.json()

      if (response.ok) {
        console.log('Success:', data)
        setFormData({ username: '', email: '', password: '' })
        redirectToDashboard()
      } else {
        setError(data.error || data.message || 'Something went wrong')
      }
    } catch (err) {
      console.error('Error:', err)
      setError(`Network error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    window.location.href = 'http://localhost:5000/auth/google?redirect=/dashboard'
  }

  return (
    <div className={styles.main}>
      {/* ✅ Left side animation isolated */}
      <LeftVisual />

      {/* ✅ Right side form */}
      <div className={styles.right}>
        <BlurText
          text={isLogin ? "Welcome Back to Journiva!" : "Ready to Begin Your Story?"}
          delay={100}
          animateBy="words"
          direction="top"
          className={styles.h1}
        />
        
        <h2 className='w-[80%] m-auto'>
          {isLogin 
            ? "Sign in to continue your journey of curious reading & dreaming." 
            : "Join our community of curious readers & dreamers. Signing up takes less than a minute (promise!)."
          }
        </h2>

        <div className={styles.box}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Google login button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className={styles.google}
            style={{ 
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1 
            }}
          >
            Continue with Google
          </button>
          
          <p className='text-gray-400 my-1'>OR</p>
          
          {/* Main form */}
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="username"
              placeholder='enter name'
              value={formData.username}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
            
            {!isLogin && (
              <input 
                type="email" 
                name="email"
                placeholder='enter email'
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            )}
            
            <input 
              type="password" 
              name="password"
              placeholder='enter password'
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
            
            <button 
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
              style={{ 
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Join Now')}
            </button>
          </form>
          
          <p className='mt-2 text-sm text-gray-400'>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => setIsLogin(!isLogin)}
              style={{ 
                cursor: loading ? 'not-allowed' : 'pointer',
                color: loading ? '#9ca3af' : '#3b82f6',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? 'Sign up' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
