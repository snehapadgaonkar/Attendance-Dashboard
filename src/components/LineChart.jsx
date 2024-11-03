import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const LineChart = ({ data = [], isDashboard = false, title }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Determine y-axis legend based on title
  const yAxisLegend = title === "Monthly Attendance" ? "Attendance Count" : "Attendance Percentage";
  
  // Determine x-axis legend based on title
  const xAxisLegend = title === "Monthly Attendance" ? "Month" : "Class";

  return (
    <ResponsiveLine
      data={data}
      theme={{
        axis: {
          ticks: {
            line: { stroke: colors.grey[100] },
            text: { fill: colors.grey[100] },
          },
          legend: {
            text: { fill: colors.grey[100] },
          },
        },
        tooltip: {
          container: {
            background: colors.grey[800],
            color: colors.grey[100],
            padding: "5px 10px",
            borderRadius: "4px",
          },
        },
      }}
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      xScale={{ type: "point" }} // Suitable for categorical x values
      yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
      curve="catmullRom" // Smoothens the line
      axisBottom={{
        tickPadding: 5,
        tickRotation: isDashboard ? 0 : 45, // Rotate ticks for better visibility if needed
        legend: xAxisLegend,
        legendOffset: 40,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickPadding: 5,
        tickRotation: 0,
        legend: yAxisLegend,
        legendOffset: -50,
        legendPosition: "middle",
      }}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      useMesh={true} // Enable mesh for better tooltip interaction
      enablePoints={true}
      enableArea={false}
      animate={true} // Enable smooth animations
      motionConfig={{
        mass: 1,
        tension: 170,
        friction: 26,
      }}
      tooltip={({ point }) => (
        <div style={{ padding: "5px", background: colors.grey[800], color: colors.grey[100] }}>
          <strong>{point.data.x}</strong>: {point.data.y} {title === "Monthly Attendance" ? "days" : "%"}
        </div>
      )}
    />
  );
};

export default LineChart;
