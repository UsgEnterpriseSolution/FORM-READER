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

export function getMockData() {
  return {
    images: ["", ""],
    fieldData: {
      employeeData: {
        employeeNo: "USG0112",
        dateOfEngagement: null,
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
          maidenSurName: null,
        },
        dateOfBirth: "23 MARCH 2001",
        nationality: "GHANAIAN",
        sex: "MALE",
        ghCard: "GA-7274169556",
        ssnit: null,
        bankers: null,
        nameOfSpouse: {
          isMarried: false,
          surName: null,
          firstName: null,
          middleName: null,
          otherName: null,
        },
        contact: {
          postal: null,
          email: "edwinotumartinson@outlook.com",
          mobilePhone: "+233242430112",
          homePhone: null,
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
            middleName: null,
            otherName: null,
          },
          relationship: "BROTHER",
          address: "AO-0458944",
          phoneNo: "0207111985 (+233)",
        },
        emmergencyContact: {
          name: {
            surName: "MARTINSON",
            firstName: "CYNTHIA",
            middleName: null,
            otherName: null,
          },
          relationship: "MOTHER",
          address: "AO-0458944",
          phoneNo: "+233243115860",
        },
      },
    },
  };
}
