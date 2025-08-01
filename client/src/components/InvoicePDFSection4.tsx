import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { commonStyles } from "./PDFStyles";
import { BASE_URL } from "./ReportProcessor";

const getImageFilename = (symbol: string) => {
    const cleaned = symbol.trim().replace(/\s+/g, "_").replace("*", "");
    return `/img/${cleaned}.png`;
};

export default function InvoicePDFSection4({ data }: { data: any }) {
    const rawSymbolEntry = data.symbols?.[0]?.name || "";
    const symbolList = rawSymbolEntry
        .split("\n")
        .map((s: string) => s.trim())
        .filter(Boolean);

    return (
        <View style={commonStyles.sectionContainer}>

            {/* === Centered diagram images === */}
            <View style={styles.centeredColumn}>
                <Image
                    src={`${BASE_URL}/files/clarity_characteristics.png`}
                    style={styles.diagramImage}
                />
                <Image
                    src={`${BASE_URL}/files/proportions.png`}
                    style={styles.diagramImage}
                />
            </View>

            {/* === Symbol list === */}
            <Text style={commonStyles.headerText}>KEY TO SYMBOLS</Text>

            <View style={{ marginTop: 2 }}>
                {symbolList.map((symbol: string, idx: number) => (
                    <View key={idx} style={styles.symbolRow}>
                        <Image
                            src={getImageFilename(symbol)}
                            style={styles.symbolIcon}
                        />
                        <Text style={commonStyles.fieldLabel}>{symbol}</Text>
                    </View>
                ))}
            </View>
            {/* === Container with relative positioning to allow QR overlap === */}
            <View style={{ position: "relative", marginTop: 40 }}>
                {/* QR Code absolutely positioned to top-right */}
                <View style={{ position: "absolute", top: -53, right: 0 }}>
                    <Image
                        src={`${BASE_URL}/files/qrcode.png`}
                        style={styles.qrImage}
                    />
                </View>

                {/* Footer note text (will appear underneath QR visually) */}
                <View style={{ width: "60%" }}>
                    <Text style={styles.footerNote}>
                        * Red symbols denote internal characteristics (inclusions). Green or
                        black symbols denote external characteristics (blemishes). Diagram is
                        an approximate representation of the diamond, and symbols shown
                        indicate type, position, and approximate size of clarity
                        characteristics. All clarity characteristics may not be shown. Details
                        of finish are not shown.
                    </Text>
                </View>
            </View>

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
            <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginTop: 6 }}>
                <Image
                    src={`${BASE_URL}/files/barcode10.png`}
                    style={styles.barcodeImage}
                />
                <Text style={[commonStyles.ReportDate, { marginLeft: 1 }]}>
                    {data.BARCODE10.number}
                </Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    centeredColumn: {
        flexDirection: "column",
    },
    diagramImage: {
        width: 140,
        height: 140,
        objectFit: "contain",
    },
    symbolRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 2,
    },
    symbolIcon: {
        width: 6,
        height: 6,
        marginRight: 6,
        objectFit: 'cover'
    },
    // footerNote: {
    //     fontSize: 6,
    //     marginTop: 12,
    //     lineHeight: 1.3,
    // },
    barcodeImage: {
        width: 120,
        height: 20,
        objectFit: "contain",
    },
    // qrImage: {
    //     width: 60,
    //     height: 60,
    //     objectFit: "contain",
    // },
    qrImage: {
        width: 60,
        height: 60,
        objectFit: "contain",
    },
    footerNote: {
        fontSize: 6,
        lineHeight: 1.3,
        textAlign: "left",
    },
});
