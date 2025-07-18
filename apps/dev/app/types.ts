//   {
//     name: "document.pdf",
//     size: 528737,
//     type: "application/pdf",
//     url: "https://originui.com",
//     id: "document.pdf-1744638436563-8u5xuls",
//   },

export type ImgUpload = {
  imgId: string;
  imgDataUrl: string;
};

type PhoneNo = {
  code: number;
  number: number;
} | null;

export type FormData = {
  employeeData: {
    employeeNo: string | null;
    dateOfEngagement: string | null;
    subsidiary: string | null;
    department: string | null;
    subunit: string;
  };
  personalData: {
    name: {
      surName: string | null;
      firstName: string | null;
      middleName: string | null;
      otherName: string | null;
    } | null;
    maidenSurName: string | null;
    dateOfBirth: string | null;
    nationality: string | null;
    sex: "MALE" | "FEMALE";
    ghCard: string | null;
    ssnit: string | null;
    bankers: string | null;
    isMarried: boolean;
    nameOfSpouse: string | null;
    postal: string | null;
    contact: {
      email: string | null;
      mobilePhone: PhoneNo;
      homePhone: PhoneNo;
    };
    homeTown: string | null;
    residentialAddress: string | null;
    education: {
      qualification: string | null;
      institution: string | null;
    };
    nextOfKin: {
      name: {
        surName: string | null;
        firstName: string | null;
        middleName: string | null;
        otherName: string | null;
      };
      relationship: string | null;
      address: string | null;
      phoneNo: PhoneNo;
    };
    emmergencyContact: {
      name: {
        surName: string | null;
        firstName: string | null;
        middleName: string | null;
        otherName: string | null;
      };
      relationship: string | null;
      address: string | null;
      phoneNo: PhoneNo;
    };
  };
};
