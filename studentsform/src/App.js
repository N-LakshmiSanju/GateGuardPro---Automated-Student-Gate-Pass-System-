import { db, storage } from './firebase'; // Import your Firebase config
import { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
function App() {
const [studentName, setStudentName] = useState('');
const [rollNumber, setRollNumber] = useState('');
const [year, setYear] = useState('');
const [section, setSection] = useState('');
const [branch, setBranch] = useState('');
const [reason, setReason] = useState('');
const [isSubmitted, setIsSubmitted] = useState(false);
useEffect(() => {
if (isSubmitted) {
const timeout = setTimeout(() => {
setIsSubmitted(false);
}, 3000); // Message disappears after 3 seconds
return () => clearTimeout(timeout);
}
}, [isSubmitted]);
const handleSubmit = async (e) => {
e.preventDefault();
try {
const studentData = {
name: studentName,
rollNumber,
year,
section,
branch,
reason,
allowed: false, // Default value as false
};
// Add the student data to the Firestore collection
await addDoc(collection(db, 'students'), studentData);
// Clear the form fields

setStudentName('');
setRollNumber('');
setYear('');
setSection('');
setBranch('');
setReason('');
// Show the success message
setIsSubmitted(true);
} catch (error) {
console.error('Error adding student data: ', error);
}
};
const styles = {
container: {
maxWidth: '400px',
margin: '0 auto',
textAlign: 'center',
background: 'black', // Change the background color to gray
padding: '20px',
color: 'white',
},
form: {
display: 'flex',
flexDirection: 'column',
},
formGroup: {
marginBottom: '20px',
display: 'flex',
flexDirection: 'column',
},
label: {
fontWeight: 'bold',
fontSize: '16px',
color: 'white',
alignSelf: 'flex-start',
},
input: {
border: '1px solid #ccc',
borderRadius: '5px',
padding: '10px',
fontSize: '16px',
},
button: {
backgroundColor: '#007bff',
color: 'white',
border: 'none',
borderRadius: '5px',
padding: '12px 20px',
fontSize: '16px',
cursor: 'pointer',

transition: 'background-color 0.3s',
},
successMessage: {
background: 'black',
color: 'green',
padding: '20px',
position: 'fixed',
top: '50%',
left: '50%',
transform: 'translate(-50%, -50%)',
zIndex: 999,
fontSize: '24px',
},
};
return (
<div style={styles.container}>
<h2>Fill out the form for permission</h2>
<form onSubmit={handleSubmit} style={styles.form}>
<div style={styles.formGroup}>
<label htmlFor="studentName" style={styles.label}>
Student Name:
</label>
<input
type="text"
id="studentName"
value={studentName}
onChange={(e) => setStudentName(e.target.value)}
required
style={styles.input}
/>
</div>
<div style={styles.formGroup}>
<label htmlFor="rollNumber" style={styles.label}>
Roll Number:
</label>
<input
type="text"
id="rollNumber"
value={rollNumber}
onChange={(e) => setRollNumber(e.target.value)}
required
style={styles.input}
/>
</div>
<div style={styles.formGroup}>
<label htmlFor="year" style={styles.label}>
Year:
</label>
<input
type="text"
id="year"

value={year}
onChange={(e) => setYear(e.target.value)}
style={styles.input}
/>
</div>
<div style={styles.formGroup}>
<label htmlFor="section" style={styles.label}>
Section:
</label>
<input
type="text"
id="section"
value={section}
onChange={(e) => setSection(e.target.value)}
style={styles.input}
/>
</div>
<div style={styles.formGroup}>
<label htmlFor="branch" style={styles.label}>
Branch:
</label>
<input
type="text"
id="branch"
value={branch}
onChange={(e) => setBranch(e.target.value)}
style={styles.input}
/>
</div>
<div style={styles.formGroup}>
<label htmlFor="reason" style={styles.label}>
Reason to Leave Early:
</label>
<textarea
id="reason"
value={reason}
onChange={(e) => setReason(e.target.value)}
required
style={styles.input}
/>
</div>
<button type="submit" style={styles.button}>
Submit
</button>
</form>
{isSubmitted && (
<div style={styles.successMessage}>
Form submitted successfully.
</div>
)}
</div>

);
}
export default App;