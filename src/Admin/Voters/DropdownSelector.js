import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const dropdownWidth = width * 0.85; // 85% of screen width

const DropdownSelector = ({
  townOpen,
  townValue,
  towns,
  setTownOpen,
  setTownValue,
  boothOpen,
  boothValue,
  booths,
  setBoothOpen,
  setBoothValue,
  loadingTowns,
  loadingBooths,
  onChangeTown,
}) => {
  return (
    <LinearGradient
      colors={['#3C4CAC', '#F04393']}
      locations={[0.3, 1]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        

        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Town</Text>
          <DropDownPicker
            open={townOpen}
            value={townValue}
            items={towns}
            setOpen={setTownOpen}
            setValue={setTownValue}
            setItems={() => {}}
            searchable={true}
            placeholder={loadingTowns ? "Loading towns..." : "Select a town"}
            disabled={loadingTowns}
            style={[styles.dropdown, { width: dropdownWidth }]}
            dropDownContainerStyle={{ width: dropdownWidth }}
            zIndex={5000}
            onChangeValue={onChangeTown} // Callback to reset booth selection when town changes
          />
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Booth</Text>
          <DropDownPicker
            open={boothOpen}
            value={boothValue}
            items={booths}
            setOpen={setBoothOpen}
            setValue={setBoothValue}
            setItems={() => {}}
            searchable={true}
            placeholder={townValue ? (loadingBooths ? "Loading booths..." : "Select a booth") : "Select a town first"}
            disabled={!townValue || loadingBooths}
            style={[styles.dropdown, { width: dropdownWidth }]}
            dropDownContainerStyle={{ width: dropdownWidth }}
            zIndex={4000}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex:0.5,
    width: '100%',
    // paddingBottom: 30, 
    alignItems: 'center',
    justifyContent:'center',
    borderRadius:30,
    marginTop:'5%'
  },
  container: {
    // paddingTop: height * 0.015,
    width: '100%',
  },
  heading: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#fff',
    // marginBottom: height * 0.01,
    textAlign: 'center',
  },
  dropdownContainer: {
    marginBottom: height * 0.015,
    alignItems: 'center',
    marginHorizontal:'auto',
    
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: '500',
    marginBottom: height * 0.01,
    color: '#fff',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal:'auto'
  },
});

export default DropdownSelector;
