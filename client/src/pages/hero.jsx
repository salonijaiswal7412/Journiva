import React from 'react';
import bg from '../assets/hero_bg.png';
import { Link } from 'react-router-dom'

function Hero() {
    return (
        <div
            className="w-full h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <div className="text-white text-center px-6 max-w-3xl  py-12 rounded-2xl shadow-xl">


                <div className="mb-6">
                    <h3 className="text-4xl font-light tracking-tight">Welcome to</h3>
                    <h1 className="text-6xl md:text-7xl lg:text-9xl font-bold mt-2">Journiva</h1>
                </div>

                <p className="text-lg md:text-xl font-light text-gray-200 leading-relaxed mb-8 px-2 md:px-8">
                    Your digital sanctuary to breathe, reflect, and heal.<br></br>
                    Begin your journey inward with mindful journaling, mood tracking, and emotional clarity.
                </p>

                <Link to="/signup">
                    <button className="bg-white text-black text-lg font-semibold px-8 py-3 rounded-full hover:bg-gray-200 transition duration-300 cursor-pointer">
                        Join Us
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Hero;
