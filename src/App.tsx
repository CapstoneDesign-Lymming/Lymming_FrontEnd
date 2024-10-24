import { Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/MainPage/Main";
import LogIn from "./pages/LogInPage/LogIn";
import KakaoAuth from "./auth/KakaoAuth";
import Participate from "./pages/ParticipatePage/Participate";
import ParticipateDetail from "./pages/ParticipateDetail/ParticipateDetail";
import VideoChattingPage from "./pages/VideoChattingPage/VideoChattingPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/login" element={<LogIn />}></Route>
        <Route path="/auth" element={<KakaoAuth />}></Route>
        <Route path="/participate" element={<Participate />}></Route>
        <Route path="/videochat" element={<VideoChattingPage />}></Route>
        <Route
          path="/participate/detail/:id"
          element={<ParticipateDetail />}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
