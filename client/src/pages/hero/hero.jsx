import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';
import heroImage from "../../assets/images/hero-book.png";
import Buttons from "../../components/Buttons/Button1"

import Plasma from '../../components/Plasma/Plasma';

function Hero() {
  return (
    <div className={styles.main}>
     

<Plasma 
    color="#390760"
    speed={2}
    direction="forward"
    scale={2.7}
    opacity={1}
    mouseInteractive={true}
  />

      <div className={styles.container}>
        <div className={styles.left}>
          <h1 className={styles.h1}>Your Journey.</h1>
          <h2 className={styles.h2}>
            Your <span className={styles.h2_2}>Journal</span>
          </h2>

          <p className={styles.content}>
            Journiva is your personal space to capture thoughts, memories, and
            experiences—whether in words, photos, or videos. Reflect, grow, and
            carry your journey forward with every entry.
          </p>
          <Link to="/signup" className='b1'> <Buttons>Start Journaling</Buttons></Link>
        </div>
        <div className={styles.right}>
          <img src={heroImage}  alt="" />
        </div>
      </div>
    </div>
  );
}

export default Hero;

