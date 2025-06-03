import { Routes, Route } from "react-router-dom";

import { FlashProvider } from "./Components/FlashProvider";

import Home from "./Components/pages/Home.js";
import Post from "./Components/pages/Post.js";

function App() {
  return (
    <FlashProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<Post />} />
      </Routes>
    </FlashProvider>
  );
}

export default App;
