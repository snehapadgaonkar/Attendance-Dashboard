import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";

const BarChart = ({ data = [], isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const barColors = theme.palette.mode === 'dark' ? '#00796b' : '#80deea';

  // Add colors to data if they don't already exist
  const processedData = data.map(item => ({
    ...item,
    color: item.color || barColors,
  }));

  // Determine keys and index based on the data type
  const isClassData = processedData.length && 'Class' in processedData[0];
  const keys = isClassData ? ["Attended"] : ["Present"];
  const indexBy = isClassData ? "Class" : "month";

  return (
    <ResponsiveBar
      data={processedData}
      theme={{
        axis: {
          domain: {
            line: { stroke: colors.grey[100] },
          },
          legend: {
            text: { fill: colors.grey[100] },
          },
          ticks: {
            line: { stroke: colors.grey[100], strokeWidth: 1 },
            text: { fill: colors.grey[100] },
          },
        },
        legends: {
          text: { fill: colors.grey[100] },
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
      keys={keys} // Use the appropriate keys for attendance data
      indexBy={indexBy} // Use the appropriate index for classes or months
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={isDashboard ? { datum: "color" } : barColors}
      borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : (isClassData ? "Class" : "Month"),
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Attendance",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          translateX: 120,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [{ on: "hover", style: { itemOpacity: 1 } }],
          labelTextColor: colors.grey[100],
        },
      ]}
      role="application"
      ariaLabel="Attendance Bar Chart"
      barAriaLabel={({ id, value, indexValue }) => `${id} in ${indexValue} : ${value.toFixed(2)}%`}
      tooltip={({ id, value, indexValue }) => (
        <div style={{ color: colors.grey[100], backgroundColor: colors.grey[800], padding: "5px 10px", borderRadius: "4px" }}>
          <strong>{`${id} in ${indexValue}: ${value.toFixed(2)}%`}</strong>
        </div>
      )}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  );
};

export default BarChart;
