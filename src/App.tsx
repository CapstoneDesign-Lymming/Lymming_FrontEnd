import { Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/MainPage/Main";
import LogIn from "./pages/LogInPage/LogIn";
import KakaoAuth from "./auth/KakaoAuth";
import Participate from "./pages/ParticipatePage/Participate";
import ParticipateDetail from "./pages/ParticipateDetail/ParticipateDetail";
import TeamBuilding from "./pages/TeamBuilding/TeamBuilding";
import VideoChattingPage from "./pages/VideoChattingPage/VideoChattingPage";
import NewVideoChattingPage from "./pages/VideoChattingPage/NewVideoChattingPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/login" element={<LogIn />}></Route>
        <Route path="/auth" element={<KakaoAuth />}></Route>
        <Route path="/participate" element={<Participate />}></Route>
        <Route path="/videochat" element={<VideoChattingPage />}></Route>
        <Route path="/newVideo" element={<NewVideoChattingPage />}></Route>

        <Route
          path="/participate/detail/:id"
          element={<ParticipateDetail />}
        ></Route>
        <Route path="/teambuild" element={<TeamBuilding />}></Route>
      </Routes>
    </div>
  );
}

export default App;
