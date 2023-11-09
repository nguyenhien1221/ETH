import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainScreen from "./Screen/MainScreen";
import { Buffer } from "buffer";
import { TOKEN_CONTRACT } from "./features/constants";

function App() {
  if (!window.Buffer) {
    window.Buffer = Buffer;
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path={`/token?/${TOKEN_CONTRACT}?`} element={<MainScreen />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
