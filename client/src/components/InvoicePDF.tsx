// InvoicePDF.tsx
import { Document, Page, View, StyleSheet, Text, Image } from '@react-pdf/renderer';
import InvoicePDFSection1 from './InvoicePDFSection1';
import InvoicePDFSection2 from './InvoicePDFSection2';
import InvoicePDFSection4 from './InvoicePDFSection4';
import { baseFont } from './PDFStyles';
import InvoicePDFSection5 from './InvoicePDFSection5';
import { Font } from '@react-pdf/renderer';
const dinProRegular = '/fonts/DINPro-Light_13935.ttf';
const dinProBold = '/fonts/DINPro-Medium_13936.ttf';

Font.register({
    family: 'DINPro',
    fonts: [
        {
            src: dinProRegular,
            fontWeight: 'normal',
        },
        {
            src: dinProBold,
            fontWeight: 'bold',
        },
    ],
});

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
    // page: {
    //     width: 1224,
    //     height: 792,
    //     padding: 40,
    //     fontSize: 10,
    //     fontFamily: 'Helvetica',
    //     backgroundColor: '#fff',
    //     flexDirection: 'column', // set to column so title is on top
    // },
    page: {
        width: 1224,
        height: 792,
        // padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
        backgroundColor: '#fff',
        flexDirection: 'column',
        position: 'relative',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1224,
        height: 792,
        zIndex: -1,
    },
    titleContainer: {
        width: '100%',
        textAlign: 'center',
        // marginTop: '157px'
        // backgroundColor: 'red',
        paddingTop: '156px',
    },
    titleText: {
        fontFamily: baseFont,
        fontSize: 12,
        color: "#000",
        // textAlign: 'center',
        // marginRight: '40%',
        marginRight: '257px',
    },
    contentRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 10,
        // marginTop: 100
    },
});

export default function InvoicePDF({ data }: { data: any }) {
    return (
        <Document>
            <Page size={[1224, 792]} style={styles.page}>
                <Image src={'/basiSctucutre.jpg'} style={styles.backgroundImage} />
                {/* Title section */}
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{data.GIANATURALDIAMONDGRADINGREPORT.GIAReportNumber}</Text>
                </View>
                {/* Main content row */}
                <View style={[styles.contentRow]}>
                    {/* marginTop: '43px' */}
                    <View style={{ width: '215px', marginTop: '57px', marginLeft: '109px' }}>
                        <InvoicePDFSection1 data={data} />
                    </View>
                    <View style={{ width: '234px', height: '100%', marginLeft: '32px', marginTop: '43px' }}>
                        <View>
                            <View>
                                <InvoicePDFSection4 data={data} />
                            </View>
                            <View>
                                <Text>DIA</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '215px', marginTop: '43px', marginLeft: '21px' }}>
                        <InvoicePDFSection5 data={data} />
                    </View>
                    <View style={{ width: '184px', marginLeft: '34px', marginTop: '8px' }}>
                        <Text
                            style={{
                                fontFamily: baseFont,
                                fontWeight: "normal",
                                fontSize: 7,
                                color: "#333",
                            }}
                        >
                            {data?.Address || 'Base Address: 1234 Diamond Street, Surat, Gujarat, India'}
                        </Text>
                        <Text
                            style={{
                                fontFamily: baseFont,
                                fontWeight: "normal",
                                fontSize: 7,
                                color: "#333",
                            }}
                        >
                            {data?.CityState || 'Surat, Gujarat,'}
                        </Text>
                        <Text
                            style={{
                                fontFamily: baseFont,
                                fontWeight: "normal",
                                fontSize: 7,
                                color: "#333",
                            }}
                        >
                            {data?.country || 'India'}
                        </Text>
                        <InvoicePDFSection2 data={data} />
                    </View>
                </View>
            </Page>
        </Document>
    );
}
