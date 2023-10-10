import React, { useState, useEffect, ReactNode, useRef } from "react";
import "./fade-in-out.css";

interface FadeInOutProps {
  children: ReactNode;
  show: boolean;
  additionalClasses?: string;
  animationDuration?: number;
}

const FadeInOut: React.FC<FadeInOutProps> = ({
  children,
  show,
  additionalClasses = "",
  animationDuration = 500,
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
      }, animationDuration);
    }
  }, [show, shouldRender, pastShow, additionalClasses, animationDuration]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`fade ${classlist.current}`}
      style={{
        transition: `opacity ${animationDuration}ms ease-in-out`,
        opacity: show ? 1 : 0,
        transitionDuration:
          (show ? animationDuration / 2 : animationDuration) + "ms",
      }}
    >
      {children}
    </div>
  );
};

export default FadeInOut;
