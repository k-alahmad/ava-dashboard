import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  const Card = ({ title, count, aCount, navigateLink, loading }) => {
    return (
      <div
        onClick={() => navigate(navigateLink)}
        className={`${
          loading && "animate-pulse"
        }  flex flex-col justify-between items-start rounded-2xl bg-secondary text-third hover:text-brwon shadow-2xl  p-8 w-[420px] h-[300px] cursor-pointer transition-all duration-500 group hover:shadow-secondary hover:bg-gradiant`}
      >
        <p className="text-4xl font-bold uppercase">{title}</p>
        {!loading && (
          <div
            className={`flex ${
              aCount >= 0 ? "justify-between" : "justify-end"
            }  items-end w-full `}
          >
            {aCount >= 0 && (
              <div className="text-7xl font-bold self-end space-y-2 text-third drop-shadow-2xl">
                <p className="text-center ">{aCount}</p>
                <p className="text-small"> Active </p>
              </div>
            )}
            <p className="text-9xl font-bold self-end text-third drop-shadow-2xl group-hover:scale-110 transition-all duration-300">
              <span className="text-med">Total </span>
              {count}
            </p>
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="flex flex-col justify-start items-center xl:px-[1%] 2xl:px-[5%] mt-12 h-screen">
      <div className=" grid lg:grid-cols-2 xl:grid-cols-3 2xl:gap-x-20 gap-x-12 gap-y-8"></div>
    </div>
  );
};
export default DashboardPage;
