export async function convertToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("FileReader did not return a string result."));
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

export function getMockData(images: string[]): any {
  return {
    images,
    fieldData: {
      employeeData: {
        employeeNo: "USG0112",
        dateOfEngagement: "2025-07-05",
        subsidiary: "Enterprise Solutions",
        department: "Enterprise Solutions",
        subunit: "ERP Solutions & Utils",
      },
      personalData: {
        name: {
          surName: "MARTINSON",
          firstName: "EDWIN",
          middleName: "OTU",
          otherName: "KOFI",
          maidenSurName: "",
        },
        dateOfBirth: "2001-03-23",
        nationality: "GHANAIAN",
        sex: "MALE",
        ghCard: "GA-7274169556",
        ssnit: "",
        bankers: "",
        nameOfSpouse: {
          isMarried: false,
          surName: "",
          firstName: "",
          middleName: "",
          otherName: "",
        },
        contact: {
          postal: "",
          email: "edwinotumartinson@outlook.com",
          mobilePhone: "+233242430112",
          homePhone: "",
          homeTown: "SENYA BREKU",
          residentialAddress: "GA-067-4830",
        },
        education: {
          qualification: "BACHELOR OF SCIENCE IN COMPUTING",
          institution: "UNIVERSITY OF GREENWICH",
        },
        nextOfKin: {
          name: {
            surName: "MARTINOSN",
            firstName: "KELCY AMANOR",
            middleName: "",
            otherName: "",
          },
          relationship: "BROTHER",
          address: "AO-0458944",
          phoneNo: "+233207111985",
        },
        emmergencyContact: {
          name: {
            surName: "MARTINSON",
            firstName: "CYNTHIA",
            middleName: "",
            otherName: "",
          },
          relationship: "MOTHER",
          address: "AO-0458944",
          phoneNo: "+233243115860",
        },
      },
    },
  };
}
