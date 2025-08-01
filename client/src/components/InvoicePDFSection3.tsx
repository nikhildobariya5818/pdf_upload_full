// InvoicePDFSection3.tsx
import { View, Text } from '@react-pdf/renderer';
import { commonStyles } from './PDFStyles';

export default function InvoicePDFSection3({ data }: any) {
    const GIA = data.GIANATURALDIAMONDGRADINGREPORT || {};
    const GRADING = data.GRADINGRESULTS || {};
    const ADDITIONAL = data.ADDITIONALGRADINGINFORMATION || {};
    const SYMBOLS = data.symbols || [];

    const reportNo = GIA.GIAReportNumber || '--';
    const shape = GIA.ShapeandCuttingStyle || '--';
    const measurements = GIA.Measurements || '--';

    const carat = GRADING.CaratWeight || '--';
    const color = GRADING.ColorGrade || '--';
    const clarity = GRADING.ClarityGrade || '--';
    const cut = GRADING.CutGrade || '--';

    const polish = ADDITIONAL.polish || '--';
    const symmetry = ADDITIONAL.symmetry || '--';
    const fluorescence = ADDITIONAL.fluorescence || '--';
    const inscription = ADDITIONAL.inscription || '--';

    const clarityChar = SYMBOLS.length > 0 ? SYMBOLS[0]?.name?.replace(/\n/g, ', ') : '--';

    const todayDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return (
        <View
        // style={{ padding: 20 }}

        >
            {/* Date */}
            {data.ReportDate && <Text style={commonStyles.ReportDate}>{data.ReportDate}</Text>}

            {/* Report Type */}
            {data.ReportType && (

                <View style={commonStyles.fieldRow}>
                    <Text style={commonStyles.fieldLabel}>Report Type</Text>
                    <View style={commonStyles.separator} />
                    <Text style={commonStyles.fieldValue}>{data.ReportType}</Text>
                </View>
            )}
            {/* GIA Report No */}
            <View style={commonStyles.fieldRow}>
                <Text style={commonStyles.fieldLabel}>GIA Report No</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{reportNo}</Text>
            </View>

            {/* Shape */}
            <Text style={[commonStyles.fieldValue, { textAlign: 'left', marginVertical: 2 }]}>
                {shape}
            </Text>

            {/* Measurements */}
            <Text style={[commonStyles.fieldValue, { textAlign: 'left', marginVertical: 2 }]}>
                {measurements}
            </Text>

            {/* Carat Weight */}
            <View style={commonStyles.fieldRow}>
                <Text style={commonStyles.fieldLabel}>Carat Weight</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{carat}</Text>
            </View>

            {/* Color */}
            <View style={commonStyles.fieldRow}>
                <Text style={commonStyles.fieldLabel}>Color</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{color}</Text>
            </View>

            {/* Clarity */}
            <View style={commonStyles.fieldRow}>
                <Text style={commonStyles.fieldLabel}>Clarity</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{clarity}</Text>
            </View>

            {/* Cut */}
            <View style={commonStyles.fieldRow}>
                <Text style={commonStyles.fieldLabel}>Cut</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{cut}</Text>
            </View>

            {/* Proportions: TBL / TD */}
            {/* {<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica' }}>TBL: {data.TBL}</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica' }}>TD: {data.TD}</Text>
            </View>} */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica', marginBottom: 2 }}>TBL: {data.TBL}%</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica', marginBottom: 2 }}>TD: {data.TD}%</Text>
            </View>
            {/*: CA / PA */}
            {/* {<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica' }}>CA: {data.CA}</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica' }}>PA: {data.PA}</Text>
            </View>} */}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica', marginBottom: 2 }}>
                    CA: {data.CA}&#176;
                </Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica', marginBottom: 2 }}>
                    PA: {data.PA}&#176;
                </Text>
            </View>

            {/*: ST / LH */}
            {/* {<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica' }}>ST: {data.ST}</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica' }}>LH: {data.LH}</Text>
            </View>} */}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica' }}>ST: {data.ST}%</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica' }}>LH: {data.LH}%</Text>
            </View>

            {/* Girdle */}
            {<View style={commonStyles.fieldRow}>
                <Text style={commonStyles.fieldLabel}>Girdle</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{data.ClarityGrade || "--"}</Text>
            </View>}

            {/* Culet */}
            {<View style={commonStyles.fieldRow}>
                <Text style={commonStyles.fieldLabel}>Culet</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{data.CutGrade || '--'}</Text>
            </View>
            }
            {/* Polish */}
            <View style={commonStyles.fieldRow}>
                <Text style={commonStyles.fieldLabel}>Polish</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{polish}</Text>
            </View>

            {/* Symmetry */}
            <View style={commonStyles.fieldRow}>
                <Text style={commonStyles.fieldLabel}>Symmetry</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{symmetry}</Text>
            </View>

            {/* Fluorescence */}
            <View style={commonStyles.fieldRow}>
                <Text style={commonStyles.fieldLabel}>Fluorescence</Text>
                <View style={commonStyles.separator} />
                <Text style={commonStyles.fieldValue}>{fluorescence}</Text>
            </View>

            {/* Clarity Characteristics */}
            {<Text style={{ fontSize: 10, fontFamily: 'Helvetica', marginTop: 6 }}>
                Clarity char:  Pinpoint, Feather Internal graining is not shown.
            </Text>}

            {/* GIA Note */}
            {data.giaNote && <Text style={{ fontSize: 10, fontFamily: 'Helvetica' }}>{data.giaNote || '---'}</Text>
            }
            {/* Additional Clarity Note */}
            {data.giaNote && <Text style={{ fontSize: 10, fontFamily: 'Helvetica' }}>{data.clarityNote || "---"}</Text>
            }
        </View>
    );
}
