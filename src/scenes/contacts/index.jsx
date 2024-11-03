import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"; // Import DataGrid and GridToolbar
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { getStudents } from "../../services/api.ts"; // Ensure correct path

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [combinedData, setCombinedData] = useState([]);

  // Fetch students data
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getStudents();
        console.log("Fetched data:", data); // Debugging: Check data structure
        setCombinedData(data || []);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    fetchContacts();
  }, []);

  // Define columns for DataGrid
  const columns = [
    { field: "No", headerName: "No", flex: 0.5 },
    { field: "Name", headerName: "Name", flex: 1 },
    { field: "Class", headerName: "Class", flex: 1 },
    { field: "Attendance", headerName: "Attendance (Present/Total)", flex: 1 },
    { field: "P", headerName: "Present (Days)", type: "number", headerAlign: "left", align: "left" },
    { field: "AB", headerName: "Absent (Days)", type: "number", headerAlign: "left", align: "left" },
    { field: "L", headerName: "Late (min)", type: "number", headerAlign: "left", align: "left" },
    { field: "memo", headerName: "Memo", flex: 1 },
  ];
  

  return (
    <Box m="20px">
      <Header title="STUDENTS LIST" subtitle="List of Student Attendance for Reference" />

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
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          rows={combinedData} // Use fetched data
          columns={columns} // Columns configuration
          components={{ Toolbar: GridToolbar }} // Enable GridToolbar for extra functionality
          getRowId={(row) => row._id} // Use _id from MongoDB as unique ID
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Contacts;
