import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainScreen from "./Screen/MainScreen";
import { Buffer } from "buffer";

function App() {
  if (!window.Buffer) {
    window.Buffer = Buffer;
  }
  return (
    <>
      <Router>
        <Routes>
          <Route path="/:action?/:method?" element={<MainScreen />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
