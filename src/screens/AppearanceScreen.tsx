import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AppearanceScreen({ navigation }: any) {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#2196F3');

  const colors = ['#2196F3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.title}>المظهر</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Switch value={darkMode} onValueChange={setDarkMode} />
          <Text style={styles.rowText}>الوضع الداكن</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>اللون الرئيسي</Text>
        <View style={styles.colorsRow}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[styles.colorCircle, { backgroundColor: color }, selectedColor === color && styles.selectedColor]}
              onPress={() => setSelectedColor(color)}
            >
              {selectedColor === color && <Ionicons name="checkmark" size={20} color="#fff" />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3F2FD' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2196F3' },
  section: { backgroundColor: '#fff', margin: 15, borderRadius: 12, padding: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'right' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowText: { fontSize: 16, color: '#333' },
  colorsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  colorCircle: { width: 45, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  selectedColor: { borderWidth: 3, borderColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
});
