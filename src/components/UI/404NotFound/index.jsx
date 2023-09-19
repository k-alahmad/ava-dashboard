import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
const NotFound404 = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  return (
    <main className="flex flex-row justify-center items-center min-h-screen">
      <div className=" font-fbold">
        {i18n.language === "en" ? (
          <>
            <div
              onClick={() => navigate(-1)}
              className="underline hover:text-blue cursor-pointer text-2xl flex justify-start items-center"
            >
              <ArrowBackIosNewIcon />
              <p>Go Back</p>
            </div>
            <p className="text-7xl p-40 text-brwon]">404 Page Not Found!</p>
          </>
        ) : (
          <div dir="rtl">
            <div
              className="underline hover:text-blue cursor-pointer text-2xl flex justify-start items-center"
              onClick={() => navigate(-1)}
            >
              <ArrowForwardIosIcon />
              <p>{"عودة"}</p>
            </div>
            <p className="text-7xl p-40 text-brwon">
              لم يتم العثور على الصفحة 404
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default NotFound404;
