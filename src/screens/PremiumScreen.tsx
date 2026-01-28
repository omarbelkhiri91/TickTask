import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

export default function PremiumScreen() {
  const { t, rtl } = useLanguage();

  const features = [
    { icon: 'list', text: t.unlimitedLists },
    { icon: 'cloud', text: t.cloudSync },
    { icon: 'eye-off', text: t.noAds },
    { icon: 'color-palette', text: t.themes },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.headerSection}>
          <Ionicons name="diamond" size={60} color="#FFD700" />
          <Text style={styles.title}>{t.goPremium}</Text>
          <Text style={styles.subtitle}>{t.unlockFeatures}</Text>
        </View>

        <View style={styles.featuresCard}>
          {features.map((feature, index) => (
            <View key={index} style={[styles.featureRow, rtl && styles.rtlRow]}>
              {!rtl && <Ionicons name={feature.icon as any} size={24} color="#2196F3" />}
              <Text style={styles.featureText}>{feature.text}</Text>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              {rtl && <Ionicons name={feature.icon as any} size={24} color="#2196F3" />}
            </View>
          ))}
        </View>

        <View style={styles.plansContainer}>
          <TouchableOpacity style={styles.planCard}>
            <Text style={styles.planPeriod}>{t.monthly}</Text>
            <Text style={styles.planPrice}>$4.99</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.planCard, styles.planPopular]}>
            <Text style={[styles.planPeriod, styles.planPeriodPopular]}>{t.yearly}</Text>
            <Text style={[styles.planPrice, styles.planPricePopular]}>$29.99</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeText}>{t.subscribe}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3F2FD' },
  content: { flex: 1 },
  headerSection: { alignItems: 'center', paddingTop: 60, paddingBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 15 },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  rtlRow: { flexDirection: 'row-reverse' },
  featuresCard: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, padding: 20 },
  featureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  featureText: { flex: 1, fontSize: 16, color: '#333', marginHorizontal: 15 },
  plansContainer: { flexDirection: 'row', justifyContent: 'center', gap: 15, marginTop: 25, paddingHorizontal: 20 },
  planCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#e0e0e0' },
  planPopular: { borderColor: '#2196F3', backgroundColor: '#2196F3' },
  planPeriod: { fontSize: 14, color: '#666' },
  planPeriodPopular: { color: '#fff' },
  planPrice: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 5 },
  planPricePopular: { color: '#fff' },
  subscribeButton: { backgroundColor: '#4CAF50', marginHorizontal: 20, marginTop: 25, marginBottom: 30, padding: 18, borderRadius: 12, alignItems: 'center' },
  subscribeText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
