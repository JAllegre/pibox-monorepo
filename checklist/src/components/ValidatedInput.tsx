import { Input, InputGroup, InputProps, InputRightElement } from "@chakra-ui/react";
import { DisplayMode } from "@src/types";
import { useChecklistStore } from "@src/utils/ChecklistStore";
import { ChangeEvent, FC, KeyboardEvent, MouseEvent, useCallback, useRef, useState } from "react";
import { ImCheckmark } from "react-icons/im";
import { MyIconButton } from "./MyIconButton";

type ValidatedInputProps = InputProps & { onValidated: (value: string) => void };

const ValidatedInput: FC<ValidatedInputProps> = ({ onValidated, ...props }) => {
  const [currentValue, setCurrentValue] = useState(String(props.defaultValue));
  const [inputEdited, setInputEdited] = useState(false);
  const isEditMode = useChecklistStore((state) => state.displayMode === DisplayMode.Edit);
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

    if (props.defaultValue === currentValue) {
      return;
    }
    onValidated(currentValue || "");
  }, [currentValue, onValidated, props.defaultValue]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(event.target.value);
  };

  return (
    <InputGroup>
      <Input
        ref={inputRef}
        size="sm"
        p={1}
        readOnly={!isEditMode || !inputEdited}
        sx={{ border: !isEditMode ? "none" : "" }}
        flexGrow={1}
        onDoubleClick={handleInputDoubleClick}
        onBlur={handleTitleBlur}
        onKeyUp={handleInputKeyUp}
        onChange={handleInputChange}
        {...props}
      />
      <InputRightElement>
        <MyIconButton
          ReactIcon={ImCheckmark}
          color="green.200"
          onClick={handleValidationIconClick}
          display={props.defaultValue !== currentValue ? "" : "none"}
          mb={2}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default ValidatedInput;
