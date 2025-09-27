import * as React from "react";
import { TextInput } from "react-native-paper";

const formInput = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  placeholder,
}) => {

  return (
    <TextInput
      mode="outlined"
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      style={styles.input}
      placeholder={placeholder}
    />
  );
};

const styles = {
  input: {
    marginTop: 8, 
    marginBottom: 8,
    marginHorizontal: 12,
    color: '#000000',
    borderRadius: 6, 

  }
}

export default formInput;