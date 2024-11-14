import React from 'react';
import { Typewriter } from 'react-simple-typewriter';

const TypewriterText = () => {
  return (
    <div className="Typewriter" data-testid="typewriter-wrapper">
      <span className="Typewriter__wrapper">
        <Typewriter
          words={['Analista de Sistemas', 'Desarrollador MERN', 'Desarrollador MVC', 'Desarrollador Desktop']}
          loop={Infinity}
          cursor
          cursorStyle="|"
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1000}
        />
      </span>
    </div>
  );
};

export default TypewriterText;
