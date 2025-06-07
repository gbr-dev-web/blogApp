import { Routes, Route } from "react-router-dom";

import { FlashProvider } from "./Components/flash/FlashProvider.js";

import Home from "./Components/pages/Home.js";
import Post from "./Components/pages/Post.js";
import NewPost from "./Components/pages/NewPost.js";
import MyPosts from "./Components/pages/MyPosts.js";
import EditPost from "./Components/pages/EditPost.js";

function App() {
  return (
    <FlashProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/novopost" element={<NewPost />} />
        <Route path="/meusposts" element={<MyPosts />} />
        <Route path="/editpost/:id" element={<EditPost />} />
      </Routes>
    </FlashProvider>
  );
}

export default App;
