import React from "react";

interface ReportInterface {
  date: any;
  setDate: (date: any) => any;
  heure: any;
  setHeure: (heure: any) => any;
  title: any;
  setTitle: (title: any) => any;
  description: any;
  setDescription: (description: any) => any;
  type: any;
  setType: (type: any) => any;
  image: any;
  setImage: (image: any) => any;
}

export const Report = React.createContext<ReportInterface>({
  date: new Date(),
  setDate: (date: any) => null,
  heure: new Date(),
  setHeure: (date: any) => null,
  title: null,
  setTitle: (date: any) => null,
  description: null,
  setDescription: (date: any) => null,
  type: null,
  setType: (date: any) => null,
  image: null,
  setImage: (date: any) => null,
});

interface ReportProviderProps {
  children: React.ReactNode;
}

export const ReportProvider = ({ children }: ReportProviderProps) => {
  const [date, setDate] = React.useState(new Date());
  const [heure, setHeure] = React.useState(new Date());
  const [title, setTitle] = React.useState(null);
  const [description, setDescription] = React.useState(null);
  const [type, setType] = React.useState(null);
  const [image, setImage] = React.useState(null);

  return (
    <Report.Provider
      value={{
        date,
        setDate,
        heure,
        setHeure,
        title,
        setTitle,
        description,
        setDescription,
        type,
        setType,
        image,
        setImage,
      }}
    >
      {children}
    </Report.Provider>
  );
};

export const useReport = () => {
  const context = React.useContext(Report);

  if (!context)
    throw new Error("useReport must be used within a ReportProvider.");

  return context;
};