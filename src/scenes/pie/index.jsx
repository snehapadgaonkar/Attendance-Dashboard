import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";
import { getStudentMonths, getStudents } from "../../services/api.ts"; // Ensure correct import

const Pie = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch monthly attendance data
        const studentMonths = await getStudentMonths();
        const attendanceSummary = {};

        studentMonths.forEach(({ month, Attendance }) => {
          if (!attendanceSummary[month]) {
            attendanceSummary[month] = { total: 0, present: 0 };
          }

          Attendance.forEach(({ present, total }) => {
            attendanceSummary[month].total += total;
            attendanceSummary[month].present += present;
          });
        });

        const monthOrder = [
          "January", "February", "March", "April", "May", "June", 
          "July", "August", "September", "October", "November", "December"
        ];

        const transformedMonthlyData = monthOrder.map(month => {
          const { present, total } = attendanceSummary[month] || { present: 0, total: 0 };
          const presentPercentage = total > 0 ? (present / total) * 100 : 0;
          return { id: month, label: month, value: presentPercentage };
        });

        setMonthlyData(transformedMonthlyData);

        // Fetch class attendance data
        const students = await getStudents();
        const classAttendanceSummary = {};

        students.forEach(student => {
          const { Class, Attendance } = student;
          const [present, total] = Attendance.split(" / ").map(Number);

          if (!classAttendanceSummary[Class]) {
            classAttendanceSummary[Class] = { total: 0, present: 0 };
          }
          classAttendanceSummary[Class].total += total;
          classAttendanceSummary[Class].present += present;
        });

        const transformedClassData = Object.entries(classAttendanceSummary).map(
          ([className, { present, total }]) => {
            const presentPercentage = total > 0 ? (present / total) * 100 : 0;
            return { id: className, label: className, value: presentPercentage };
          }
        );

        setClassData(transformedClassData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, []);

  return (
    <Box m="20px">
      <Header title="Attendance Overview" subtitle="Monthly and Class Attendance" />
      
      <Box height="75vh">
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            <Typography variant="h5">Monthly Attendance Percentage</Typography>
            <PieChart data={monthlyData} />
            
            <Typography variant="h5" style={{ marginTop: '40px' }}>Class Attendance Percentage</Typography>
            <PieChart data={classData} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Pie;
