import React, { useState } from 'react'

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
        // Store token in localStorage
        localStorage.setItem('token', data.token)
        
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
    // Redirect to Google OAuth with return URL to dashboard
    window.location.href = 'http://localhost:5000/auth/google?redirect=/dashboard'
  }

  return (
    <div className='bg-[#243b4a] w-screen h-screen flex justify-center items-center'>
      <div className="box rounded-4xl bg-white w-[70%] h-[90%] p-4">
        <div className="logo h-4 text-xl font-bold text-[#243b4a]">Journiva</div>
        
        <div className='content mt-8'>
          <h1 className='text-center text-2xl font-bold capitalize text-[#4e4d5c]'>
            {isLogin ? 'Welcome back to your journey' : 'Start your journey to emotional clarity'}
          </h1>
          <h2 className='text-center w-[50%] text-gray-500 mx-auto mt-2 text-xs'>
            {isLogin 
              ? 'Sign in to continue your journaling and reflection practice'
              : 'Create your free Journiva account to journal, reflect, and receive mindful daily prompts. Your thoughts, your space — always private.'
            }
          </h2>

          <div className="form-container w-[50%] mx-auto mt-4">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-1 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243b4a] text-xs"
                  placeholder="Enter your username"
                  disabled={loading}
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243b4a] text-xs"
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243b4a]"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#243b4a] text-white py-1 rounded-lg font-medium hover:bg-[#1e2f3a] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </div>

            <div className="mt-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <button 
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full mt-2 bg-white border border-gray-300 text-gray-700 py-1 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign {isLogin ? 'in' : 'up'} with Google
              </button>
            </div>

            <div className="mt-2 text-center">
              <span className="text-gray-600 text-xs">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                disabled={loading}
                className="text-[#243b4a] font-medium text-sm hover:underline disabled:opacity-50"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup