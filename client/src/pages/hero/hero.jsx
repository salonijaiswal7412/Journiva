import React from 'react';

import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

function Hero() {
  return (
    <div
      className={styles.hero}
     
    >
      <div className={styles.content}>
        <div className={styles.titleWrapper}>
          <h3 className={styles.subtitle}>Welcome to</h3>
          <h1 className={styles.title}>Journiva</h1>
        </div>

        <p className={styles.description}>
          Your digital sanctuary to breathe, reflect, and heal.<br />
          Begin your journey inward with mindful journaling, mood tracking, and emotional clarity.
        </p>

        <Link to="/signup">
          <button className={styles.button}>Join Us</button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
