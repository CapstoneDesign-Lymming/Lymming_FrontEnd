import { Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/MainPage/Main";

//develop브런치입니다.
import "./App.css";
import LogIn from "./pages/LogInPage/LogIn";
import KakaoAuth from "./auth/KakaoAuth";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/login" element={<LogIn />}></Route>
        <Route path="/auth" element={<KakaoAuth />}></Route>
      </Routes>
    </div>
  );
}

export default App;
