const sampleData = {
  ReportDate: "March 02, 2022",
  GIANATURALDIAMONDGRADINGREPORT: {
    GIAReportNumber: "5426466687",
    ShapeandCuttingStyle: "Square Modified Brilliant",
    Measurements: "5.25 x 5.15 x 4.04 mm",
  },
  GRADINGRESULTS: {
    CaratWeight: "1.01 carat",
    ColorGrade: "H",
    ClarityGrade: "VS1",
    CutGrade: "12", // Updated from null to "12"
  },
  ADDITIONALGRADINGINFORMATION: {
    polish: "Excellent",
    symmetry: "Excellent",
    fluorescence: "None",
    inscription: "GIA 5426466687",
  },
  PROPORTIONS: "output/proportions.png",
  CLARITYCHARACTERISTICS: "output/clarity_characteristics.png",
  KEYTOSYMBOLS: "output/key_to_symbols.png", // Added new field
  NOTES: "output/notes.png", // Added new field
  QRCODE: "output/qrcode.png",
  symbols: [
    {
      icon: null,
      name: "Feather\nCrystal\nPinpoint",
    },
  ],
  BARCODE12: {
    number: "124099122647", // Updated barcode number
    image: "output/barcode12.png",
  },
  BARCODE10: {
    number: "1155381795", // Updated barcode number
    image: "output/barcode10.png",
  },
  TBL: "120", // Updated from "10.5"
  TD: "12", // Updated from "8.3"
  CA: "12", // Updated from "12.0"
  PA: "12", // Updated from "9.1"
  ST: "12", // Updated from "7.4"
  LH: "12", // Updated from "11.2"
  reportType: "Diamond", // Updated from "SampleType"
  comments: "This is comment", // Added new field
  address: "PLOT 23", // Updated address
  cityState: "Surat, Gujarat", // Added new field for city/state
  country: "India", // Added new field for country
  girdle: "121", // Added new field
  culet: "121", // Added new field
  cutGrade: "12",
  clarityCharacteristics: "polish", // Added new field
};

export default sampleData;
