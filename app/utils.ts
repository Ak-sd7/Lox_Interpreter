export const isDigit = (character: string): boolean => {
  if (character >= "0" && character <= "9") return true;
  return false;
};

export const isAlpha = (character: string): boolean => {
  return (
    (character >= "a" && character <= "z") ||
    (character >= "A" && character <= "Z") ||
    character === "_"
  );
};

export const isAlphaNumeric = (character: string): boolean => {
  return isAlpha(character) || isDigit(character);
};
