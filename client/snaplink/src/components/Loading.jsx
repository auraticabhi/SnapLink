import { FadeLoader } from "react-spinners";
import { useSelector } from "react-redux";

function Loading() {
  const mode = useSelector((state) => state.mode);
  const bgColor = mode === "dark" ? "bg-gray-950" : "bg-gray-200";
  const textColor = mode === "dark" ? "#ffffff" : "#000000";

  const fullScreenStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backdropFilter: "blur(64px)",
  };

  return (
    <div className={`h-screen absolute z-50 ${bgColor}`} style={fullScreenStyle}>
      <div className={`flex items-center justify-center h-full`}>
        <FadeLoader color={textColor} />
      </div>
    </div>
  );
}

export default Loading;
