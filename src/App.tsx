import { Route, Routes } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main/Main";

//develop브런치입니다.
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />}></Route>
      </Routes>
    </div>
  );
}

export default App;
