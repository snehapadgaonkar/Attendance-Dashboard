import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { getStudents, getStudentMonths } from "../../services/api.ts"; // Ensure the import path is correct
import { tokens } from "../../theme"; // Make sure to import your theme tokens

const Line = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [data, setData] = useState([]);
  const [classData, setClassData] = useState([]); // New state for class attendance
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const monthOrder = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ];

      try {
        const monthsData = await getStudentMonths();
        const students = await getStudents(); // Fetch students data

        // Transform monthly data
        const transformedMonthlyData = monthsData
          .map(monthData => ({
            x: monthData.month,
            y: monthData.Attendance.reduce((sum, record) => sum + record.present, 0),
          }))
          .sort((a, b) => monthOrder.indexOf(a.x) - monthOrder.indexOf(b.x));

        // Calculate attendance percentage for each class
        const attendanceByClass = {};

        students.forEach(student => {
          const className = student.Class || "Unknown";
          const [attended, total] = student.Attendance.split(" / ").map(Number);

          if (!attendanceByClass[className]) {
            attendanceByClass[className] = { Class: className, Attendance: 0, Total: 0 };
          }

          attendanceByClass[className].Attendance += attended;
          attendanceByClass[className].Total += total;
        });

        // Transform and sort class attendance data
        const transformedClassData = Object.values(attendanceByClass)
          .map(({ Class, Attendance, Total }) => ({
            x: Class,
            y: Total > 0 ? (Attendance / Total) * 100 : 0,
          }))
          .sort((a, b) => a.x.localeCompare(b.x)); // Sort by class name

        setData([{ id: "Monthly Attendance", data: transformedMonthlyData }]);
        setClassData([{ id: "Class Attendance Percentage", data: transformedClassData }]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Typography color={colors.grey[100]}>Loading...</Typography>;

  return (
    <div style={{ margin: "20px", padding: "20px" }}>
      <Header title="Attendance Overview" subtitle="Monthly and Class Attendance" />
      
      {/* Monthly Attendance Chart */}
      <Box 
        height="75vh" 
        bgcolor={colors.grey[800]} 
        borderRadius="8px" 
        p="20px" 
        mb="40px" 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center"
      >
        <Typography variant="h5" color={colors.grey[100]} style={{ marginTop: '20px'}}>Monthly Attendance</Typography>
        <LineChart data={data} title="Monthly Attendance"/>
      </Box>

      {/* Class Attendance Percentage Chart */}
      <Box 
        height="75vh" 
        bgcolor={colors.grey[800]} 
        borderRadius="8px" 
        p="20px" 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center"
      >
        <Typography variant="h5" color={colors.grey[100]} style={{ marginTop: '20px'}}>Class Attendance Percentage</Typography>
        <LineChart data={classData} title="Class Attendance Percentage"/>
      </Box>
    </div>
  );
};

export default Line;
