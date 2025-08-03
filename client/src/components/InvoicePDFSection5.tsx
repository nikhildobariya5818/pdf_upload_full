import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { commonStyles } from "./PDFStyles";
import { BASE_URL } from "./ReportProcessor";

export default function InvoicePDFSection5({ data }: { data: any }) {
    return (
        <View style={styles.container}>
            {/* QR Code */}
            <View style={styles.qrContainer}>
                <Image
                    src={`${BASE_URL}/files/qrcode.png`}
                    style={styles.qrImage}
                />
            </View>

            {/* Barcode and number */}
            <View style={styles.barcodeRow}>
                <Image
                    src={`${BASE_URL}/files/barcode10.png`}
                    style={styles.barcodeImage}
                />
                <Text style={styles.barcodeText}>
                    {data?.BARCODE10?.number ?? ""}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 420, // space from previous section (adjust if needed)
        alignItems: "center",
    },
    qrContainer: {
        width: 60,
        height: 59,
        marginBottom: '33px',
        marginLeft: 144,
        // backgroundColor: 'red'
    },
    qrImage: {
        width: "100%",
        height: "100%",
        objectFit: "contain",
    },
    barcodeRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },
    barcodeImage: {
        width: 98,
        height: 10,
        objectFit: "contain",
    },
    barcodeText: {
        marginLeft: 1,
        marginTop: '0.70px',
        fontSize: "8.80",
        fontFamily: "OCR",
        color: "#000",
    },
});
