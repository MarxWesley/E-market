import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

const DialogComponent = ({ title, message, visible, onConfirm, onDismiss, icon, textConfirm, textCancel }) => {

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Icon icon={icon ? icon : "check-circle"} />
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>
        {message && <Dialog.Content>
          <Text>{message}</Text>
        </Dialog.Content>}
        <Dialog.Actions>
          <Button onPress={onConfirm}>{textConfirm ? textConfirm : "OK"}</Button>
          {textCancel && <Button onPress={onDismiss}>{textCancel ? textCancel : "Cancel"}</Button>}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
})

export default DialogComponent;