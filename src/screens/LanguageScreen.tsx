import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LanguageScreen({ navigation }: any) {
  const [selectedLang, setSelectedLang] = useState('ar');

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.title}>اللغة</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.list}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.item, selectedLang === lang.code && styles.selectedItem]}
            onPress={() => setSelectedLang(lang.code)}
          >
            <View style={styles.itemLeft}>
              {selectedLang === lang.code && <Ionicons name="checkmark-circle" size={24} color="#2196F3" />}
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.langName}>{lang.name}</Text>
              <Text style={styles.flag}>{lang.flag}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3F2FD' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 50 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2196F3' },
  list: { padding: 15 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10 },
  selectedItem: { borderWidth: 2, borderColor: '#2196F3' },
  itemRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemLeft: { width: 24 },
  langName: { fontSize: 16, color: '#333' },
  flag: { fontSize: 24 },
});
