import React, { useState, useEffect, ReactNode, useRef } from "react";
import "./hover.css";

interface HoverProps {
  children: ReactNode;
  action: Function;
  text: string;
  extraClasses: string;
  timeout?: number;
  additionalClasses?: string;
  animationDuration?: number;
}

const Hover: React.FC<HoverProps> = ({
  children,
  action,
  text,
  extraClasses = "",
  timeout = 5000,
  additionalClasses = "",
  animationDuration = 500,
}) => {
  const [show, setShow] = useState(false);
  const classlist = useRef(additionalClasses);

  useEffect(() => {
    if (!classlist.current && !!additionalClasses) {
      classlist.current = additionalClasses;
    }
  }, [additionalClasses]);

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        setShow(false);
        action(null);
      }, timeout);
    }
  }, [show]);

  return (
    <div
      className={`${classlist.current}`}
      onMouseEnter={() => {
        action(text);
      }}
      onMouseLeave={() => {
        action(null);
      }}
    >
      {children}
    </div>
  );
};

export default Hover;
