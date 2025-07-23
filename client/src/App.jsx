import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Handles OAuth token after redirect
function OAuthSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
    }
  }, [location, navigate]);

  return <p>Logging you in...</p>;
}

// Journal form after login
function JournalForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [message, setMessage] = useState('');

  const moods = [
    'Happy', 'Sad', 'Angry', 'Tired', 'Grateful',
    'Excited', 'Peaceful', 'Overwhelmed', 'Focused', 'Anxious'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !mood) {
      setMessage('All fields required');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/api/journals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, mood }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Journal submitted successfully!');
        setTitle('');
        setContent('');
        setMood('');
      } else {
        setMessage(data.message || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Title"
        className="w-full border p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Write your thoughts..."
        className="w-full border p-2 rounded"
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex flex-wrap gap-2 justify-center">
        {moods.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMood(m)}
            className={`px-3 py-1 rounded-full border ${
              mood === m ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'
            } hover:bg-indigo-100`}
          >
            {m}
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Submit Journal
      </button>
      {message && <p className="text-sm text-center mt-2">{message}</p>}
    </form>
  );
}

// Main Home view
function Home() {
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen p-12 bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-indigo-600">Hello Journiva 🌙</h1>

      {token ? (
        <>
          <p className="mt-4 text-green-600 text-xl">✅ You’re logged in!</p>
          <JournalForm />
        </>
      ) : (
        <a href="http://localhost:5000/auth/google">
          <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Login with Google
          </button>
        </a>
      )}
    </div>
  );
}

// Main App with Routes
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
    </Routes>
  );
}

export default App;
