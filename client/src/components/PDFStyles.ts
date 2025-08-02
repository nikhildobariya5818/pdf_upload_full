// PDFStyles.ts
import { StyleSheet } from "@react-pdf/renderer";

export const baseFont = "Helvetica";

export const commonStyles = StyleSheet.create({
  sectionContainer: {
    // padding: 20,
    // paddingHorizontal: 20,
    // marginBottom: 10,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 6,
    width: "100%",
  },
  fieldLabel: {
    fontFamily: baseFont,
    fontSize: 9,
    color: "#333",
    letterSpacing: "-0.40",
  },
  ReportDate: {
    fontFamily: baseFont,
    fontSize: 9,
    color: "#333",
    marginBottom: 5,
    letterSpacing: "-0.40",
  },
  separator: {
    flexGrow: 1,
    borderBottom: "1px dotted #999",
    marginHorizontal: 4,
    height: 10,
  },
  fieldValue: {
    fontFamily: baseFont,
    fontSize: 9,
    color: "#000",
    textAlign: "right",
    letterSpacing: "-0.40",
  },
  headerText: {
    fontFamily: baseFont,
    fontSize: 12,
    marginBottom: 10,
  },
  commentText: {
    fontFamily: baseFont,
    fontSize: 10,
    marginTop: 8,
    color: "#000",
    lineHeight: 1.3,
  },
  boldText: {
    fontSize: 10,
    color: "#000",
  },
  barcodeImage: {
    width: 100,
    height: 30,
    objectFit: "contain",
  },
  paragraphText: {
    fontFamily: baseFont,
    fontSize: 10,
    color: "#000",
    lineHeight: 1.3,
  },
  AddressText: {
    fontFamily: baseFont,
    fontSize: 10,
    color: "#333",
    width: "70%",
  },
});
