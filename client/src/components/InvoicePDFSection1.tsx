// InvoicePDFSection1.tsx
import { View, Text } from "@react-pdf/renderer";
import { baseFont, commonStyles } from "./PDFStyles";

export default function InvoicePDFSection1({ data }: any) {
    const report = data.GIANATURALDIAMONDGRADINGREPORT || {};
    const grading = data.GRADINGRESULTS || {};
    const additional = data.ADDITIONALGRADINGINFORMATION || {};
    return (
        <>

            <View>
                {data.ReportDate && (
                    <Text style={{
                        fontFamily: baseFont,
                        fontWeight: "normal",
                        fontSize: 9,
                        color: "#333",
                        marginBottom: '4px',
                        letterSpacing: "-0.20",
                    }}>{data.ReportDate}</Text>
                )}
                <View style={commonStyles.fieldRow}>
                    <Text style={commonStyles.fieldLabel}>GIA Report Number</Text>
                    <View style={commonStyles.separator} />
                    <Text style={commonStyles.fieldValue}>{report.GIAReportNumber}</Text>
                </View>
                <View style={commonStyles.fieldRow}>
                    <Text style={commonStyles.fieldLabel}>Shape and Cutting Style</Text>
                    <View style={commonStyles.separator} />
                    <Text style={commonStyles.fieldValue}>{report.ShapeandCuttingStyle}</Text>
                </View>

                <View style={commonStyles.fieldRow}>
                    <Text style={commonStyles.fieldLabel}>Measurements</Text>
                    <View style={commonStyles.separator} />
                    <Text style={commonStyles.fieldValue}>{report.Measurements}</Text>
                </View>
                {/* Spacer */}
                <View style={{ height: '34px' }} />
                <View style={commonStyles.fieldRow}>
                    <Text style={commonStyles.fieldLabel}>Carat Weight</Text>
                    <View style={commonStyles.separator} />
                    <Text style={commonStyles.fieldValue}>{grading.CaratWeight}</Text>
                </View>

                <View style={commonStyles.fieldRow}>
                    <Text style={commonStyles.fieldLabel}>Color Grade</Text>
                    <View style={commonStyles.separator} />
                    <Text style={commonStyles.fieldValue}>{grading.ColorGrade}</Text>
                </View>

                <View style={commonStyles.fieldRow}>
                    <Text style={commonStyles.fieldLabel}>Clarity Grade</Text>
                    <View style={commonStyles.separator} />
                    <Text style={commonStyles.fieldValue}>{grading.ClarityGrade}</Text>
                </View>

                {/* <View style={commonStyles.fieldRow}>
                    <Text style={commonStyles.fieldLabel}>Cut Grade</Text>
                    <View style={commonStyles.separator} />
                    <Text style={commonStyles.fieldValue}>{grading.CutGrade}</Text>
                </View> */}
                {/* {grading.CutGrade ? (
                    <View style={commonStyles.fieldRow}>
                        <Text style={commonStyles.fieldLabel}>Cut Grade</Text>
                        <View style={commonStyles.separator} />
                        <Text style={commonStyles.fieldValue}>{grading.CutGrade}</Text>
                    </View>
                ) : (
                    <View style={[commonStyles.fieldRow, { visibility: "hidden" }]}>
                        <Text style={commonStyles.fieldLabel}>.</Text>
                        <View style={commonStyles.separator} />
                        <Text style={commonStyles.fieldValue}> </Text>
                    </View>
                )} */}
                <View style={commonStyles.fieldRow}>
                    {/* {grading.CutGrade ? ( */}
                    {/* // <> */}
                    {data.cutGrade ?
                        <>
                            <Text style={commonStyles.fieldLabel}>Cut Grade</Text>
                            <View style={commonStyles.separator} />
                            <Text style={commonStyles.fieldValue}>{data.cutGrade}</Text></> : ''}
                    {/* </> */}
                    {/* // ) : ( */}
                    {/* //     <>
                    //         <Text style={[commonStyles.fieldLabel, { color: 'transparent' }]}>Cut Grade</Text>
                    //         {/* <View style={commonStyles.separator} /> */}
                    {/* //         <Text style={[commonStyles.fieldValue, { color: 'transparent' }]}>-</Text> */}
                    {/* //     </> */}
                    {/* // )} */}
                </View>


                {/* Spacer */}
                {/* <View style={{ height: 34 }} /> */}
                <View style={{ height: data.cutGrade ? 34 : 45 }} />
                <View style={commonStyles.fieldRow}>
                    <Text style={commonStyles.fieldLabel}>Polish</Text>
                    <View style={commonStyles.separator} />
                    <Text style={commonStyles.fieldValue}>{additional.polish}</Text>
                </View>

                <View style={commonStyles.fieldRow}>
                    <Text style={commonStyles.fieldLabel}>Symmetry</Text>
                    <View style={commonStyles.separator} />
                    <Text style={commonStyles.fieldValue}>{additional.symmetry}</Text>
                </View>

                <View style={[commonStyles.fieldRow, { marginBottom: 2 }]}>
                    <Text style={commonStyles.fieldLabel}>Fluorescence</Text>
                    <View style={commonStyles.separator} />
                    <Text style={commonStyles.fieldValue}>{additional.fluorescence}</Text>
                </View>

                <View style={[commonStyles.fieldRow, { marginBottom: '2.5px' }]}>
                    <Text style={commonStyles.fieldLabel}>Inscription(s): </Text>
                    <Text style={[commonStyles.fieldLabel,]}>GIA  {report.GIAReportNumber}</Text>
                </View>
                {data.comments && <View style={[commonStyles.fieldRow]}>
                    <Text style={[commonStyles.fieldValue, { textAlign: 'left' }]}>Comments: </Text>
                    <Text style={[commonStyles.fieldLabel, { marginLeft: '1px' }]}> {data.comments}</Text>
                </View>}
            </View>
        </>
    );
}
