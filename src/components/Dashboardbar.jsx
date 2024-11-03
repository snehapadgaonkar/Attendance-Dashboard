import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";

const DashboardBar = ({ data = [], isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const barColors = theme.palette.mode === 'dark' ? '#00796b' : '#80deea';

  const processedData = data.map(item => ({
    ...item,
    color: barColors, // Use the defined colors
  }));

  return (
    <ResponsiveBar
      data={processedData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            background: colors.grey[800],
            color: colors.grey[100],
          },
        },
      }}
      keys={["Present"]} // Correct key
      indexBy="Month" // Use Month for indexing
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={isDashboard ? { datum: "color" } : barColors}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Month",
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
      labelSkipWidth={12}
      labelSkipHeight={12}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
          labelTextColor: colors.grey[100],
        },
      ]}
      role="application"
      ariaLabel="Attendance Bar Chart"
      barAriaLabel={(e) => `${e.id} in ${e.indexValue} : ${e.formattedValue}`}
      tooltip={({ id, value, indexValue }) => (
        <strong style={{ color: colors.grey[100] }}>
          {`${id} in ${indexValue} : ${value}`} {/* Display value */}
        </strong>
      )}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  );
};

export default DashboardBar;
