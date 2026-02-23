import Lottie from "lottie-react";
import type { CSSProperties } from "react";

import splashAnimation from "@/assets/splash-loader.json";

const FullScreenLoader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: splashAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div style={loaderContainerStyle}>
      <Lottie
        animationData={defaultOptions.animationData}
        loop={defaultOptions.loop}
        autoplay={defaultOptions.autoplay}
        style={lottieStyle}
      />
    </div>
  );
};

const loaderContainerStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999, // Ensure it's on top of other content
};

const lottieStyle: CSSProperties = {
  width: 164, // Adjust based on your JSON's 'w' property
  height: 164, // Adjust based on your JSON's 'h' property
};

export default FullScreenLoader;
