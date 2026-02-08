import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "60px",
          background: "black",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "8px",
          gap: "8px",
          borderRight: "1px solid #1e1e1e",
        }}
      >
        {/* Files Icon */}
        <button
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
            navigate(`/editor/${roomId}`); // Home page
          }}
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            borderLeft:
              location.pathname === `/editor/${roomId}` && sidebarOpen
                ? "4px solid #ffffff"
                : "4px solid transparent",
          }}
          title="Explorer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 48 48"
          >
            <path
              fill="#6a1b9a"
              d="M36,5L17,21.5L7,14l-3,1.25v17.5L7,34l10-7.5L36,43l8-3V8L36,5z M8,20l5,4l-5,4V20z M24,24l10-7v14 L24,24z"
            ></path>
          </svg>
        </button>

        {/* Search Icon */}
        <button
          onClick={() => {
            navigate(`/editor/${roomId}/search`); // Search page
          }}
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            borderLeft:
              location.pathname === `/editor/${roomId}/search`
                ? "4px solid #ffffff"
                : "4px solid transparent",
          }}
          title="AI Bot"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 48 48"
          >
            <path
              fill="#2196f3"
              d="M23.426,31.911l-1.719,3.936c-0.661,1.513-2.754,1.513-3.415,0l-1.719-3.936	c-1.529-3.503-4.282-6.291-7.716-7.815l-4.73-2.1c-1.504-0.668-1.504-2.855,0-3.523l4.583-2.034	c3.522-1.563,6.324-4.455,7.827-8.077l1.741-4.195c0.646-1.557,2.797-1.557,3.443,0l1.741,4.195	c1.503,3.622,4.305,6.514,7.827,8.077l4.583,2.034c1.504,0.668,1.504,2.855,0,3.523l-4.73,2.1	C27.708,25.62,24.955,28.409,23.426,31.911z"
            ></path>
            <path
              fill="#7e57c2"
              d="M38.423,43.248l-0.493,1.131c-0.361,0.828-1.507,0.828-1.868,0l-0.493-1.131	c-0.879-2.016-2.464-3.621-4.44-4.5l-1.52-0.675c-0.822-0.365-0.822-1.56,0-1.925l1.435-0.638c2.027-0.901,3.64-2.565,4.504-4.65	l0.507-1.222c0.353-0.852,1.531-0.852,1.884,0l0.507,1.222c0.864,2.085,2.477,3.749,4.504,4.65l1.435,0.638	c0.822,0.365,0.822,1.56,0,1.925l-1.52,0.675C40.887,39.627,39.303,41.232,38.423,43.248z"
            ></path>
          </svg>
        </button>

        {/* Git Icon */}
        <button
          onClick={() => {
            navigate(`/editor/${roomId}/chat`); // Search page
          }}
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            borderLeft:
              location.pathname === `/editor/${roomId}/chat`
                ? "4px solid #ffffff"
                : "4px solid transparent",
          }}
          title="Chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 48 48"
          >
            <path
              fill="#29c27e"
              fill-rule="evenodd"
              d="M12.999,8.445v19.111	c0,1.901,1.544,3.445,3.445,3.445h25.111c1.901,0,3.445-1.544,3.445-3.445V8.445c0-1.901-1.544-3.445-3.445-3.445H16.445	C14.543,4.999,12.999,6.543,12.999,8.445z"
              clip-rule="evenodd"
            ></path>
            <path
              fill="#19ac66"
              d="M2.999,45.501V17.445c0-1.901,1.544-3.445,3.445-3.445h6.559	l21.997,16.996v5.56c0,1.901-1.544,3.445-3.445,3.445H12.121L5.571,46.55c-0.273,0.279-0.653,0.451-1.072,0.451	C3.673,47.001,2.999,46.327,2.999,45.501z"
            ></path>
            <path
              fill="#0c8045"
              d="M12.999,27.555V13.999h18.556	c1.901,0,3.445,1.544,3.445,3.445v13.556H16.445C14.543,31.001,12.999,29.457,12.999,27.555z"
            ></path>
          </svg>
        </button>

        <div style={{ flex: 1 }}></div>

        {/* Settings Icon */}
        <button
          onClick={() => {
            navigate(`/`); // Search page
          }}
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            marginBottom: "8px",
          }}
          title="Exit"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#858585" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" fill="#858585" />
          </svg>
        </button>
      </div>
    </div>
  );
}
