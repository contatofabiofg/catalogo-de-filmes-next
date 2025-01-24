import { StylesConfig } from "react-select"; 

export const stylesInputSelect: StylesConfig = {
    singleValue: (base) => ({
      ...base,
      color: "#cecece",
    }),
    input: (base) => ({
      ...base,
      color: "#cecece",
    }),
    control: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: "#3f3f46",
      outline: "none",
      border: "none",
      color: "#cecece",
      boxShadow: "none",
    }),
    option: (baseStyles) => ({
      ...baseStyles,
      backgroundColor: "#3f3f46",
      color: "#cecece",
      cursor: "pointer",
      padding: 10,
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#3f3f46",
      marginTop: 0,
      borderRadius: 5,
    }),
  }