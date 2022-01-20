import React, {useRef} from 'react';
import { StyleSheet, View, Button } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';

const Sign = ({onOK}) => {
  const ref = useRef();

  const handleSignature = signature => {
    console.log(signature);
    onOK(signature);
  };

  const handleClear = () => {
    ref.current.clearSignature();
  }

  const handleConfirm = () => {
    console.log("end");
    ref.current.readSignature();
  }

  const undo = () => {
    ref.current.undo();
  };

  const erase = () => {
    ref.current.erase();
  };

  const draw = () => {
    ref.current.draw();
  };

  const changeColor = (color) => {
    ref.current.changePenColor(color);
  };

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <SignatureScreen
            ref={ref}
            onOK={handleSignature}
            webStyle={`
                .m-signature-pad {
                  flex: 1;
                  box-shadow: none;
                  border-radius: 10px;
                }
                .m-signature-pad--footer {
                  display: none;
                }
                `}
            backgroundColor={'rgba(255,255,255,0)'}
        />
      </View>

      <View style={styles.row}>
        <Button title="undo" onPress={undo} />
        <Button title="draw" onPress={draw} />
        <Button title="erase" onPress={erase} />
        <Button title="change color" onPress={()=>changeColor("#d45")} />
      </View>
      <View style={styles.row}>
        <Button
            title="Clear"
            onPress={handleClear}
        />
        <Button
            title="Confirm"
            onPress={handleConfirm}
        />
      </View>
    </View>
  );
}

export default Sign;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'red'
  },
  box: {
    backgroundColor: 'green',
    height: 300
  }
});
