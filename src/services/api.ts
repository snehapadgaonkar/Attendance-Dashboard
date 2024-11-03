import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Fetch all students
export const getStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

// Fetch all student months
export const getStudentMonths = async () => {
  try {
    const response = await axios.get(`${API_URL}/studentmonths`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student months:', error);
    throw error;
  }
};

// Update a student's record
export const updateStudent = async (id: string, data: any) => {
  try {
    const response = await axios.patch(`${API_URL}/students/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

// Update a student's months record
export const updateStudentMonth = async (id: string, data: any) => {
  try {
    const response = await axios.patch(`${API_URL}/studentmonths/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating student month:', error);
    throw error;
  }
};

// Add a new student
export const addStudent = async (data: { firstName: string; lastName: string; Class: string; Phone: string; Email: string; }) => {
  const students = await getStudents();
  const lastNo = students.length > 0 ? Math.max(...students.map((student: { No: number; }) => student.No)) : 0;

  const studentData = {
    _id: lastNo + 1,
    No: lastNo + 1,
    Name: `${data.firstName} ${data.lastName}`,
    Class: data.Class,
    L: 0,
    Attendance: "0 / 0",
    P: 0,
    AB: 0,
    memo: "NA",
    Phone: data.Phone,
    Email: data.Email,
  };

  try {
    console.log('Sending data to add student:', studentData);
    const response = await axios.post(`${API_URL}/students`, studentData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error adding student:', error.response.data);
    } else {
      console.error('Error adding student:', error.message);
    }
    throw error;
  }
};

// Add a new student month record
export const addStudentMonth = async (data: { month: string; Attendance: Array<{ No: number; Name: string; present: number; total: number; }> }) => {
  try {
    const response = await axios.post(`${API_URL}/studentmonths`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error adding student month:', error.response.data);
    } else {
      console.error('Error adding student month:', error.message);
    }
    throw error;
  }
};

// Login function for admins
export const adminLogin = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/admins/login`, {
      username,
      password,
    });
    return response; // Return the entire response for further processing
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error logging in:', error.response.data);
    } else {
      console.error('Error logging in:', error.message);
    }
    throw error; // Rethrow the error for handling in the calling function
  }
};
