import article from "../assets/icons/article-icon.svg";
import currency from "../assets/icons/currency-icon.svg";
import ruler from "../assets/icons/ruler-icon.svg";
import developer from "../assets/icons/settings-person-icon.svg";
import address from "../assets/icons/location-house-icon.svg";
import users from "../assets/icons/persons2-icon.svg";
import teams from "../assets/icons/persons-icon.svg";
import access from "../assets/icons/persons3-icon.svg";
import permissions from "../assets/icons/key2-icon.svg";
import dashboard from "../assets/icons/win-icon.svg";
import page from "../assets/icons/page2.svg";
import announcement from "../assets/icons/notification-icon.svg";
import category from "../assets/icons/category-icon.svg";
import amenities from "../assets/icons/amenity-icon.svg";
import property from "../assets/icons/house-icon.svg";
import settings from "../assets/icons/settings-icon.svg";
import language from "../assets/icons/language.svg";
import meta from "../assets/icons/meta-data-icon.svg";
import blog from "../assets/icons/blog.svg";
import application from "../assets/icons/application.svg";
import jobs from "../assets/icons/jobs.svg";
import jobsMain from "../assets/icons/jobs-main.svg";
import enquiry from "../assets/icons/guest-info-icon.svg";
import feedback from "../assets/icons/feedback.svg";
import listing from "../assets/icons/listings-icon.svg";
import forms from "../assets/icons/forms.svg";
import userInfo from "../assets/icons/user-info.svg";
import paymentplan from "../assets/icons/paymentplan.svg";
import invite from "../assets/icons/invite.svg";

export const data = [
  { icon: dashboard, name: "Dashboard", link: "/" },
  {
    icon: property,
    name: "Properties Management",
    childs: [
      {
        icon: property,
        name: "Properties",
        link: "/property",
      },
      {
        icon: paymentplan,
        name: "Payment Plans",
        link: "/payment-plan",
      },
    ],
  },
  {
    icon: access,
    name: "Access",
    childs: [
      {
        icon: permissions,
        name: "Roles",
        link: "/roles",
      },
      {
        icon: users,
        name: "Users",
        link: "/users",
      },
      { icon: teams, name: "Teams", link: "/teams" },
    ],
  },
  {
    icon: page,
    name: "Page Management",
    childs: [
      { icon: address, name: "Addresses", link: "/address" },
      { icon: category, name: "Categories", link: "/category" },
      { icon: developer, name: "Developers", link: "/developers" },
      { icon: amenities, name: "Amenities", link: "/amenities" },
      { icon: announcement, name: "Announcements", link: "/announcements" },
    ],
  },
  {
    icon: settings,
    name: "Settings",
    childs: [
      { icon: language, name: "Languages", link: "/lngs" },
      { icon: currency, name: "Currencies", link: "/currency" },
      { icon: ruler, name: "Units", link: "/unit" },
      // { icon: meta, name: "Meta Data", link: "/meta-data" },
    ],
  },
  {
    icon: blog,
    name: "Blog",
    childs: [{ icon: article, name: "Articles", link: "/articles" }],
  },
  {
    icon: jobsMain,
    name: "Jobs & Applications",
    childs: [
      { icon: jobs, name: "Jobs", link: "/jobs" },
      { icon: application, name: "Applications", link: "/applicants" },
    ],
  },
  {
    icon: forms,
    name: "Forms",
    childs: [
      { icon: userInfo, name: "Guest Information", link: "/guest-info" },
      { icon: feedback, name: "Guest Feedback", link: "/feedback" },
      { icon: enquiry, name: "Guest Enquiries", link: "/enquiry" },
      { icon: listing, name: "Guest Listing", link: "/list-with-us" },
      { icon: invite, name: "Open House", link: "/open-house" },
    ],
  },
];
