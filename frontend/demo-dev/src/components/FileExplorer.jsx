// // FileExplorer.jsx
// // 🆕 Dirty indicator ●

// export default function FileExplorer({
//   files,
//   activeFile,
//   dirty,
//   onSelect,
//   onCreate,
//   onDelete,
// }) {
//   return (
//     <div
//       style={{
//         background: "#1e1e1e",
//         color: "#cccccc",
//         width: "100%",
//         height: "100%",
//         display: "flex",
//         flexDirection: "column",
//         fontFamily: "'Segoe UI', 'SF Pro Text', -apple-system, sans-serif",
//         fontSize: "13px",
//         userSelect: "none",
//       }}
//     >
//       <h4
//         style={{
//           margin: 0,
//           padding: "10px 20px",
//           fontSize: "11px",
//           fontWeight: 600,
//           textTransform: "uppercase",
//           letterSpacing: "1px",
//           color: "#bbbbbb",
//           borderBottom: "1px solid #333333",
//         }}
//       >
//         Explorer
//       </h4>

//       <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
//         {files.map((file) => (
//           <div
//             key={file}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: "4px 20px",
//               cursor: "pointer",
//               background: file === activeFile ? "#37373d" : "transparent",
//               borderLeft:
//                 file === activeFile
//                   ? "2px solid #0078d4"
//                   : "2px solid transparent",
//               transition: "background 0.1s ease",
//             }}
//             onMouseEnter={(e) => {
//               if (file !== activeFile) {
//                 e.currentTarget.style.background = "#2a2d2e";
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (file !== activeFile) {
//                 e.currentTarget.style.background = "transparent";
//               }
//             }}
//           >
//             <span
//               onClick={() => onSelect(file)}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 flex: 1,
//                 color: file === activeFile ? "#ffffff" : "#cccccc",
//               }}
//             >
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 16 16"
//                 fill="none"
//                 style={{ flexShrink: 0 }}
//               >
//                 <path
//                   d="M13.5 3H8.914l-.707-.707A1 1 0 007.5 2H2.5a1 1 0 00-1 1v10a1 1 0 001 1h11a1 1 0 001-1V4a1 1 0 00-1-1z"
//                   fill="#dcb67a"
//                 />
//               </svg>
//               <span
//                 style={{ display: "flex", alignItems: "center", gap: "4px" }}
//               >
//                 {file === activeFile && dirty ? (
//                   <span style={{ color: "#ffffff", fontSize: "16px" }}>●</span>
//                 ) : (
//                   ""
//                 )}
//                 {file}
//               </span>
//             </span>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onDelete(file);
//               }}
//               style={{
//                 background: "transparent",
//                 border: "none",
//                 color: "#808080",
//                 cursor: "pointer",
//                 padding: "2px 6px",
//                 borderRadius: "3px",
//                 fontSize: "12px",
//                 opacity: 0.6,
//                 transition: "opacity 0.1s ease",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.opacity = 1;
//                 e.currentTarget.style.background = "#5a5a5a";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.opacity = 0.6;
//                 e.currentTarget.style.background = "transparent";
//               }}
//             >
//               ✕
//             </button>
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={onCreate}
//         style={{
//           margin: "8px 12px",
//           padding: "6px 12px",
//           background: "#0e639c",
//           border: "none",
//           borderRadius: "3px",
//           color: "#ffffff",
//           cursor: "pointer",
//           fontSize: "12px",
//           fontWeight: 500,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: "6px",
//           transition: "background 0.1s ease",
//         }}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.background = "#1177bb";
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.background = "#0e639c";
//         }}
//       >
//         <span style={{ fontSize: "14px" }}>+</span> New File
//       </button>
//     </div>
//   );
// }
