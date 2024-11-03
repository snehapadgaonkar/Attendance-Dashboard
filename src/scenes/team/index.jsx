import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { getStudents } from "../../services/api.ts"; // Ensure correct path to your API service

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [combinedData, setCombinedData] = useState([]);

  // Fetch team data
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const data = await getStudents(); // Fetch student data from API
        console.log("Fetched data:", data); // Debugging: Check data structure
        
        if (Array.isArray(data) && data.length > 0) {
          const formattedData = data.map(record => ({
            id: record.No, // Use "No" as the unique identifier
            name: record.Name,
            class: record.Class, // Map "Class"
            phone: record.Phone || "N/A", // Adjust this if you have phone data
            email: record.Email || "N/A", // Adjust this if you have email data
            attendanceStatus: record["Attendance"] || "unknown", // Map attendance status
          }));

          setCombinedData(formattedData);
        } else {
          console.error("No valid data found:", data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchTeamData();
  }, []);

  const columns = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "class", headerName: "Class", flex: 1 },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "attendanceStatus", headerName: "Attendance (Req/Act)", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="STUDENT DETAILS" subtitle="Managing the Student Contact information" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={combinedData}
          columns={columns}
          getRowId={(row) => row.id} // Use the id field as unique identifier
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Box>
    </Box>
  );
};

export default Team;
