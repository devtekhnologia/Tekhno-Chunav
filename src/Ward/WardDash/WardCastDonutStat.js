import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import PieChart from 'react-native-pie-chart';


const { height, width } = Dimensions.get('screen')
const WardCastDonutStat = () => {
    const widthAndHeight = width * 0.28;
    const series = [80, 20, 50, 15, 10, 22, 8, 5];
    const sliceColor = ['#F8700F', '#FB1C88', '#FF56A5', 'yellow', 'purple', 'blue', '#4CA145', 'cyan'];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cast wise Statistics</Text>

            <View style={{ marginTop: '8%' }}>
                <PieChart
                    widthAndHeight={widthAndHeight}
                    series={series}
                    sliceColor={sliceColor}
                    doughnut={true}
                    coverRadius={0.5}
                    coverFill={'#FFF'}
                />
            </View>

            <View style={styles.legendContainer}>
                <View style={styles.legendColumn}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#F8700F' }]} />
                        <Text style={styles.legendLabel}>Maratha</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#FF56A5' }]} />
                        <Text style={styles.legendLabel}>Brahmin</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#FB1C88' }]} />
                        <Text style={styles.legendLabel}>Maheshwari</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#4CA145' }]} />
                        <Text style={styles.legendLabel}>Muslim</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#FBBE17' }]} />
                        <Text style={styles.legendLabel}>Sindhi</Text>
                    </View>
                </View>

                <View style={styles.legendColumn}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#15E8FF' }]} />
                        <Text style={styles.legendLabel}>Kunbi</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#C1CE23' }]} />
                        <Text style={styles.legendLabel}>Marwadi</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#1963D2' }]} />
                        <Text style={styles.legendLabel}>Buddhist</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#C07825' }]} />
                        <Text style={styles.legendLabel}>Christian</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendColor, { backgroundColor: '#8179EE' }]} />
                        <Text style={styles.legendLabel}>Others</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default WardCastDonutStat;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,

    },
    title: {
        fontSize: height * 0.017,
        fontWeight: '700',
    },
    legendContainer: {
        flexDirection: 'row',
        width: width * 0.4,
        justifyContent: 'space-between',
        marginTop: '8%',
    },
    legendColumn: {
        flexDirection: 'column',
        marginVertical: 5,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 5,
        marginVertical: 5,
    },
    legendColor: {
        height: 10,
        width: 10,
        borderRadius: 10,
    },
    legendLabel: {
        fontSize: height * 0.014,
        color: 'black'
    },
});
