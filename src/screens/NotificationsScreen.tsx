import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen({ navigation }: any) {
  const [taskReminders, setTaskReminders] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [sound, setSound] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.title}>الإشعارات</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Switch value={taskReminders} onValueChange={setTaskReminders} />
          <View style={styles.rowRight}>
            <Text style={styles.rowText}>تذكيرات المهام</Text>
            <Ionicons name="notifications" size={22} color="#2196F3" />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Switch value={dailySummary} onValueChange={setDailySummary} />
          <View style={styles.rowRight}>
            <Text style={styles.rowText}>ملخص يومي</Text>
            <Ionicons name="today" size={22} color="#2196F3" />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Switch value={sound} onValueChange={setSound} />
          <View style={styles.rowRight}>
            <Text style={styles.rowText}>الصوت</Text>
            <Ionicons name="volume-high" size={22} color="#2196F3" />
          </View>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowText: { fontSize: 16, color: '#333' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 5 },
});
