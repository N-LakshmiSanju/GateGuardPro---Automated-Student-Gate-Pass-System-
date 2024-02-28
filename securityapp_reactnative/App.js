import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import RNModal from 'react-native-modal';
import { db } from './firebase'; // Import your Firebase Firestore instance
import { collection, query, where, getDocs,deleteDoc } from 'firebase/firestore';
export default function App() {
const [hasPermission, setHasPermission] = useState(null);
const [scanned, setScanned] = useState(false);
const [scannedData, setScannedData] = useState(null);
const [showAlert, setShowAlert] = useState(false);
const [alertMessage, setAlertMessage] = useState('');
useEffect(() => {
const getBarCodeScannerPermissions = async () => {
const { status } = await BarCodeScanner.requestPermissionsAsync();
setHasPermission(status === 'granted');
};
getBarCodeScannerPermissions();
}, []);
// Function to check if the roll number is allowed
const checkRollNumberAllowed = async (rollNumber) => {
try {
const studentsCollectionRef = collection(db, 'students');
console.log(rollNumber);
console.log(typeof(rollNumber));
const q = query(studentsCollectionRef, where('rno', '==', rollNumber));
const querySnapshot = await getDocs(q);

//console.log(querySnapshot);
if (!querySnapshot.empty) {
// Roll number exists in the "students" collection
const student = querySnapshot.docs[0].data();
const studentref = querySnapshot.docs[0].ref;
console.log(student);
console.log(student.allowed);
const temp=student.allowed;// so that delete becomes easy
try {
await deleteDoc(studentref);
console.log('Document deleted successfully');
} catch (error) {
console.error('Error deleting document:', error);
}
if (temp) {
return 'Allowed';
} else {
return 'Not Allowed';
}
} else {
return 'Not Found';
}
} catch (error) {
console.error('Error checking roll number:', error);
return false; // Handle any errors here
}
};
const handleBarCodeScanned = async ({ type, data }) => {
setScanned(true);
setScannedData({ type, data });
const isAllowed = await checkRollNumberAllowed(data);
setShowAlert(true);
if (isAllowed) {
setAlertMessage('Allowed');
} else {
setAlertMessage('Not Allowed');
}
};

const closeModal = () => {
setScanned(false);
setShowAlert(false);
};
if (hasPermission === null) {
return <Text>Requesting camera permission...</Text>;
}
if (hasPermission === false) {
return <Text>No access to the camera.</Text>;
}
return (
<View style={styles.container}>
<BarCodeScanner
onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
style={{ width: 360, height: 400 }}
/>
{scanned && (
<TouchableOpacity style={styles.btnn} onPress={closeModal}>
<Text style={{ color: 'white' }}>Scan Again</Text>
</TouchableOpacity>)
}
<RNModal
isVisible={showAlert}
backdropOpacity={0.7}
animationIn="fadeIn"
animationOut="fadeOut"
onBackdropPress={closeModal}
>
<View style={styles.alertContainer}>
<View style={styles.alertBox}>
<Text style={styles.alertText}>Scan Result:</Text>
<Text style={[styles.alertText, { color: alertMessage === 'Allowed' ? 
'green' : 'red' }]}>
{alertMessage}
</Text>
<TouchableOpacity style={styles.alertButton} onPress={closeModal}>
<Text style={{ color: 'white' }}>Close</Text>
</TouchableOpacity>
</View>
</View>
</RNModal>
</View>
);
}
const styles = StyleSheet.create({
container: {
flex: 1,

flexDirection: 'column',
justifyContent: 'center',
},
btnn: {
alignItems: 'center',
backgroundColor: 'black',
padding: 10,
marginTop: 60,
},
alertContainer: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
},
alertBox: {
backgroundColor: 'rgba(0, 0, 0, 0.7)',
borderRadius: 10,
padding: 20,
alignItems: 'center',
},
alertText: {
fontSize: 18,
fontWeight: 'bold',
marginBottom: 10,
},
alertButton: {
backgroundColor: 'black',
padding: 10,
borderRadius: 5,
alignItems: 'center',
marginTop: 20,
},
});
