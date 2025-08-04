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
        <View
        // style={{ padding: 20 }}

        >
            {/* Date */}
            {data.ReportDate && <Text style={styles.ReportDate}>{data.ReportDate}</Text>}

            {/* Report Type */}
            {data.ReportType && (

                <View style={[styles.fieldRow]}>
                    <Text style={styles.fieldLabel}>Report Type</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{data.ReportType}</Text>
                </View>
            )}
            {/* GIA Report No */}
            <View style={[styles.fieldRow, { marginTop: '3.8px' }]}>
                <Text style={styles.fieldLabel}>GIA Report No</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{reportNo}</Text>
            </View>

            {/* Shape */}
            <Text style={[styles.fieldValue, { textAlign: 'left', marginTop: '7px' }]}>
                {shape}
            </Text>

            {/* Measurements */}
            <Text style={[styles.fieldValue, { textAlign: 'left', marginTop: '3.6px' }]}>
                {measurements}
            </Text>

            {/* Carat Weight */}
            <View style={[styles.fieldRow, { marginBottom: '6px' }]}>
                <Text style={styles.fieldLabel}>Carat Weight</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{carat}</Text>
            </View>

            {/* Color */}
            <View style={[styles.fieldRow, { marginBottom: '13px' }]}>
                <Text style={styles.fieldLabel}>Color</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{color}</Text>
            </View>

            {/* Clarity */}
            <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Clarity</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{clarity}</Text>
            </View>

            {/* Cut */}
            <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Cut</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{cut}</Text>
            </View>

            {/* Proportions: TBL / TD */}
            {/* {<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica' }}>TBL: {data.TBL}</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica' }}>TD: {data.TD}</Text>
            </View>} */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                <Text style={styles.miniField}>TBL: {data.TBL}%</Text>
                <Text style={styles.miniField}>TD: {data.TD}%</Text>
            </View>
            {/*: CA / PA */}
            {/* {<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica' }}>CA: {data.CA}</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica' }}>PA: {data.PA}</Text>
            </View>} */}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.miniField}>
                    CA: {data.CA}&#176;
                </Text>
                <Text style={styles.miniField}>
                    PA: {data.PA}&#176;
                </Text>
            </View>

            {/*: ST / LH */}
            {/* {<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica' }}>ST: {data.ST}</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica' }}>LH: {data.LH}</Text>
            </View>} */}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 5, fontFamily: baseFont }}>ST: {data.ST}%</Text>
                <Text style={{ fontSize: 5, fontFamily: baseFont }}>LH: {data.LH}%</Text>
            </View>

            {/* Girdle */}
            {<View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Girdle</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{data.ClarityGrade || "--"}</Text>
            </View>}

            {/* Culet */}
            {<View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Culet</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{data.CutGrade || '--'}</Text>
            </View>
            }
            {/* Polish */}
            <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Polish</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{polish}</Text>
            </View>

            {/* Symmetry */}
            <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Symmetry</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{symmetry}</Text>
            </View>

            {/* Fluorescence */}
            <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Fluorescence</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{fluorescence}</Text>
            </View>

            {/* Clarity Characteristics */}
            {<Text style={{ fontSize: 5, fontFamily: baseFont, marginTop: 6 }}>
                Clarity char:  Pinpoint, Feather Internal graining is not shown.
            </Text>}

            {/* GIA Note */}
            {data.giaNote && <Text style={{ fontSize: 5, fontFamily: baseFont }}>{data.giaNote || '---'}</Text>
            }
            {/* Additional Clarity Note */}
            {data.giaNote && <Text style={{ fontSize: 5, fontFamily: baseFont }}>{data.clarityNote || "---"}</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    fieldRow: {
        flexDirection: "row",
        alignItems: "baseline",
        marginBottom: "3.5px",
        width: "100%",
    },
    fieldLabel: {
        fontFamily: baseFont,
        fontWeight: "normal",
        fontSize: 5,
        // color: "#333",
        color: 'red',
        letterSpacing: "-0.20",
    },
    ReportDate: {
        fontFamily: baseFont,
        fontWeight: "normal",
        fontSize: 5,
        color: "#333",
        // marginBottom: 5,
    },
    separator: {
        flexGrow: 1,
        borderBottom: "1px dotted #999",
        marginHorizontal: "2px",
        height: 10,
    },
    fieldValue: {
        fontFamily: baseFont,
        fontWeight: "bold",
        fontSize: 5,
        // color: "#000",
        color: 'red',
        textAlign: "right",
        letterSpacing: "-0.20",
    },
    miniField: {
        fontSize: 5,
        fontFamily: baseFont
    }
})