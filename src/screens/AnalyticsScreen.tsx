import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { useTaskStore } from '../stores/taskStore';

export default function AnalyticsScreen() {
  const { tasks } = useTaskStore();
  
  const allTasks = tasks.filter(t => !t.deleted_at);
  const completedTasks = allTasks.filter(t => t.completed);
  const pendingTasks = allTasks.filter(t => !t.completed);
  const completionRate = allTasks.length > 0 
    ? Math.round((completedTasks.length / allTasks.length) * 100) 
    : 0;

  const stats = [
    { id: 'total', label: 'إجمالي المهام', value: allTasks.length, icon: 'list', color: colors.primary },
    { id: 'completed', label: 'مكتملة', value: completedTasks.length, icon: 'checkmark-circle', color: colors.success },
    { id: 'pending', label: 'متبقية', value: pendingTasks.length, icon: 'time', color: colors.warning },
    { id: 'rate', label: 'نسبة الإنجاز', value: completionRate + '%', icon: 'trending-up', color: '#9C27B0' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Analytics</Text>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon as any} size={28} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>تقدم الإنجاز</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: completionRate + '%' }]} />
          </View>
          <Text style={styles.progressText}>{completionRate}% مكتمل</Text>
        </View>

        <View style={styles.activityCard}>
          <Text style={styles.sectionTitle}>آخر المهام</Text>
          {allTasks.length === 0 ? (
            <Text style={styles.emptyText}>لا توجد مهام بعد</Text>
          ) : (
            allTasks.slice(0, 5).map((task) => (
              <View key={task.id} style={styles.activityItem}>
                <Ionicons 
                  name={task.completed ? 'checkmark-circle' : 'ellipse-outline'} 
                  size={20} 
                  color={task.completed ? colors.success : colors.textMuted} 
                />
                <Text style={[styles.activityText, task.completed && styles.completedText]}>
                  {task.title}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.primary, padding: 16, paddingBottom: 8 },
  content: { flex: 1, paddingHorizontal: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { 
    width: '48%', 
    backgroundColor: colors.surface, 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12,
    alignItems: 'center',
  },
  iconContainer: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  statLabel: { fontSize: 12, color: colors.textMuted },
  progressCard: { 
    backgroundColor: colors.surface, 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 },
  progressBar: { 
    height: 12, 
    backgroundColor: colors.border, 
    borderRadius: 6, 
    overflow: 'hidden',
  },
  progressFill: { 
    height: '100%', 
    backgroundColor: colors.success, 
    borderRadius: 6,
  },
  progressText: { fontSize: 12, color: colors.textMuted, marginTop: 8, textAlign: 'center' },
  activityCard: { 
    backgroundColor: colors.surface, 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 24,
  },
  activityItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityText: { fontSize: 14, color: colors.text, marginLeft: 8, flex: 1 },
  completedText: { textDecorationLine: 'line-through', color: colors.textMuted },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingVertical: 16 },
});
