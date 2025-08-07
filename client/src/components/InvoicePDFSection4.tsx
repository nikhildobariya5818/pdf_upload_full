/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { BASE_URL } from "./ReportProcessor";
import { baseFont } from "./PDFStyles";

const getImageFilename = (symbol: string) => {
    const cleaned = symbol.trim().replace(/\s+/g, "_").replace("*", "");
    return `/img/${cleaned}.jpg`;
};

export default function InvoicePDFSection4({ data }: { data: any }) {
    const rawSymbolEntry = data.symbols?.[0]?.name || "";
    const symbolList = rawSymbolEntry
        .split("\n")
        .map((s: string) => s.trim())
        .filter(Boolean);
    //  data.GRADINGRESULTS

    //  grading.CutGrade
    const isCutGrade = data.GRADINGRESULTS.CutGrade ? "100%" : "100%"

    return (
        <View>
            <View style={{ height: '140px', width: '100%', marginTop: '13px', alignItems: 'center', justifyContent: 'center', }}>
                <Image
                    src={`${BASE_URL}/files/clarity_characteristics.png?t=${Date.now()}`}
                    // style={styles.diagramImage}
                    style={{ width: 180, height: '100%', objectFit: 'contain' }}
                />
            </View>
            <View style={{ height: '4.5cm', width: '100%', marginTop: '58px', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <Image
                    src={`${BASE_URL}/files/proportions.png?t=${Date.now()}`}
                    //  style={{ width: '5.5cm', height: '100%', objectFit: 'contain' }}
                    style={{
                        width: isCutGrade, height: '85%', objectFit: 'contain',
                        // ...data.GRADINGRESULTS.CutGrade && { backgroundColor: 'red' }
                    }}
                />
            </View>

            {/* === Symbol list === */}
            {symbolList.length && <Text
                style={{
                    fontFamily: baseFont,
                    fontWeight: "bold",
                    fontSize: 7.8,
                    color: "#000",
                    marginLeft: 9,
                    marginTop: 18,
                    letterSpacing: '-0.51px'
                }}
            >KEY  TO  SYMBOLS*</Text>
            }
            <View
                style={{
                    flexDirection: "row",
                    marginTop: '2px',
                    marginLeft: 9,
                    gap: 10,
                    width: '40%'
                }}
            >
                {/* Column 1 */}
                <View style={{
                    flexDirection: "column", flex: 1,
                }}>
                    {symbolList.slice(0, 4).map((symbol: string, idx: number) => (
                        <View key={idx} style={styles.symbolRow}>
                            <Image src={getImageFilename(symbol)} style={styles.symbolIcon} />
                        </View>
                    ))}
                </View>

                {/* Column 2 */}
                <View style={{
                    flexDirection: "column", flex: 1,
                }}>
                    {symbolList.slice(4, 8).map((symbol: string, idx: number) => (
                        <View key={idx + 4} style={styles.symbolRow}>
                            <Image src={getImageFilename(symbol)} style={styles.symbolIcon} />

                        </View>
                    ))}
                </View>
            </View>

            {symbolList.length && <View
                fixed
                style={{
                    position: 'absolute',
                    top: '474px',
                    left: '-3px',
                    width: '100%',
                }}
            >
                {/* <Image
                    src={`${BASE_URL}/files/notes.png?t=${Date.now()}`}
                    style={{ width: "100%", height: '100%', objectFit: 'contain' }}
                /> */}
                <Image
                    src={`/img/note.png`}
                    style={{ width: "100%", height: '100%', objectFit: 'contain' }}
                />
            </View>}
            {/* <View>
                <Text style={{
                    fontFamily: baseFont,
                    fontWeight: "bold",
                    fontSize: 4,
                    // lineHeight: 1.3,
                    // letterSpacing: -0.3,
                    textAlign: "left",
                    marginLeft: 2,
                }}>
                    * Red symbols denote internal characteristics (inclusions). Green or
                    black symbols denote external characteristics (ble{"\n"} mishes). Diagram is
                    an approximate representation of the diamond, and symbols shown
                    indicate type, position, and ap{"\n"}proximate size of clarity
                    characteristics. All clarity characteristics may not be shown. Details
                    of finish are not shown.
                </Text>
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    diagramImage: {
        width: '100%',
        height: '100%',
        objectFit: "contain",
    },
    symbolRow: {
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: 'red',
        paddingVertical: 0,
        marginVertical: 0,
        height: 12,
    },
    symbolIcon: {
        width: 28,
        height: 28,
        objectFit: 'contain',
        // width: '51%',
        // height: '51%',
        // objectFit: 'contain'
    },
    qrImage: {
        width: 60,
        height: 60,
        objectFit: "contain",
    },

});
