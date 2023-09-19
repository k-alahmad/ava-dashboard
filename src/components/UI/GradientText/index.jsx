import React from "react";

const GradientText = ({ text }) => {
  return (
    <p
      style={{
        background:
          "linear-gradient(266.27deg, #845BB3 -1.84%, #A0D2EB 106.31%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent",
      }}
      className="font-bold text-mobileBig md:text-mobileHuge xl:text-big "
    >
      {text}
    </p>
  );
};

export default GradientText;
