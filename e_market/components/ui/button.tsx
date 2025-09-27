import * as React from 'react';
import { Button } from 'react-native-paper';

type btnProps = {
    mode: "text" | "outlined" | "contained" | "elevated" | undefined;
    onPress?: () => void;
    text: string;
    color?: string;
    icon?: string;
}

const Btn = ({ mode, onPress, text, icon, color }: btnProps) => (
    <Button
        icon={icon}
        mode={mode}
        onPress={onPress}
        style={styles.button}
        textColor={mode === "contained" ? "#fff" : color}
        buttonColor={color}
    >
        {text}
    </Button>
);

const styles = {
    button: {
        margin: 10,
        heigth: 40,
        paddingTop: 15,
        paddingHorizontal: 12,
        borderRadius: 9,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
};

export default Btn;