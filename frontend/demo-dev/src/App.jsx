import { useState } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Workspace from "./pages/Workspace";
import RoomForm from "./demos/RoomLanding";
import Sidebar from "./components/Sidebar";
import SearchPage from "./pages/SearchPage";
import Chatbox from "./pages/Chat-box";
import Landing from "./home/mainpage/Landing";
import "./App.css";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<RoomForm />} />
        {/* <Route path="/create" element={<RoomForm />} /> ✅ ADD THIS */}
        {/* App layout */}
        <Route path="/editor/:roomId" element={<AppLayout />}>
          <Route index element={<Workspace />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="chat" element={<Chatbox />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
