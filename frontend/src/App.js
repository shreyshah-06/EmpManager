import './App.css';
import Users from "./components/Users";
import { Box ,Stack} from '@mui/material';
function App() {
  return (
    <Stack direction='column' sx={{height:'100%'}} >
        <Box sx={{  height: { sx: "auto", md: "auto" }}}>
          <Users/>
        </Box>
    </Stack>
  );
}

export default App;
