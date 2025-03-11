import { ComponentProps, FC } from "react";
import "./CheckBoxInput.scss";

type CheckBoxInputProps = ComponentProps<"input">;

const CheckBoxInput: FC<CheckBoxInputProps> = ({ checked, ...props }) => {
  return (
    <div className={`checkbox-input ${checked ? "checked" : ""}`}>
      <input className="checkbox-input-input" type="checkbox" checked={checked} {...props} />
      <div className="checkbox-circle"></div>
    </div>
  );
};
export default CheckBoxInput;
