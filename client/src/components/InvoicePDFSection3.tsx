/* eslint-disable @typescript-eslint/no-explicit-any */
// InvoicePDFSection3.tsx
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { baseFont, commonStyles } from './PDFStyles';

export default function InvoicePDFSection3({ data }: any) {
    const GIA = data.GIANATURALDIAMONDGRADINGREPORT || {};
    const GRADING = data.GRADINGRESULTS || {};
    const ADDITIONAL = data.ADDITIONALGRADINGINFORMATION || {};
    // const SYMBOLS = data.symbols || [];
    const symbols = data.symbols || []
    const reportNo = GIA.GIAReportNumber;
    const shape = GIA.ShapeandCuttingStyle;
    const measurements = GIA.Measurements;
    const carat = GRADING.CaratWeight;
    const color = GRADING.ColorGrade;
    // const clarity = GRADING.ClarityGrade;
    // const cut = GRADING.CutGrade;

    const polish = ADDITIONAL.polish;
    const symmetry = ADDITIONAL.symmetry;
    const fluorescence = ADDITIONAL.fluorescence;
    // const inscription = ADDITIONAL.inscription;

    // const clarityChar = SYMBOLS.length > 0 ? SYMBOLS[0]?.name?.replace(/\n/g, ', ') : '--';

    // const todayDate = new Date().toLocaleDateString('en-US', {
    //     year: 'numeric',
    //     month: 'long',
    //     day: 'numeric',
    // });

    const fieldValue = data?.reportType || '';
    const firstLineLimit = 8; // Adjust this number as per your PDF font size and width
    const firstLine = fieldValue.slice(0, firstLineLimit);
    const remaining = fieldValue.length > firstLineLimit ? fieldValue.slice(firstLineLimit) : '';




    const commandValue = ADDITIONAL.comments || '';
    const commandValueLimit = 33; // Adjust this number as per your PDF font size and width
    const commandValuefirstLine = commandValue.slice(0, commandValueLimit);
    const commandValueremaining = commandValue.length > commandValueLimit ? commandValue.slice(commandValueLimit) : '';
    return (
        <View>
            <View>
                <Text style={styles.fieldLabel}>{data.ReportDate}</Text>
            </View>



            {/* <View style={{
                flexDirection: "row",
                alignItems: "baseline",
                width: "100%",
            }}>
                <Text style={styles.fieldLabel}>Report Type</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{data.ReportType}</Text>
            </View> */}
            {fieldValue &&
                <View style={{ width: '100%' }}>
                    {/* First line: label + separator + first part of value */}
                    <View style={styles.fieldRow}>
                        <Text style={styles.fieldLabel}>Report Type</Text>
                        {/* <View style={{
                            flexGrow: 1,
                            borderBottom: "1px dotted #000",
                            marginHorizontal: "2px",
                            // height: 1, // remove height if causing layout shifts
                        }} /> */}
                        <View style={styles.separator} />
                        <Text style={[styles.fieldValue]} wrap={false}>{firstLine}</Text>

                    </View>

                    {/* Second line: remaining value, right-aligned */}
                    {remaining && (
                        <View style={{ width: '100%', }}>
                            <Text
                                style={[styles.fieldValue, { textAlign: 'right' }]}
                            >
                                {remaining}
                            </Text>
                        </View>
                    )}
                </View>}

            <View style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: fieldValue && remaining ? '1px' : '7.48px',
                width: "100%",
            }}>
                <Text style={styles.fieldLabel}>GIA Report No</Text>
                <View style={styles.separator} />
                <Text style={styles.fieldValue}>{reportNo}</Text>
            </View>
            <View style={{ marginTop: '7.40px' }}>
                <Text style={{
                    fontFamily: baseFont,
                    fontWeight: "bold",
                    fontSize: 5,
                    color: "#000",
                    letterSpacing: "-0.20",
                    textAlign: 'left'
                }}>
                    {shape}
                </Text>
            </View>
            <View style={{ marginTop: '1.30px' }}>
                <Text style={{
                    fontFamily: baseFont,
                    fontWeight: "bold",
                    fontSize: 5,
                    color: "#000",
                    letterSpacing: "-0.20",
                    textAlign: 'left'
                }}>
                    {measurements}
                </Text>
            </View>
            <View style={{ marginTop: '1px' }}>
                <View style={[styles.fieldRow]}>
                    <Text style={styles.fieldLabel}>Carat Weight</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{carat}</Text>
                </View>
                <View style={[styles.fieldRow]}>
                    <Text style={styles.fieldLabel}>Color</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{color}</Text>
                </View>
                <View style={[styles.fieldRow, { marginTop: 1 }]}>
                    <Text style={styles.fieldLabel}>Clarity</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{GRADING.ClarityGrade}</Text>
                </View>
                {GRADING.CutGrade && <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Cut</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{GRADING.CutGrade}</Text>
                </View>}
            </View>

            <View style={{ marginTop: '1px' }}>
                {/* {(data.TBL || data.TD) && (
                    <View style={{ flexDirection: 'row' }}>
                        {data.TBL && <Text style={styles.fieldLabel}>TBL: {data.TBL}%</Text>}
                        {data.TBL && data.TD && <View style={{ width: 10 }} />}
                        {data.TD && <Text style={styles.fieldLabel}>TD: {data.TD}%</Text>}
                    </View>
                )} */}

                {/* CA / PA */}
                {/* {(data.CA || data.PA) && (
                    <View style={{ flexDirection: 'row', marginTop: '1px' }}>
                        {data.CA && <Text style={styles.fieldLabel}>CA: {data.CA}&#176;</Text>}
                        {data.CA && data.PA && <View style={{ width: 17 }} />}
                        {data.PA && <Text style={styles.fieldLabel}>PA: {data.PA}&#176;</Text>}
                    </View>
                )} */}

                {/* ST / LH */}
                {/* {(data.ST || data.LH) && (
                    <View style={{ flexDirection: 'row' }}>
                        {data.ST && <Text style={styles.fieldLabel}>ST: {data.ST}%</Text>}
                        {data.ST && data.LH && <View style={{ width: 17 }} />}
                        {data.LH && <Text style={styles.fieldLabel}>LH: {data.LH}%</Text>}
                    </View>
                )} */}
                {/* TBL / TD */}
                {(data.TBL || data.TD) && (
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        {data.TBL && (
                            <View style={{ flex: 1 }}>
                                <Text style={styles.fieldLabel}>
                                    TBL: {data.TBL}%
                                </Text>
                            </View>
                        )}
                        {data.TD && (
                            <View style={{ flex: 1 }}>
                                <Text style={styles.fieldLabel}>
                                    TD: {data.TD}%
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* CA / PA */}
                {(data.CA || data.PA) && (
                    <View style={{ flexDirection: 'row', width: '100%', marginTop: '1px' }}>
                        {data.CA && (
                            <View style={{ flex: 1 }}>
                                <Text style={styles.fieldLabel}>
                                    CA: {data.CA}&#176;
                                </Text>
                            </View>
                        )}
                        {data.PA && (
                            <View style={{ flex: 1 }}>
                                <Text style={styles.fieldLabel}>
                                    PA: {data.PA}&#176;
                                </Text>
                            </View>
                        )}
                    </View>
                )}


                {(data.ST || data.LH) && (
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        {/* Column 1: ST */}
                        {data.ST && (
                            <View style={{ flex: 1 }}>
                                <Text style={styles.fieldLabel}>
                                    ST: {data.ST}%
                                </Text>
                            </View>
                        )}

                        {/* Column 2: LH */}
                        {data.LH && (
                            <View style={{ flex: 1 }}>
                                <Text style={styles.fieldLabel}>
                                    LH: {data.LH}%
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {data.depth && <View style={[styles.fieldRow]}>
                    <Text style={styles.fieldLabel}>Depth</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{data.depth}%</Text>
                </View>}

                {data.table && <View style={[styles.fieldRow]}>
                    <Text style={styles.fieldLabel}>Table</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{data.table}%</Text>
                </View>}

                {data.girdle && <View style={[styles.fieldRow]}>
                    <Text style={styles.fieldLabel}>Girdle</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{data.girdle}</Text>
                </View>}
                {data.culet && <View style={[styles.fieldRow, { marginTop: '1px' }]}>
                    <Text style={styles.fieldLabel}>Culet</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{data.culet}</Text>
                </View>}
                <View style={[styles.fieldRow, { marginTop: '0.40px' }]}>
                    <Text style={styles.fieldLabel}>Polish</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{polish}</Text>
                </View>
                <View style={[styles.fieldRow, { marginTop: '1px' }]}>
                    <Text style={styles.fieldLabel}>Symmetry</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{symmetry}</Text>
                </View>
                <View style={[styles.fieldRow, { marginTop: '0.30px' }]}>
                    <Text style={styles.fieldLabel}>Fluorescence</Text>
                    <View style={styles.separator} />
                    <Text style={styles.fieldValue}>{fluorescence}</Text>
                </View>
            </View>
            <View style={{ marginTop: '2px' }}>
                <View>
                    {/* {data.clarityCharacteristics && <Text style={{
                        fontFamily: baseFont,
                        fontWeight: "bold",
                        fontSize: 5,
                        color: "#000",
                        textAlign: "left",
                        letterSpacing: "-0.20",
                    }}>
                        Clarity char:  {data.clarityCharacteristics}
                    </Text>} */}

                    {symbols && symbols.length > 0 && (
                        <Text style={styles.fieldLabel}>
                            Clarity char: {symbols.map((s: any) => s.name.replace(/\n/g, ", ")).join(", ")}
                        </Text>
                    )}

                </View>
                <View>
                    <Text style={{
                        fontFamily: baseFont,
                        fontWeight: "bold",
                        fontSize: 5,
                        color: "#373435",
                        textAlign: "left",
                        letterSpacing: "-0.20",
                    }}>
                        Ins:GIA {reportNo}
                    </Text>
                </View>
                {ADDITIONAL.comments && <View
                // style={{ marginTop: '1.5px' }}
                >
                    <Text style={{
                        fontFamily: baseFont,
                        fontWeight: "bold",
                        fontSize: 5,
                        color: "#373435",
                        textAlign: "left",
                        letterSpacing: "-0.20",
                    }}>
                        {/* {ADDITIONAL.comments} */}
                        {commandValuefirstLine}
                    </Text>
                    {/* <Text style={[styles.fieldLabel, { marginLeft: '1px' }]}>{commandValuefirstLine}</Text> */}
                    {commandValueremaining && (
                        <View style={{ width: '100%', }}>
                            <Text
                                style={[{
                                    fontFamily: baseFont,
                                    fontWeight: "bold",
                                    fontSize: 5,
                                    color: "#373435",
                                    letterSpacing: "-0.20",
                                    textAlign: 'left'
                                }]}
                            >
                                {commandValueremaining}
                            </Text>
                        </View>
                    )}
                </View>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fieldRow: {
        flexDirection: "row",
        alignItems: "baseline",
        width: "100%",
    },
    fieldLabel: {
        fontFamily: baseFont,
        fontWeight: "bold",
        fontSize: 5,
        color: "#373435",
        letterSpacing: "-0.20",
    },
    ReportDate: {
        fontFamily: baseFont,
        fontWeight: "bold",
        fontSize: 5,
        color: "#333",
    },
    // separator: {
    //     flexGrow: 1,
    //     borderBottom: "0.50px dotted #4B4B4D",
    //     marginHorizontal: "2px",
    //     height: '5.70px',
    // },
    separator: {
        flexGrow: 1,
        borderBottomWidth: 0.5,
        borderBottomColor: "#4B4B4D",
        borderStyle: "dotted", // instead of dotted     //dashed
        dashArray: [0.5, 0.5], // [dotLength, gapLength] in points
    },
    fieldValue: {
        fontFamily: baseFont,
        fontWeight: "bold",
        fontSize: 5,
        color: "#000",
        textAlign: "right",
        letterSpacing: "-0.20",
    },
    miniField: {
        fontSize: 5,
        fontFamily: baseFont
    }
})