import React, { useState, useEffect, ReactNode, useRef } from "react";
import "./hover.css";

interface HoverProps {
  children: ReactNode;
  text: string;
  extraClasses: string;
  timeout?: number;
  additionalClasses?: string;
  animationDuration?: number;
}

const Hover: React.FC<HoverProps> = ({
  children,
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
      }, timeout);
    }
  }, [show]);

  return (
    <div
      className={`${classlist.current}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <div className={"hover" + (show ? " show" : "") + " " + extraClasses}>
        {show ? text : ""}
      </div>
    </div>
  );
};

export default Hover;
