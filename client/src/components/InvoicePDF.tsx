// InvoicePDF.tsx
import { Document, Page, View, StyleSheet, Text } from '@react-pdf/renderer';
import InvoicePDFSection1 from './InvoicePDFSection1';
import InvoicePDFSection2 from './InvoicePDFSection2';
import InvoicePDFSection4 from './InvoicePDFSection4';
import InvoicePDFSection3 from './InvoicePDFSection3';
import { baseFont, commonStyles } from './PDFStyles';

const styles = StyleSheet.create({
    // page: {
    //     width: 1224,
    //     height: 792,
    //     padding: 40,
    //     fontSize: 10,
    //     fontFamily: 'Helvetica',
    //     flexDirection: 'row',
    //     backgroundColor: '#fff',
    //     justifyContent: 'flex-start',
    // },
    page: {
        width: 1224,
        height: 792,
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
        backgroundColor: '#fff',
        flexDirection: 'column', // set to column so title is on top
    },
    titleContainer: {
        width: '100%',
        textAlign: 'center',
        marginBottom: 20,
    },
    titleText: {
        fontFamily: baseFont,
        fontSize: 12,
        color: "#000",
        textAlign: 'center',
        marginRight: '40%',
    },
    contentRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 10,
    },
});

export default function InvoicePDF({ data }: { data: any }) {
    const estimateAddressLines = (address: string) => {
        console.log("address", address)
        console.log("address-lenght", address.length)
        const charsPerLine = 18;
        return Math.ceil((address?.length || 0) / charsPerLine);
    };

    const addressLineCount = estimateAddressLines(data?.Address);
    console.log("addressLineCount", addressLineCount)
    const calculatedMarginTop = addressLineCount * 12;
    return (
        <Document>
            <Page size={[1224, 792]} style={styles.page}>
                {/* Title section */}
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{data.GIANATURALDIAMONDGRADINGREPORT.GIAReportNumber}</Text>
                </View>
                {/* Main content row */}
                <View style={[styles.contentRow,]}>
                    <View style={{ width: '22%', marginTop: calculatedMarginTop, }}>
                        <InvoicePDFSection1 data={data} />
                    </View>
                    <View style={{ width: '48%', marginTop: calculatedMarginTop, }}>
                        <InvoicePDFSection4 data={data} />
                    </View>
                    <View style={{ width: '30%', }}>
                        <Text
                            style={[commonStyles.AddressText, {
                                paddingHorizontal: 20,
                            }]}
                        >
                            {data?.Address || 'Base Address: 1234 Diamond Street, Surat, Gujarat, India'}
                        </Text>
                        <InvoicePDFSection2 data={data} />
                    </View>
                </View>
            </Page>
        </Document>
    );
}
