import React from 'react';

interface TextErrorProps {
  children?: React.ReactNode; // Allow any kind of children
}

const TextError: React.FC<TextErrorProps> = ({ children }) => {
  const divErrorStyle = { color: 'red' };
  return <div className='error' style={divErrorStyle}>{children}</div>;
};

export default TextError;
