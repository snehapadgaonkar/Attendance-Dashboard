import { Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import { getStudents, getStudentMonths } from "../../services/api.ts"; 
import { useEffect, useState } from "react";

const Bar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [classData, setClassData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const students = await getStudents();
        const transformedClassData = transformClassData(students);
        setClassData(transformedClassData);

        const studentMonths = await getStudentMonths();
        const transformedMonthlyData = transformMonthlyData(studentMonths);
        setMonthlyData(transformedMonthlyData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const transformClassData = (data) => {
    const attendanceByClass = {};

    data.forEach(student => {
      const className = student.Class || "Unknown";
      const [attended, total] = student.Attendance.split(" / ").map(Number) || [0, 0];

      if (!attendanceByClass[className]) {
        attendanceByClass[className] = { Class: className, Attendance: 0, Total: 0 };
      }
      attendanceByClass[className].Attendance += attended;
      attendanceByClass[className].Total += total;
    });

    return Object.values(attendanceByClass).map(({ Class, Attendance, Total }) => ({
      Class,
      Attended: Total > 0 ? (Attendance / Total) * 100 : 0,
    })).sort((a, b) => a.Class.localeCompare(b.Class));
  };

  const transformMonthlyData = (data) => {
    const monthOrder = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    const monthDays = {
      January: 31,
      February: 28, // Assume no leap year
      March: 31,
      April: 30,
      May: 31,
      June: 30,
      July: 31,
      August: 31,
      September: 30,
      October: 31,
      November: 30,
      December: 31,
    };    

    return monthOrder.map(month => {
      const monthData = data.find(item => item.month === month);
      if (!monthData) return { month, Present: 0 };

      const { Attendance } = monthData;
      const totalDays = monthDays[month] * Attendance.length;
      const totalPresent = Attendance.reduce((sum, student) => sum + student.present, 0);
      
      const Present = totalDays > 0 ? (totalPresent / totalDays) * 100 : 0;
      return { month, Present };
    });
  };

  if (loading) return <Typography color={colors.grey[100]}>Loading...</Typography>;

  return (
    <div style={{ margin: "20px", padding: "20px" }}>
      <Header title="Attendance Overview" subtitle="Monthly and Class Attendance" />
      
      {/* Monthly Attendance Percentage Chart */}
      <div style={{ height: "75vh", backgroundColor: colors.grey[800], borderRadius: "8px", padding: "20px", marginBottom: "40px" }}>
        <Typography variant="h5" color={colors.grey[100]}>Monthly Attendance Percentage</Typography>
        <BarChart data={monthlyData} isDashboard={false} />
      </div>

      {/* Class Attendance Percentage Chart */}
      <div style={{ height: "75vh", backgroundColor: colors.grey[800], borderRadius: "8px", padding: "20px" }}>
        <Typography variant="h5" color={colors.grey[100]}>Class Attendance Percentage</Typography>
        <BarChart data={classData} isDashboard={false} />
      </div>
    </div>
  );
};

export default Bar;
