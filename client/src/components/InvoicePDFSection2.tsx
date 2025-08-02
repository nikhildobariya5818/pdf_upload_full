// InvoicePDFSection2.tsx
import {
    View,
    Text,
    Image,
    StyleSheet,
} from '@react-pdf/renderer';
import { commonStyles } from './PDFStyles';
import { BASE_URL } from './ReportProcessor';
import InvoicePDFSection3 from './InvoicePDFSection3';

const styles = StyleSheet.create({
    diagramImage: {
        width: 180,
        height: 120,
        // marginVertical: 8,
    },
    imageWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
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
        <View style={commonStyles.sectionContainer}>
            {/* <Text style={commonStyles.AddressText}>{data.Address}</Text> */}

            {barcode12Number && (
                <Image src={`${BASE_URL}/files/barcode12.png`} style={commonStyles.barcodeImage} />
            )}

            <Text style={[commonStyles.ReportDate, { marginBottom: '-2px' }]}>{barcode12Number}</Text>

            <View style={commonStyles.fieldRow}>
                <Text style={commonStyles.fieldLabel}>JOB:</Text>
                <Text style={commonStyles.fieldLabel}>{jobNumber}</Text>
                {/* <View style={commonStyles.separator} /> */}
                <View style={{
                    flexGrow: 1, marginHorizontal: 4,
                    height: 8,
                }} />
                <Text style={commonStyles.fieldLabel}>{orCode}</Text>
            </View>

            {/* <Text>{data.reportDate  'February 12, 2024'}</Text> */}
            <Text style={[commonStyles.fieldLabel, { marginBottom: 4, }]}>{data.ReportDate}</Text>


            <View style={[commonStyles.fieldRow, { marginBottom: '1px' }]}>
                <Text style={commonStyles.fieldLabel}>Report Type</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{data.ReportType}</Text>
            </View>

            <View style={[commonStyles.fieldRow, { marginBottom: '1px' }]}>
                <Text style={commonStyles.fieldLabel}>GIA Report Number</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{report.GIAReportNumber}</Text>
            </View>

            <View style={[commonStyles.fieldRow, { marginBottom: '1px' }]}>
                <Text style={commonStyles.fieldLabel}>Shape</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{report.ShapeandCuttingStyle}</Text>
            </View>

            <View style={[commonStyles.fieldRow, { marginBottom: '1px' }]}>
                <Text style={commonStyles.fieldLabel}>Measurements</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{report.Measurements}</Text>
            </View>
            <View style={[commonStyles.fieldRow, { marginBottom: '1px' }]}>
                <Text style={commonStyles.fieldLabel}>Carat Weight</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{grading.CaratWeight}</Text>
            </View>

            <View style={[commonStyles.fieldRow, { marginBottom: '1px' }]}>
                <Text style={commonStyles.fieldLabel}>Color</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{grading.ColorGrade}</Text>
            </View>

            <View style={[commonStyles.fieldRow, { marginBottom: '1px' }]}>
                <Text style={commonStyles.fieldLabel}>Clarity</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{grading.ClarityGrade}</Text>
            </View>

            <View style={[commonStyles.fieldRow, { marginBottom: '1px' }]}>
                <Text style={commonStyles.fieldLabel}>Cut</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{grading.CutGrade}</Text>
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

            <View style={[commonStyles.fieldRow, { marginTop: '-38px', marginBottom: '1px' }]}>
                <Text style={commonStyles.fieldLabel}>Polish</Text>
                <View style={commonStyles.separator} />
                {/* <Text style={commonStyles.fieldValue}>{additional.polish}</Text> */}
                <Text style={commonStyles.fieldValue}>{grading.ClarityGrade}</Text>
            </View>

            <View style={[commonStyles.fieldRow, { marginBottom: '1px' }]}>
                <Text style={commonStyles.fieldLabel}>Symmetry</Text>
                <View style={commonStyles.separator} />
                {/* <Text style={commonStyles.fieldValue}>{additional.symmetry}</Text> */}
                <Text style={commonStyles.fieldValue}>{grading.ClarityGrade}</Text>
            </View>

            <View style={[commonStyles.fieldRow, { marginBottom: '1px' }]}>
                <Text style={commonStyles.fieldLabel}>Fluorescence</Text>
                <View style={commonStyles.separator} />
                {/* <Text style={commonStyles.fieldValue}>{additional.fluorescence}</Text> */}
                <Text style={commonStyles.fieldValue}>{grading.ClarityGrade}</Text>
            </View>

            <Text style={commonStyles.fieldLabel}>Clarity Characteristics: Pinpoint, Feather</Text>
            {/* <Text style={commonStyles.fieldLabel}>Comments: Internal graining is not shown.Inscription(s):GIA2487549646</Text> */}

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
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 77 }}>
                <Image
                    src={`${BASE_URL}/files/barcode10.png`}
                    style={{
                        width: 120,
                        height: 20,
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
