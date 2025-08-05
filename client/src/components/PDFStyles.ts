// PDFStyles.ts
import { StyleSheet } from "@react-pdf/renderer";

export const baseFont = "DINPro";

export const commonStyles = StyleSheet.create({
  fieldRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: "3.5px",
    width: "100%",
  },
  fieldLabel: {
    fontFamily: baseFont,
    fontWeight: "normal",
    fontSize: 9,
    color: "#333",
    letterSpacing: "-0.20",
  },
  ReportDate: {
    fontFamily: baseFont,
    fontWeight: "normal",
    fontSize: 9,
    color: "#333",
    marginBottom: 5,
  },
  separator: {
    flexGrow: 1,
    borderBottom: "1px dotted #000",
    marginHorizontal: "2px",
    height: 10,
  },
  fieldValue: {
    fontFamily: baseFont,
    fontWeight: "bold",
    fontSize: 9,
    color: "#000",
    textAlign: "right",
    letterSpacing: "-0.20",
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
    width: "80%",
    height: "100%",
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
