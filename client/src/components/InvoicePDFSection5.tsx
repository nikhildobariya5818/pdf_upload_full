import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { commonStyles } from "./PDFStyles";
import { BASE_URL } from "./ReportProcessor";

export default function InvoicePDFSection5({ data }: { data: any }) {
    return (
        <View>
            {/* QR Code Section (DO NOT TOUCH) */}
            <View style={styles.qrContainer}>
                <Image
                    src={`${BASE_URL}/files/qrcode.png`}
                    style={styles.qrImage}
                />
            </View>


            {/* <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: '-14px' }}> */}
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: '-14px', marginRight: '10px' }}>
                <Image
                    src={`${BASE_URL}/files/barcode10.png`}
                    style={{
                        width: 98,
                        height: 10,
                        objectFit: "contain",
                    }}
                />
                <Text style={[commonStyles.ReportDate, { marginLeft: 2 }]}>
                    {data.BARCODE10.number}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    qrContainer: {
        marginTop: 406.9,
        width: 100,
        height: 100,
        marginLeft: 135,
    },
    qrImage: {
        width: "100%",
        height: "100%",
        objectFit: "contain",
    },
    // barcodeContainer: {
    //     marginLeft: 30,
    //     marginTop: -47,
    //     width: '97px',
    //     height: '81px',
    // },
    barcodeContainer: {
        position: 'absolute',
        top: 460,
        left: 30,
        width: '97px',
        height: '81px',
    },
    // barcodeContainer: {
    //     marginLeft: 30,
    //     marginTop: -47,
    //     width: '97px',
    //     height: '81px',
    //     justifyContent: 'center',
    // },
    // barcodeImage: {
    //     width: 60, // adjust as needed
    //     height: 40,
    //     objectFit: 'contain',
    // },
    barcodeText: {
        fontSize: 8,
        marginLeft: 6,
    },
    // barcodeText: {
    //     fontSize: 6,
    //     marginBottom: 2,
    // },
    barcodeImage: {
        width: "100%",
        height: "80%",
        objectFit: "contain",
    },
});
