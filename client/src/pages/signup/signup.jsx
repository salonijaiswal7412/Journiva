import React, { useState, useMemo, useCallback } from 'react'
import styles from './signup.module.css'
import SplashCursor from '../../components/Cursors/Splash'
import LiquidChrome from '../../components/LiquidChrome/LiquidChrome'
import BlurText from '../../components/Texts/BlurText'

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
    // Clear error when user starts typing
    if (error) setError('')
  }

  const redirectToDashboard = () => {
    // Redirect to user dashboard
    window.location.href = '/dashboard'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic validation
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

      console.log('Making request to:', `http://localhost:5000/api/users${endpoint}`)
      console.log('Request body:', body)

      const response = await fetch(`http://localhost:5000/api/users${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text()
        console.log('Non-JSON response:', textResponse)
        setError('Server returned non-JSON response. Check console for details.')
        setLoading(false)
        return
      }

      const data = await response.json()
      console.log('Response data:', data)

      if (response.ok) {
        // Store token in memory instead of localStorage for artifact compatibility
        console.log('Success:', data)

        // Reset form
        setFormData({
          username: '',
          email: '',
          password: ''
        })

        // Redirect to dashboard
        redirectToDashboard()
      } else {
        setError(data.error || data.message || 'Something went wrong')
      }
    } catch (err) {
      console.error('Full error object:', err)
      setError(`Network error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    // Google OAuth handles both login and signup automatically
    // If user exists: logs them in
    // If user doesn't exist: creates new account and logs them in
    window.location.href = 'http://localhost:5000/auth/google?redirect=/dashboard'
  }

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <LiquidChrome
          baseColor={[0.4, 0.3, 0.8]}
          speed={0.2}
          amplitude={0.4}
          interactive={false}
        />
      </div>
      
      <div className={styles.right}>
        <BlurText
          text={isLogin ? "Welcome Back!" : "Ready to Begin Your Story?"}
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className={styles.h1}
        />
        
        <h2 className='w-[70%]'>
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

          <div 
            className={styles.google}
            onClick={handleGoogleAuth}
            style={{ 
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1 
            }}
          >
            Continue with Google
          </div>
          
          <p className='text-gray-400 my-1'>OR</p>
          
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