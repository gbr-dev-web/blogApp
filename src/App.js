import { Routes, Route } from "react-router-dom";

import Home from "./Components/pages/Home.js";
import Post from "./Components/pages/Post.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/post/:id" element={<Post />} />
    </Routes>
  );
}

export default App;
