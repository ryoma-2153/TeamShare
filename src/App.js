import { Route, Routes } from "react-router-dom";
import { CreateTeam } from "./pages/CreateTeam";
import { LoginTop } from "./pages/LoginTop";
import { JoinTeam } from "./pages/JoinTeam";

import { Assignment } from "./pages/Assignment";
import { Goal } from "./pages/Goal";
import { Schedule } from "./pages/Schedule";
import { Main } from "./pages/Main";
import { Attendance } from "./pages/Attendance";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginTop />} />
        <Route path="/create" element={<CreateTeam />} />
        <Route path="/join" element={<JoinTeam />} />
        <Route path="/main" element={<Main />} />
        <Route path="/assignment" element={<Assignment />} />
        <Route path="goal" element={<Goal />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="attendance" element={<Attendance />} />
      </Routes>
    </>
  );
}

export default App;
