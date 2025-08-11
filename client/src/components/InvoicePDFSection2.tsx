/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
// InvoicePDFSection2.tsx
import {
    View,
    Text,
    Image,
    StyleSheet,
} from '@react-pdf/renderer';
import { baseFont } from './PDFStyles';
import { BASE_URL } from './ReportProcessor';

const styles = StyleSheet.create({
    diagramImage: {
        width: 130,
        height: 107,
        objectFit: "contain",
    },
    imageWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    fieldLabel: {
        fontFamily: baseFont,
        fontWeight: "normal",
        fontSize: 8,
        color: "#333",
        letterSpacing: "-0.20",

    },
    fieldValue: {
        fontFamily: baseFont,
        fontWeight: "bold",
        fontSize: 8,
        color: "#000",
        textAlign: "right",
        letterSpacing: "-0.20",

    },
    separator: {
        flexGrow: 1,
        borderBottom: "1px dotted #4B4B4D",
    },
    fieldRow: {
        flexDirection: "row",
        // marginTop: "2px",
        marginRight: '2.5px',
        width: "100%",
    },
    ReportDate: {
        fontFamily: baseFont,
        fontWeight: "normal",
        fontSize: 11,
        color: "#333",
        marginTop: '15px',
    },
});

export default function InvoicePDFSection2({ data }: any) {
    const report = data.GIANATURALDIAMONDGRADINGREPORT || {};
    const grading = data.GRADINGRESULTS || {};
    const symbols = data.symbols || []
    const additional = data.ADDITIONALGRADINGINFORMATION || {};
    const barcode12Number = data.BARCODE12.number
    //  || data.BARCODE10 || {};
    const proportionsImage = data.PROPORTIONS;

    const jobNumber = Math.floor(10000000 + Math.random() * 90000000); // Ensures 8-digit number
    const orCode = Math.floor(Math.random() * 30) + 1;

    return (
        <View>
            <View>
                <Text
                    style={{
                        fontFamily: baseFont,
                        fontWeight: "normal",
                        fontSize: 7,
                        color: "#333",
                        marginBottom: -1
                    }}
                >
                    {data?.address || '\u00A0'}
                </Text>
                <Text
                    style={{
                        fontFamily: baseFont,
                        fontWeight: "normal",
                        fontSize: 7,
                        color: "#333",
                        marginBottom: -1
                    }}
                >
                    {data?.cityState || '\u00A0'}
                </Text>
                <Text
                    style={{
                        fontFamily: baseFont,
                        fontWeight: "normal",
                        fontSize: 7,
                        color: "#333",
                    }}
                >
                    {data?.country || '\u00A0'}
                </Text>
            </View>
            <View style={{
                //   width: 150, 
                // width: 100, // or whatever fixed size works best
                height: 60,
                // backgroundColor: 'red',
                position: 'absolute',
                marginTop: '-4px',
                top: '13px',
                // left: '2px',
                width: '80%',
                // justifyContent: 'flex-start',
                // marginTop: 7,
                // backgroundColor: 'red'
                // marginRight: -50
                // alignItems: 'center',
                // alignSelf: 'center' // optional: center horizontally in parent
            }}>
                <Image
                    src={`${BASE_URL}/files/barcode12.png?t=${Date.now()}`}
                    style={{
                        width: "100%",
                        // marginRight: 10,
                        //  height: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                />
            </View>
            <View style={{ marginTop: '18.5px', }}>
                <Text style={{
                    // marginLeft: "-1.9px",
                    // marginTop: '0',
                    fontSize: 11,
                    fontFamily: baseFont,
                    color: "#000",
                }}>
                    {barcode12Number}
                </Text>
            </View>

            <View style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: '1px',
                width: "100%",
            }}>
                <Text style={[styles.fieldLabel, { marginRight: 6 }]}>JOB:</Text>
                <Text style={styles.fieldLabel}>{jobNumber}</Text>
                <View style={{
                    flexGrow: 1,
                    height: 8,
                }} />
                <Text style={styles.fieldLabel}>{orCode}</Text>
            </View>

            <View style={{ height: '9px' }} />
            <Text style={[styles.fieldLabel, {}]}>{data.ReportDate}</Text>


            <View style={[styles.fieldRow, { marginBottom: 2 }]}>
                <Text style={styles.fieldLabel}>Report Type</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{data.reportType}</Text>
            </View>

            <View style={[styles.fieldRow, {}]}>
                <Text style={styles.fieldLabel}>GIA Report Number</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{report.GIAReportNumber}</Text>
            </View>

            <View style={[styles.fieldRow, { marginBottom: '1.4px' }]}>
                <Text style={styles.fieldLabel}>Shape</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{report.ShapeandCuttingStyle}</Text>
            </View>

            <View style={[styles.fieldRow, { marginBottom: '1.4px' }]}>
                <Text style={styles.fieldLabel}>Measurements</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{report.Measurements}</Text>
            </View>
            <View style={[styles.fieldRow, { marginBottom: 1 }]}>
                <Text style={styles.fieldLabel}>Carat Weight</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{grading.CaratWeight}</Text>
            </View>

            <View style={[styles.fieldRow, { marginBottom: 1 }]}>
                <Text style={styles.fieldLabel}>Color</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{grading.ColorGrade}</Text>
            </View>

            <View style={[styles.fieldRow, {}]}>
                <Text style={styles.fieldLabel}>Clarity</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{grading.ClarityGrade}</Text>
            </View>

            {grading.CutGrade && <View style={[styles.fieldRow, { marginBottom: 1 }]}>
                <Text style={styles.fieldLabel}>Cut</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{grading.CutGrade}</Text>
            </View>}

            <Text style={[styles.fieldLabel, { marginRight: 2 }]}>Proportions:</Text>
            {proportionsImage && (
                <View style={styles.imageWrapper}>
                    <Image
                        src={`${BASE_URL}/files/proportions.png?t=${Date.now()}`}
                        style={styles.diagramImage}
                    />
                </View>
            )}

            <View style={[styles.fieldRow]}>
                <Text style={styles.fieldLabel}>Polish</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{additional.polish}</Text>
            </View>

            <View style={[styles.fieldRow, { marginBottom: 1 }]}>
                <Text style={styles.fieldLabel}>Symmetry</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{additional.symmetry}</Text>
            </View>

            <View style={[styles.fieldRow, { marginBottom: 1 }]}>
                <Text style={styles.fieldLabel}>Fluorescence</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{additional.fluorescence}</Text>
            </View>

            {symbols && symbols.length > 0 && (
                <Text style={styles.fieldLabel}>
                    Clarity Characteristics: {symbols.map((s: any) => s.name.replace(/\n/g, ", ")).join(", ")}
                </Text>
            )}


            <View style={[styles.fieldRow, { marginBottom: '2px' }]}>
                <Text style={styles.fieldLabel}>Inscription(s): </Text>
                {/* <Text style={[styles.fieldLabel, { marginLeft: "1px" }]}>{additional.inscription}</Text> */}
                <Text style={[styles.fieldLabel, { marginLeft: "1px" }]}>GIA  {report.GIAReportNumber}</Text>

            </View>
            {additional.comments && <View style={[styles.fieldRow]}>
                <Text style={[styles.fieldValue, { textAlign: 'left' }]}>Comments: </Text>
                <Text style={[styles.fieldLabel, { marginLeft: '1px' }]}>{additional.comments}</Text>
            </View>}
            {/* <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: '66px', }}>
                <Image
                    src={`${BASE_URL}/files/barcode10.png`}
                    style={{
                        width: 100,
                        height: 10,
                        objectFit: "contain",
                    }}
                />
                <Text style={{
                    fontFamily: 'OCR',
                    fontWeight: "normal",
                    fontSize: 9,
                    color: "#333",
                    marginBottom: '4.9px'
                    , marginLeft: '6.6px'
                }}>
                    {data.BARCODE10.number}
                </Text>
            </View> */}
            <View
                style={{
                    position: 'absolute',
                    // bottom: 0, // or whatever exact offset you need
                    top: '393px',
                    left: 0,
                    right: 0,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Image
                    src={`${BASE_URL}/files/barcode10.png?t=${Date.now()}`}
                    style={{
                        width: 100,
                        height: 10,
                        objectFit: "contain",
                    }}
                />
                <Text
                    style={{
                        fontFamily: 'OCR',
                        fontWeight: "normal",
                        fontSize: 9,
                        color: "#333",
                        marginBottom: '4.9px',
                        marginLeft: '6.6px',
                    }}
                >
                    {data.BARCODE10.number}
                </Text>
            </View>

        </View>
    );
}
