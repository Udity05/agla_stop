import { useEffect, useState } from "react";


function formatTime(date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}


export default function Clock() {
  const [time, setTime] = useState(new Date());


  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);


    return () => {
      clearInterval(timer);
    };
  }, []);


  return (
    <div className="clock">
      {formatTime(time)}
    </div>
  );
}