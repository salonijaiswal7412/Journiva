import React from 'react';

function App() {
  const token = localStorage.getItem('token');

  return (
    <div className='w-screen h-screen p-12'>
      <h1 className="text-4xl font-bold text-indigo-600">Hello Journiva 🌙</h1>

      {token ? (
        <p className="mt-4 text-green-600 text-xl">✅ You’re logged in!</p>
      ) : (
        <a href="http://localhost:5000/auth/google">
          <button className="btn-google">Login with Google</button>
        </a>
      )}
    </div>
  );
}

export default App;
