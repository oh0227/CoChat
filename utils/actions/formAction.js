import { validateString, validateIdPassword } from "../validationContraints";

export const validateInput = (inputId, inputValue) => {
  if (inputId === "firstName" || inputId === "lastName") {
    return validateString(inputId, inputValue);
  } else if (inputId === "cochat_id" || inputId === "password") {
    return validateIdPassword(inputId, inputValue);
  }
};
