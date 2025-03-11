import { ChangeEvent, ComponentProps, FC, KeyboardEvent, memo, useCallback, useEffect, useRef, useState } from "react";
import { ImCheckmark } from "react-icons/im";
import "./ValidatedInput.scss";

interface ValidatedInputProps extends ComponentProps<"input"> {
  onValidated: (value: string) => void;
  remoteValue: string;
}

const ValidatedInput: FC<ValidatedInputProps> = ({ onValidated, remoteValue, placeholder, ...props }) => {
  const [value, setValue] = useState(remoteValue || "");
  const [inputEdited, setInputEdited] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleValidationIconClick = () => {
    inputRef.current?.blur();
  };

  const handleInputKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  const handleInputDoubleClick = () => {
    setInputEdited(true);
  };

  const handleTitleBlur = useCallback(async () => {
    setInputEdited(false);

    if (remoteValue === value) {
      return;
    }
    onValidated(value || "");
  }, [value, onValidated, remoteValue]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    setValue(remoteValue || "");
  }, [remoteValue]);

  return (
    <div className={`validated-input`}>
      {!inputEdited && (
        <div className="input-text" data-placeholder={placeholder} onDoubleClick={handleInputDoubleClick}>
          {value}
        </div>
      )}
      {inputEdited && (
        <input
          className="input-input"
          autoFocus
          ref={inputRef}
          onBlur={handleTitleBlur}
          onKeyUp={handleInputKeyUp}
          onChange={handleInputChange}
          value={value}
          placeholder={placeholder}
          {...props}
        />
      )}
      <div className="check-icon">{remoteValue !== value && <ImCheckmark onClick={handleValidationIconClick} />}</div>
    </div>
  );
};

export default memo(ValidatedInput);
