import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Import your Firebase config
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import './App.css'; // Import the CSS file

function App() {
  const [students, setStudents] = useState([]);
  const studentsRef = collection(db, 'students');

  // Load student data on component mount
  useEffect(() => {
    getStudentList(); // Fetch data on mount
    const pollInterval = 5000; // Poll for new data every 5 seconds (adjust as needed)

    const pollForNewData = setInterval(() => {
      getStudentList();
    }, pollInterval);

    // Clean up the interval on unmount
    return () => clearInterval(pollForNewData);
  }, []);

  const getStudentList = async () => {
    try {
      const data = await getDocs(query(studentsRef, orderBy('timestamp', 'desc')));
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        selected: localStorage.getItem(`student_${doc.id}`) === 'true', // Retrieve checkbox state from local storage
      }));
      setStudents(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      const studentDocRef = doc(db, 'students', id);
      await updateDoc(studentDocRef, {
        allowed: true,
      });

      // Update the class name and status directly in the state
      setStudents((prevStudents) => {
        return prevStudents.map((student) => {
          if (student.id === id) {
            student.className = 'student-box-approved';
            student.allowed = true;
          }
          return student;
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (id) => {
    try {
      const studentDocRef = doc(db, 'students', id);
      await updateDoc(studentDocRef, {
        allowed: false,
      });

      // Update the class name and status directly in the state
      setStudents((prevStudents) => {
        return prevStudents.map((student) => {
          if (student.id === id) {
            student.className = 'student-box-declined';
            student.allowed = false;
          }
          return student;
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckboxChange = (id) => {
    setStudents((prevStudents) => {
      return prevStudents.map((student) => {
        if (student.id === id) {
          const updatedStudent = {
            ...student,
            selected: !student.selected,
          };
          localStorage.setItem(`student_${id}`, updatedStudent.selected); // Store the updated checkbox state in local storage
          return updatedStudent;
        }
        return student;
      });
    });
  };

  return (
    <div className="app-container">
      <h1>Student List</h1>
      {students.map((student) => (
        <div key={student.id} className={student.className || 'student-box'}>
          <div className="student-info">
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Roll Number:</strong> {student.rno}</p>
            <p><strong>Reason:</strong> {student.reason}</p>
            <p><strong>Status:</strong> {student.allowed ? 'Approved' : student.allowed === false ? 'Declined' : 'Pending'}</p>
          </div>
          <div className="button-container">
            <button className="approve-button" onClick={() => handleApprove(student.id)}>Approve</button>
            <button className="decline-button" onClick={() => handleDecline(student.id)}>Decline</button>
            <label>
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(student.id)}
                checked={student.selected}
                style={{ width: '20px', height: '20px' }} // Adjust the width and height as needed
        
              />
              {student.selected ? 'Checked' : 'Unchecked'}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
