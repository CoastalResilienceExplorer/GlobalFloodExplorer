import React, { useState, useEffect, ReactNode, useRef } from "react";
import "./fade-in-out.css";

interface FadeInOutProps {
  children: ReactNode;
  show: boolean;
  additionalClasses?: string;
}

const FadeInOut: React.FC<FadeInOutProps> = ({
  children,
  show,
  additionalClasses = "",
}) => {
  const [pastShow, setPastShow] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const classlist = useRef(additionalClasses);

  useEffect(() => {
    if (!classlist.current && !!additionalClasses) {
      classlist.current = additionalClasses;
    }
  }, [additionalClasses]);

  useEffect(() => {
    setPastShow(show);
    if (show) {
      setShouldRender(true);
    }
  }, [show]);

  useEffect(() => {
    if (!show && pastShow && shouldRender) {
      setTimeout(() => {
        setShouldRender(false);
        classlist.current = additionalClasses;
      }, 500);
    }
  }, [show, shouldRender, pastShow, additionalClasses]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className={`fade ${show ? "fade-visible" : ""} ${classlist.current}`}>
      {children}
    </div>
  );
};

export default FadeInOut;
