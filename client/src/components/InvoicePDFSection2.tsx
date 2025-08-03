// InvoicePDFSection2.tsx
import {
    View,
    Text,
    Image,
    StyleSheet,
} from '@react-pdf/renderer';
import { baseFont, commonStyles } from './PDFStyles';
import { BASE_URL } from './ReportProcessor';
import InvoicePDFSection3 from './InvoicePDFSection3';

const styles = StyleSheet.create({
    diagramImage: {
        width: 90,
        height: 80,
        // marginVertical: 8,
    },
    imageWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    fieldLabel: {
        fontFamily: baseFont,
        fontWeight: "normal",
        // fontSize: 9,
        fontSize: 8,
        color: "#333",
        // fontWeight: "600",
        // letterSpacing: "-0.40",
    },
    fieldValue: {
        fontFamily: baseFont,
        fontWeight: "bold",
        fontSize: 8,
        color: "#000",
        textAlign: "right",
        // letterSpacing: "-0.40",
    },
    separator: {
        flexGrow: 1,
        borderBottom: "1px dotted #999",
        // marginHorizontal: 4,
        // height: 10,
    },
    fieldRow: {
        flexDirection: "row",
        // alignItems: "baseline",
        // marginBottom: "3.5px",
        marginTop: "2px",
        width: "100%",
    },
    ReportDate: {
        fontFamily: baseFont,
        fontWeight: "normal",
        fontSize: 11,
        color: "#333",
        // marginBottom: 5,
        marginTop: '15px',
        // letterSpacing: "-0.40",
    },
});

export default function InvoicePDFSection2({ data }: any) {
    const report = data.GIANATURALDIAMONDGRADINGREPORT || {};
    const grading = data.GRADINGRESULTS || {};
    const additional = data.ADDITIONALGRADINGINFORMATION || {};
    const barcode12Number = data.BARCODE12.number
    //  || data.BARCODE10 || {};
    const barcode10Number = data.BARCODE10.number
    const proportionsImage = data.PROPORTIONS;
    const clarityImage = data.CLARITYCHARACTERISTICS;
    const claritySymbols = data.symbols?.[0]?.name?.replace(/\n/g, ', ') || 'Pinpoint, Feather';

    const jobNumber = Math.floor(10000000 + Math.random() * 90000000); // Ensures 8-digit number
    const orCode = Math.floor(10 + Math.random() * 90); // Ensures 2-digit number

    return (
        <View>

            <View>
                {barcode12Number && (
                    <Image src={`${BASE_URL}/files/barcode12.png`} style={commonStyles.barcodeImage} />
                )}
                <Text style={[styles.ReportDate]}>{barcode12Number}</Text>
            </View>

            <View style={{
                flexDirection: "row",
                alignItems: "baseline",
                // marginBottom: "3.5px",
                // marginTop: "2px",
                width: "100%",
            }}>
                <Text style={styles.fieldLabel}>JOB:</Text>
                <Text style={styles.fieldLabel}>{jobNumber}</Text>
                <View style={{
                    flexGrow: 1,
                    //  marginHorizontal: 4,
                    height: 8,
                }} />
                <Text style={styles.fieldLabel}>{orCode}</Text>
            </View>

            <View style={{ height: '9px' }} />
            {/* <Text>{data.reportDate  'February 12, 2024'}</Text> */}
            <Text style={[styles.fieldLabel, {}]}>{data.ReportDate}</Text>


            <View style={[styles.fieldRow, { marginTop: '-1px' }]}>
                <Text style={styles.fieldLabel}>Report Type</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{data.ReportType}</Text>
            </View>

            <View style={[styles.fieldRow, {}]}>
                <Text style={styles.fieldLabel}>GIA Report Number</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{report.GIAReportNumber}</Text>
            </View>

            <View style={[styles.fieldRow, {}]}>
                <Text style={styles.fieldLabel}>Shape</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{report.ShapeandCuttingStyle}</Text>
            </View>

            <View style={[styles.fieldRow, { marginTop: '-1px' }]}>
                <Text style={styles.fieldLabel}>Measurements</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{report.Measurements}</Text>
            </View>
            <View style={[styles.fieldRow, {}]}>
                <Text style={styles.fieldLabel}>Carat Weight</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{grading.CaratWeight}</Text>
            </View>

            <View style={[styles.fieldRow, { marginTop: '-1px' }]}>
                <Text style={styles.fieldLabel}>Color</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{grading.ColorGrade}</Text>
            </View>

            <View style={[styles.fieldRow, {}]}>
                <Text style={styles.fieldLabel}>Clarity</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{grading.ClarityGrade}</Text>
            </View>

            <View style={[styles.fieldRow, {}]}>
                <Text style={styles.fieldLabel}>Cut</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{grading.CutGrade}</Text>
            </View>

            <Text style={commonStyles.paragraphText}>Proportions:</Text>
            {proportionsImage && (
                <View style={styles.imageWrapper}>
                    <Image
                        src={`${BASE_URL}/files/clarity_characteristics.png`}
                        style={styles.diagramImage}
                    />
                </View>
            )}

            <View style={[styles.fieldRow, { marginTop: '3px', }]}>
                <Text style={styles.fieldLabel}>Polish</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{additional.polish}</Text>
            </View>

            <View style={[styles.fieldRow, {}]}>
                <Text style={styles.fieldLabel}>Symmetry</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{additional.symmetry}</Text>
            </View>

            <View style={[styles.fieldRow, {}]}>
                <Text style={styles.fieldLabel}>Fluorescence</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{additional.fluorescence}</Text>
            </View>

            <Text style={styles.fieldLabel}>Clarity Characteristics: Pinpoint, Feather</Text>
            {/* <Text style={styles.fieldLabel}>Comments: Internal graining is not shown.Inscription(s):GIA2487549646</Text> */}

            {/* 
            <View
                style={{
                    width: 300,
                    height: 200,
                    alignSelf: 'center',
                    marginTop: 40,
                    overflow: 'hidden',
                }}
            >
                <View
                    style={{
                        transform: 'rotate(-90deg)',
                        width: 200,
                        height: 300,
                    }}
                >
                    <InvoicePDFSection3 data={data} />
                </View>
            </View> */}
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 75 }}>
                <Image
                    src={`${BASE_URL}/files/barcode10.png`}
                    style={{
                        width: 100,
                        height: 10,
                        objectFit: "contain",
                    }}
                />
                <Text style={[commonStyles.ReportDate, { marginLeft: 1 }]}>
                    {data.BARCODE10.number}
                </Text>
            </View>
        </View>
    );
}
