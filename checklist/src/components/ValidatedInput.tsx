import { Input, InputGroup, InputProps, InputRightElement } from "@chakra-ui/react";
import { ChangeEvent, FC, KeyboardEvent, memo, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { ImCheckmark } from "react-icons/im";
import MyIconButton from "./MyIconButton";

type ValidatedInputProps = InputProps & { onValidated: (value: string) => void; remoteValue: string };

const ValidatedInput: FC<ValidatedInputProps> = ({ onValidated, remoteValue, ...props }) => {
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

  const handleInputDoubleClick = (event: MouseEvent<HTMLInputElement>) => {
    window.getSelection()?.empty();
    if (event?.currentTarget?.value?.length) {
      inputRef.current?.setSelectionRange(event.currentTarget.value.length, event.currentTarget.value.length);
    }
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
    <InputGroup>
      <Input
        ref={inputRef}
        size="sm"
        p={1}
        readOnly={!inputEdited}
        sx={{ border: !inputEdited ? "none" : "" }}
        flexGrow={1}
        onDoubleClick={handleInputDoubleClick}
        onBlur={handleTitleBlur}
        onKeyUp={handleInputKeyUp}
        onChange={handleInputChange}
        value={value}
        {...props}
      />
      <InputRightElement>
        <MyIconButton
          ReactIcon={ImCheckmark}
          color="green.200"
          onClick={handleValidationIconClick}
          display={remoteValue !== value ? "" : "none"}
          mb={2}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default memo(ValidatedInput);
