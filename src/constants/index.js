// export const API_BASE_URL = "http://localhost:3500/";
export const API_BASE_URL = "https://api.avarealestate.ae/";

export const Gender = ["Male", "Female"];
export const Purpose = ["Rent", "Buy"];
export const RentFrequency = ["Yearly", "Monthly", "Weekly", "Daily"];
export const CompletionStatus = ["Ready", "OffPlan"];
export const FurnishingStatus = [
  "Furnished",
  "Semi furnished",
  "Not furnished",
];
export const VacantStatus = ["Yes", "No"];
export const Announcement_Type = ["Normal", "Popup"];
export const Directions = ["ltr", "rtl"];
export const Language_Lvl = [
  {
    value: "None",
    lng: { en: "No proficiency", ar: "لا يوجد" },
  },
  {
    value: "A1",
    lng: { en: "Beginner", ar: "مبتدئ" },
  },
  {
    value: "A2",
    lng: {
      en: "Pre-intermediate",
      ar: "ما قبل المتوسط",
    },
  },
  {
    value: "B1",
    lng: {
      en: "Intermediate",
      ar: "متوسط",
    },
  },
  {
    value: "B2",
    lng: {
      en: "Upper-intermediate",
      ar: "وسيط ذو مستوي رفيع",
    },
  },
  {
    value: "C1",
    lng: {
      en: "Advanced",
      ar: "متقدم",
    },
  },
  {
    value: "C2",
    lng: {
      en: "Native or Bilingual",
      ar: "أصلية أو ثنائية اللغة",
    },
  },
];
