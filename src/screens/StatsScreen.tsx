import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTaskStore } from '../stores/taskStore';
import { useLanguage } from '../context/LanguageContext';

export default function StatsScreen() {
  const { tasks } = useTaskStore();
  const { t, rtl } = useLanguage();
  
  const completedTasks = tasks.filter(task => task.completed && !task.deleted_at).length;
  const pendingTasks = tasks.filter(task => !task.completed && !task.deleted_at).length;
  const totalTasks = completedTasks + pendingTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { label: t.completed, value: completedTasks, icon: 'checkmark-circle', color: '#4CAF50' },
    { label: t.total, value: totalTasks, icon: 'list', color: '#2196F3' },
    { label: t.pending, value: pendingTasks, icon: 'time', color: '#FF9800' },
    { label: t.completionRate, value: `${completionRate}%`, icon: 'trending-up', color: '#9C27B0' },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.header, rtl && styles.rtlText]}>{t.statistics}</Text>
      
      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon as any} size={28} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.progressCard}>
          <Text style={[styles.progressTitle, rtl && styles.rtlText]}>{t.completionRate}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${completionRate}%` }]} />
          </View>
          <Text style={styles.progressText}>{completionRate}% {t.completed}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3F2FD', paddingTop: 50 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#2196F3', paddingHorizontal: 20, marginBottom: 20 },
  rtlText: { textAlign: 'right' },
  content: { flex: 1, paddingHorizontal: 15 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { width: '48%', backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 15 },
  statIcon: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 14, color: '#666', marginTop: 4, textAlign: 'center' },
  progressCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 15 },
  progressTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 15 },
  progressBar: { height: 12, backgroundColor: '#e0e0e0', borderRadius: 6 },
  progressFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 6 },
  progressText: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 10 },
});
