import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { commonStyles } from "./PDFStyles";
import { BASE_URL } from "./ReportProcessor";


export default function InvoicePDFSection5({ data }: { data: any }) {

    return (
        <View style={commonStyles.sectionContainer}>
            <View style={{ backgroundColor: 'pink', marginTop: '400px', width: '62px', height: '62px', marginLeft: '100px' }}>
                <Text>QRCODE</Text>
            </View>
            <View style={{ alignItems: 'center', marginTop: '32px' }}>
                <Text>Barcode</Text>
            </View>
            {/* <View style={{ position: "relative", marginTop: 40 }}> */}
            {/* QR Code absolutely positioned to top-right */}
            {/* <View style={{ position: "absolute", top: -53, right: 0 }}>
                    <Image
                        src={`${BASE_URL}/files/qrcode.png`}
                        style={styles.qrImage}
                    />
                </View> */}

            {/* === Barcode and number aligned right === */}
            {/* <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 6 }}>
                <View style={{ alignItems: "flex-end" }}>
                    <Image
                        src={`${BASE_URL}/files/barcode10.png`}
                        style={styles.barcodeImage}
                    />
                    <Text style={[commonStyles.ReportDate]}>{data.BARCODE10.number}</Text>
                </View>
            </View> */}
        </View>
    );
}
