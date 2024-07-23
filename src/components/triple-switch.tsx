/* Originally pulled from https://codesandbox.io/s/react-triple-toggle-forked-lpk2i5 */
import React, {
  useState,
  ChangeEvent,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import "./triple-switch.css";

type ValueType = string | number;

interface TripleSwitchOptionProps {
  title: string;
  value: ValueType;
  position: string;
  getSwitchAnimation?: (value: ValueType) => void;
  switchPosition?: string;
}

export const TripleSwitchOption: React.FC<TripleSwitchOptionProps> = ({
  title,
  position,
  switchPosition,
  getSwitchAnimation,
}) => (
  <>
    <input
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        getSwitchAnimation?.(e.target.value)
      }
      name="map-switch"
      id={position}
      type="radio"
      value={position}
      checked={position === switchPosition}
    />
    <label
      className={`${position}-label ${
        switchPosition === position && "black-font"
      }`}
      htmlFor={position}
    >
      <h6>{title}</h6>
    </label>
  </>
);

interface TripleSwitchProps {
  selection: ValueType;
  onChange: (value: ValueType) => void;
  styles?: React.CSSProperties;
  children?: React.ReactElement<TripleSwitchOptionProps>[];
}

export const TripleSwitch: React.FC<TripleSwitchProps> = ({
  selection,
  onChange,
  styles,
  children,
}) => {
  const [switchPosition, setSwitchPosition] = useState<string>("left");
  const [animation, setAnimation] = useState<string | null>(null);

  // Treat children as an array of TripleSwitchOption components and validate them
  const options = useMemo(
    () =>
      React.Children.toArray(children).filter(
        (child): child is React.ReactElement<TripleSwitchOptionProps> =>
          React.isValidElement(child) &&
          (child.type === TripleSwitchOption ||
            (child.type as any).displayName === TripleSwitchOption.displayName),
      ),
    [children],
  );

  const getSwitchAnimation = useCallback(
    (value: ValueType) => {
      const valueOfSelection = options.find(
        (option) => option.props.position === value,
      )?.props.value;
      onChange(valueOfSelection as ValueType);
    },
    [options, onChange],
  );

  useEffect(() => {
    const value = options.find((option) => option.props.value === selection)
      ?.props.position;
    if (value) {
      let animation: string | null = null;
      if (value === "center" && switchPosition === "left") {
        animation = "left-to-center";
      } else if (value === "right" && switchPosition === "center") {
        animation = "center-to-right";
      } else if (value === "center" && switchPosition === "right") {
        animation = "right-to-center";
      } else if (value === "left" && switchPosition === "center") {
        animation = "center-to-left";
      } else if (value === "right" && switchPosition === "left") {
        animation = "left-to-right";
      } else if (value === "left" && switchPosition === "right") {
        animation = "right-to-left";
      }
      setAnimation(animation);
      setSwitchPosition(value as string);
    }
  }, [selection, getSwitchAnimation, options, switchPosition]);

  return (
    <div className="triple-switch-container" style={styles}>
      <div className={`switch ${animation} ${switchPosition}-position`} />
      {/* Render the option children and pass the getSwitchAnimation function */}
      {options.map((option) =>
        React.cloneElement(option, { getSwitchAnimation, switchPosition }),
      )}
    </div>
  );
};
