import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetRolesQuery } from "../../redux/roles/rolesSlice";
import { useGetUsersQuery } from "../../redux/users/usersSlice";
import { useGetTeamsQuery } from "../../redux/teams/teamsSlice";
import { useGetLNGQuery } from "../../redux/languages/languagesSlice";
import { useGetAddressQuery } from "../../redux/addresses/addressesSlice";
import { useGetArticlesQuery } from "../../redux/articles/articlesSlice";
import { useGetCurrencyQuery } from "../../redux/currencies/currenciesSlice";
import { useGetUnitQuery } from "../../redux/units/unitsSlice";
import { useGetDevelopersQuery } from "../../redux/developers/developersSlice";
import { useGetCategoryQuery } from "../../redux/categories/categoriesSlice";
const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    data: roles,
    isLoading: rolesIsLoading,
    isFetching: rolesIsFetching,
    isError: rolesIsError,
    error: rolesError,
    isSuccess: rolesIsSuccess,
  } = useGetRolesQuery();
  const {
    data: users,
    isLoading: usersIsLoading,
    isFetching: usersIsFetching,
    isError: usersIsError,
    error: usersError,
    isSuccess: usersIsSuccess,
  } = useGetUsersQuery();
  const {
    data: teams,
    isLoading: teamsIsLoading,
    isFetching: teamsIsFetching,
    isError: teamsIsError,
    error: teamsError,
    isSuccess: teamsIsSuccess,
  } = useGetTeamsQuery();
  const {
    data: lngs,
    isLoading: lngsIsLoading,
    isFetching: lngsIsFetching,
    isError: lngsIsError,
    error: lngsError,
    isSuccess: lngsIsSuccess,
  } = useGetLNGQuery();
  const {
    data: addresses,
    isLoading: addressesIsLoading,
    isFetching: addressesIsFetching,
    isError: addressesIsError,
    error: addressesError,
    isSuccess: addressesIsSuccess,
  } = useGetAddressQuery();
  const {
    data: articles,
    isLoading: articlesIsLoading,
    isFetching: articlesIsFetching,
    isError: articlesIsError,
    error: articlesError,
    isSuccess: articlesIsSuccess,
  } = useGetArticlesQuery();
  const {
    data: currencies,
    isLoading: currenciesIsLoading,
    isFetching: currenciesIsFetching,
    isError: currenciesIsError,
    error: currenciesError,
    isSuccess: currenciesIsSuccess,
  } = useGetCurrencyQuery();
  const {
    data: units,
    isLoading: unitsIsLoading,
    isFetching: unitsIsFetching,
    isError: unitsIsError,
    error: unitsError,
    isSuccess: unitsIsSuccess,
  } = useGetUnitQuery();
  const {
    data: developers,
    isLoading: developersIsLoading,
    isFetching: developersIsFetching,
    isError: developersIsError,
    error: developersError,
    isSuccess: developersIsSuccess,
  } = useGetDevelopersQuery();
  const {
    data: categories,
    isLoading: categoriesIsLoading,
    isFetching: categoriesIsFetching,
    isError: categoriesIsError,
    error: categoriesError,
    isSuccess: categoriesIsSuccess,
  } = useGetCategoryQuery();

  const Card = ({ title, count, aCount, navigateLink, loading }) => {
    return (
      <div
        onClick={() => navigate(navigateLink)}
        className={`${
          loading && "animate-pulse"
        }  flex flex-col justify-between items-start rounded-2xl bg-secondary text-third  shadow-2xl p-8 w-[350px] h-[300px] cursor-pointer transition-all duration-500 group hover:shadow-secondary relative overflow-hidden`}
      >
        <div className="h-full w-full rounded-full group-hover:bg-primary blur-[120px] absolute -top-[40%] -left-[40%] transition-all duration-700" />

        <p className="text-4xl font-bold uppercase group-hover:text-secondary z-20 transition-all duration-700">
          {title}
        </p>
        {!loading && (
          <div
            className={`flex ${
              aCount >= 0 ? "justify-between" : "justify-end"
            }  items-end w-full `}
          >
            {aCount >= 0 && (
              <div className="text-7xl font-bold self-end space-y-2 drop-shadow-2xl">
                <p className="text-center ">{aCount}</p>
                <p className="text-small"> Active </p>
              </div>
            )}
            <p className="text-9xl font-bold self-end drop-shadow-2xl group-hover:scale-110 transition-all duration-300">
              <span className="text-med">Total </span>
              {count}
            </p>
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="w-full grid lg:grid-cols-2 xl:grid-cols-4 2xl:gap-x-16 gap-x-12 gap-y-8 px-[5%] place-items-center my-8">
      <Card
        title={"Roles"}
        count={roles?.count}
        aCount={roles?.activeCount}
        navigateLink={"/roles"}
        loading={rolesIsLoading}
      />
      <Card
        title={"Users"}
        count={users?.count}
        aCount={users?.activeCount}
        navigateLink={"/users"}
        loading={usersIsLoading}
      />
      <Card
        title={"Teams"}
        count={teams?.count}
        aCount={teams?.activeCount}
        navigateLink={"/teams"}
        loading={teamsIsLoading}
      />
      <Card
        title={"Languages"}
        count={lngs?.count}
        aCount={lngs?.activeCount}
        navigateLink={"/lngs"}
        loading={lngsIsLoading}
      />
      <Card
        title={"Addresses"}
        count={addresses?.count}
        aCount={addresses?.activeCount}
        navigateLink={"/address"}
        loading={addressesIsLoading}
      />
      <Card
        title={"Articles"}
        count={articles?.count}
        aCount={articles?.activeCount}
        navigateLink={"/articles"}
        loading={articlesIsLoading}
      />
      <Card
        title={"Currencies"}
        count={currencies?.count}
        aCount={currencies?.activeCount}
        navigateLink={"/currency"}
        loading={currenciesIsLoading}
      />
      <Card
        title={"Units"}
        count={units?.count}
        aCount={units?.activeCount}
        navigateLink={"/unit"}
        loading={unitsIsLoading}
      />
      <Card
        title={"Developers"}
        count={developers?.count}
        aCount={developers?.activeCount}
        navigateLink={"/developers"}
        loading={developersIsLoading}
      />
      <Card
        title={"Cateogries"}
        count={categories?.count}
        aCount={categories?.activeCount}
        navigateLink={"/category"}
        loading={categoriesIsLoading}
      />
    </div>
  );
};
export default DashboardPage;
