import React, { useRef } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import SignatureCanvas, { SignatureViewRef } from 'react-native-signature-canvas';

export const MySignatureCanvas = ({setScroll}) => {
    const signatureRef = useRef(null); // Create a ref for the signature canvas

    const handleClearSignature = () => {
        signatureRef.current?.clearSignature();
    };

    const handleGetSignature = () => {
        const signatureData = signatureRef.current?.getData();
        console.log(signatureData);
    };

    return (
        <SignatureCanvas
            androidHardwareAccelerationDisabled={true}
            ref={signatureRef}
            scrollable={false} // Disable scrolling
            // backgroundColor="#000"
            maxWidth={3}
            style={styles.canvas}
            onBegin={() => setScroll(false)}
            onEnd={() => setScroll(true)}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    canvas: {
        borderWidth: 1,
        borderColor: 'red',
        width: '90%',
        height: 800, // Increase the height for more drawing space
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
});