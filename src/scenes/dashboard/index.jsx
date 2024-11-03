import {
  Box,
  Button,
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import Header from "../../components/Header";
import BarChart from "../../components/Dashboardbar";
import LineChart from "../../components/LineChart"; // Import LineChart component
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { getStudents, getStudentMonths } from "../../services/api.ts";
import { useEffect, useState, useRef } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import html2canvas from "html2canvas";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [students, setStudents] = useState([]);
  const [studentMonth, setStudentMonth] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  // Refs for charts
  const barChartRef = useRef();
  const lineChartRef = useRef();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const studentData = await getStudents();
        setStudents(studentData || []);
        const monthData = await getStudentMonths();
        setStudentMonth(monthData || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  const totalStudents = students.length;

  const attendanceRates = students.map((student) => {
    const [attended, total] = student["Attendance"]
      ?.split(" / ")
      .map(Number) || [0, 0];
    return total > 0 ? (attended / total) * 100 : 0;
  });
  const averageAttendance =
    attendanceRates.reduce((a, b) => a + b, 0) / attendanceRates.length || 0;

  const totalAttended = students.reduce((sum, student) => {
    const attended = Number(student["Attendance"]?.split(" / ")[0] || 0);
    return sum + attended;
  }, 0);

  const newEnrollments = students.filter((student) => student.isNew).length;
  const presentToday = students.filter(
    (student) => student.attendanceToday
  ).length;

  const monthMapping = {
    January: "Jan",
    February: "Feb",
    March: "Mar",
    April: "Apr",
    May: "May",
    June: "Jun",
    July: "Jul",
    August: "Aug",
    September: "Sep",
    October: "Oct",
    November: "Nov",
    December: "Dec",
  };

  const monthOrder = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };

  const attendanceStatusByMonth = studentMonth.reduce((acc, monthData) => {
    const { month, Attendance } = monthData;

    if (!acc[month]) {
      acc[month] = { present: 0, absent: 0 };
    }

    Attendance.forEach((student) => {
      acc[month].present += student.present || 0;
      acc[month].absent += student.total - student.present || 0;
    });

    return acc;
  }, {});

  const monthlyAttendanceSummary = Object.entries(attendanceStatusByMonth)
    .map(([month, { present, absent }]) => ({
      month: monthMapping[month] || month,
      present,
      absent,
      order: monthOrder[monthMapping[month]],
    }))
    .sort((a, b) => a.order - b.order);

  const lineChartData = [
    {
      id: "Monthly Attendance",
      data: monthlyAttendanceSummary.map(({ month, present }) => ({
        x: month,
        y: present,
      })),
    },
  ];

  const totalPossibleDays = totalStudents * 15;
  const attendancePercentage = totalPossibleDays
    ? totalAttended / totalPossibleDays
    : 0;

  const barChartData = monthlyAttendanceSummary.map(({ month, present }) => ({
    Month: month,
    Present: present,
  }));

  const generatePDF = async () => {
    const barChartCanvas = await html2canvas(barChartRef.current);
    const lineChartCanvas = await html2canvas(lineChartRef.current);
    const barChartImage = barChartCanvas.toDataURL("image/png");
    const lineChartImage = lineChartCanvas.toDataURL("image/png");

    const docDefinition = {
      content: [
        {
          text: "Attendance Summary",
          style: "header",
          alignment: "center",
          color: colors.blueAccent[700],
        },
        {
          style: "tableExample",
          table: {
            widths: ["*", "*"],
            body: [
              [
                { text: "Metric", alignment: "center", style: "tableHeader" },
                { text: "Value", alignment: "center", style: "tableHeader" },
              ],
              ["Total Students", totalStudents],
              ["Average Attendance", `${averageAttendance.toFixed(2)}%`],
              ["New Enrollments", newEnrollments],
              ["Present Today", presentToday],
            ],
          },
          layout: {
            fillColor: (rowIndex) =>
              rowIndex === 0 ? colors.blueAccent[700] : null,
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => colors.grey[600],
            vLineColor: () => colors.grey[600],
            paddingLeft: () => 4,
            paddingRight: () => 4,
          },
          margin: [0, 10],
        },
        { text: "", margin: [0, 20] },
        {
          text: "Monthly Attendance Summary",
          style: "subheader",
          color: colors.blueAccent[500],
        },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            widths: ["*", "*", "*"],
            body: [
              [
                { text: "Month", style: "tableHeader" },
                { text: "Present", style: "tableHeader" },
                { text: "Absent", style: "tableHeader" },
              ],
              ...monthlyAttendanceSummary.map(({ month, present, absent }) => [
                month,
                present,
                absent,
              ]),
            ],
          },
          layout: {
            fillColor: (rowIndex) =>
              rowIndex === 0 ? colors.blueAccent[700] : null,
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => colors.grey[600],
            vLineColor: () => colors.grey[600],
            paddingLeft: () => 4,
            paddingRight: () => 4,
          },
        },
        { text: "", margin: [0, 20] },
        { text: "Monthly Attendance Trends (Bar Chart)", style: "subheader" },
        { image: barChartImage, width: 500, margin: [0, 20] },
        { text: "Attendance Trends (Line Chart)", style: "subheader" },
        { image: lineChartImage, width: 500, margin: [0, 20] },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 8],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 8, 0, 4],
          color: colors.grey[800],
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: colors.grey[100],
          fillColor: colors.blueAccent[700],
          margin: [0, 5],
          alignment: "center",
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
      },
    };
    pdfMake.createPdf(docDefinition).download("attendance_summary.pdf");
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="STUDENT ATTENDANCE DASHBOARD"
          subtitle="Track student attendance effectively"
        />
        <Box>
          <Button
            onClick={generatePDF}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Attendance Report
          </Button>
        </Box>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalStudents.toString()}
            subtitle="Total Students"
            progress="1.00"
            increase="+0%"
            icon={
              <PeopleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${averageAttendance.toFixed(2)}%`}
            subtitle="Average Attendance Rate"
            progress={(averageAttendance / 100).toString()}
            increase="+0%"
            icon={
              <CheckCircleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={newEnrollments.toString()}
            subtitle="New Enrollments"
            progress="0.30"
            increase="+10%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={presentToday.toString()}
            subtitle="Present Today"
            progress="0.85"
            increase="+5%"
            icon={
              <EventAvailableIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          ref={barChartRef}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Monthly Attendance Trends (Bar Chart)
            </Typography>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <BarChart data={barChartData} isDashboard={true} />
          </Box>
        </Box>

        <Box
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          ref={lineChartRef}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Attendance Trends (Line Chart)
            </Typography>
          </Box>
          <Box
            height="250px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            m="-20px 0 0 0"
          >
            <LineChart data={lineChartData} isDashboard={true} style={{ flexGrow: 1 }}/>
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Attendance Overview
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" progress={attendancePercentage} />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {totalAttended} Total Days Attended
            </Typography>
            <Typography>Includes all attendance data for the week</Typography>
          </Box>
        </Box>

        <Box
          gridColumn="span 6"
          gridRow="span 5"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Monthly Attendance Summary
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell>Present</TableCell>
                  <TableCell>Absent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {monthlyAttendanceSummary.map(({ month, present, absent }) => (
                  <TableRow
                    key={month}
                    style={{
                      backgroundColor:
                        month === currentMonth
                          ? colors.greenAccent[100]
                          : "inherit",
                    }}
                  >
                    <TableCell>{month}</TableCell>
                    <TableCell>{present}</TableCell>
                    <TableCell>{absent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
