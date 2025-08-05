// InvoicePDFSection3.tsx
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { baseFont, commonStyles } from './PDFStyles';

export default function InvoicePDFSection3({ data }: any) {
    const GIA = data.GIANATURALDIAMONDGRADINGREPORT || {};
    const GRADING = data.GRADINGRESULTS || {};
    const ADDITIONAL = data.ADDITIONALGRADINGINFORMATION || {};
    const SYMBOLS = data.symbols || [];

    const reportNo = GIA.GIAReportNumber || '--';
    const shape = GIA.ShapeandCuttingStyle || '--';
    const measurements = GIA.Measurements || '--';

    const carat = GRADING.CaratWeight || '--';
    const color = GRADING.ColorGrade || '--';
    const clarity = GRADING.ClarityGrade || '--';
    const cut = GRADING.CutGrade || '--';

    const polish = ADDITIONAL.polish || '--';
    const symmetry = ADDITIONAL.symmetry || '--';
    const fluorescence = ADDITIONAL.fluorescence || '--';
    const inscription = ADDITIONAL.inscription || '--';

    const clarityChar = SYMBOLS.length > 0 ? SYMBOLS[0]?.name?.replace(/\n/g, ', ') : '--';

    const todayDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return (
        <View>
            <View>
                <Text style={styles.fieldLabel}>{data.ReportDate}</Text>
            </View>

            <View style={{
                flexDirection: "row",
                alignItems: "baseline",
                width: "100%",
            }}>
                <Text style={styles.fieldLabel}>Report Type</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{data.ReportType}</Text>
            </View>

            <View style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: '7.48px',
                width: "100%",
            }}>
                <Text style={styles.fieldLabel}>GIA Report No</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{reportNo}</Text>
            </View>
            <View style={{ marginTop: '7.40px' }}>
                <Text style={{
                    fontFamily: baseFont,
                    fontWeight: "bold",
                    fontSize: 5,
                    color: "#000",
                    letterSpacing: "-0.20",
                    textAlign: 'left'
                }}>
                    {shape}
                </Text>
            </View>
            <View style={{ marginTop: '1.30px' }}>
                <Text style={{
                    fontFamily: baseFont,
                    fontWeight: "bold",
                    fontSize: 5,
                    color: "#000",
                    letterSpacing: "-0.20",
                    textAlign: 'left'
                }}>
                    {shape}
                </Text>
            </View>
            <View style={{ marginTop: '1px' }}>
                <View style={[styles.fieldRow]}>
                    <Text style={styles.fieldLabel}>Carat Weight</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{carat}</Text>
                </View>
                <View style={[styles.fieldRow]}>
                    <Text style={styles.fieldLabel}>Color</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{color}</Text>
                </View>
                <View style={[styles.fieldRow, { marginTop: 1 }]}>
                    <Text style={styles.fieldLabel}>Clarity</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{clarity}</Text>
                </View>
                <View style={[styles.fieldRow, { marginTop: '0.60px' }]}>
                    <Text style={styles.fieldLabel}>Cut</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{cut}</Text>
                </View>
            </View>

            <View style={{ marginTop: '0.36px' }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.fieldValue}>TBL: {data.TBL}%</Text>
                    <View style={{ width: 10 }} />
                    <Text style={styles.fieldValue}>TD: {data.TD}%</Text>
                </View>
                <View style={{ flexDirection: 'row', marginTop: '1px' }}>
                    <Text style={styles.fieldValue}>CA: {data.CA}&#176;</Text>
                    <View style={{ width: 15 }} />
                    <Text style={styles.fieldValue}>PA: {data.PA}&#176;</Text>
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <Text style={styles.fieldValue}>ST: {data.ST}%</Text>
                    <View style={{ width: 16 }} />
                    <Text style={styles.fieldValue}>LH: {data.LH}%</Text>
                </View>
                <View style={[styles.fieldRow]}>
                    <Text style={styles.fieldLabel}>Girdle</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{data.ClarityGrade}</Text>
                </View>
                <View style={[styles.fieldRow, { marginTop: '1px' }]}>
                    <Text style={styles.fieldLabel}>Culet</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{data.CutGrade || '--'}</Text>
                </View>
                <View style={[styles.fieldRow, { marginTop: '0.40px' }]}>
                    <Text style={styles.fieldLabel}>Polish</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{polish}</Text>
                </View>
                <View style={[styles.fieldRow, { marginTop: '1px' }]}>
                    <Text style={styles.fieldLabel}>Symmetry</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{symmetry}</Text>
                </View>
                <View style={[styles.fieldRow, { marginTop: '0.30px' }]}>
                    <Text style={styles.fieldLabel}>Fluorescence</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{fluorescence}</Text>
                </View>
            </View>
            <View style={{ marginTop: '2px' }}>
                <View>
                    <Text style={{
                        fontFamily: baseFont,
                        fontWeight: "bold",
                        fontSize: 5,
                        color: "#000",
                        textAlign: "left",
                        letterSpacing: "-0.20",
                    }}>
                        Clarity char:  Pinpoint
                    </Text>
                </View>
                <View>
                    <Text style={{
                        fontFamily: baseFont,
                        fontWeight: "bold",
                        fontSize: 5,
                        color: "#000",
                        textAlign: "left",
                        letterSpacing: "-0.20",
                    }}>
                        Ins:GIA {reportNo}
                    </Text>
                </View>
                <View style={{ marginTop: '1.5px' }}>
                    {/* <Text style={{ fontSize: 5, fontFamily: baseFont }}>{data.clarityNote || "---"}</Text> */}
                    <Text style={{
                        fontFamily: baseFont,
                        fontWeight: "bold",
                        fontSize: 5,
                        color: "#000",
                        textAlign: "left",
                        letterSpacing: "-0.20",
                    }}>
                        Addition pinpoint are not {"\n"}
                        shown.
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fieldRow: {
        flexDirection: "row",
        alignItems: "baseline",
        width: "100%",
    },
    fieldLabel: {
        fontFamily: baseFont,
        fontWeight: "bold",
        fontSize: 5,
        color: "#333",
        letterSpacing: "-0.20",
    },
    ReportDate: {
        fontFamily: baseFont,
        fontWeight: "bold",
        fontSize: 5,
        color: "#333",
    },
    separator: {
        flexGrow: 1,
        borderBottom: "1px dotted #999",
        marginHorizontal: "2px",
        height: '5.70px',
    },
    fieldValue: {
        fontFamily: baseFont,
        fontWeight: "bold",
        fontSize: 5,
        color: "#000",
        textAlign: "right",
        letterSpacing: "-0.20",
    },
    miniField: {
        fontSize: 5,
        fontFamily: baseFont
    }
})