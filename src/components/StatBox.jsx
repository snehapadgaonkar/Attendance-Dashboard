import { Box, Typography, useTheme } from "@mui/material";
import ProgressCircle from "./ProgressCircle";
import { tokens } from "../theme";

const StatBox = ({ title, subtitle, icon, progress = 0, increase = "0%" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          {icon}
          <Typography variant="h4" sx={{ color: colors.grey[100] }}>
            {title}
          </Typography>
        </Box>
        <ProgressCircle progress={progress} />
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
          {subtitle}
        </Typography>
        <Typography variant="h5" sx={{ color: colors.greenAccent[600] }}>
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
