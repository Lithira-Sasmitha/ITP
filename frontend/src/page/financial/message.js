import { useState, useEffect } from "react";
import { FaEnvelope } from "react-icons/fa";
import Header from "../../components/header/header";

function Message() {  
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-10">
    <Header title='Messege' />
    
  </div>
  );
}

export default Message;
