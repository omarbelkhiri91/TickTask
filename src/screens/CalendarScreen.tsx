import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useTaskStore } from '../stores/taskStore';
import { useLanguage } from '../context/LanguageContext';

// إعداد اللغة العربية
LocaleConfig.locales['ar'] = {
  monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  monthNamesShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  dayNamesShort: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
  today: 'اليوم'
};

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui"
};

LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today'
};

export default function CalendarScreen() {
  const { tasks, toggleTask } = useTaskStore();
  const { t, rtl, language } = useLanguage();
  
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  // تعيين اللغة
  LocaleConfig.defaultLocale = language;

  // الحصول على المهام حسب التاريخ
  const getTasksForDate = (date: string) => {
    return tasks.filter(task => {
      if (task.deleted_at) return false;
      const taskDate = task.created_at.split('T')[0];
      return taskDate === date;
    });
  };

  // تجهيز التواريخ المميزة
  const markedDates = useMemo(() => {
    const marks: any = {};
    
    tasks.forEach(task => {
      if (task.deleted_at) return;
      const taskDate = task.created_at.split('T')[0];
      
      if (!marks[taskDate]) {
        marks[taskDate] = {
          marked: true,
          dotColor: task.completed ? '#4CAF50' : '#2196F3',
        };
      }
    });

    // تمييز اليوم المحدد
    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor: '#2196F3',
    };

    return marks;
  }, [tasks, selectedDate]);

  const selectedDateTasks = getTasksForDate(selectedDate);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US', options);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.header, rtl && styles.rtlText]}>{t.calendar}</Text>
      
      <Calendar
        current={selectedDate}
        onDayPress={(day: any) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#E3F2FD',
          calendarBackground: '#fff',
          textSectionTitleColor: '#666',
          selectedDayBackgroundColor: '#2196F3',
          selectedDayTextColor: '#fff',
          todayTextColor: '#2196F3',
          dayTextColor: '#333',
          textDisabledColor: '#ccc',
          dotColor: '#2196F3',
          selectedDotColor: '#fff',
          arrowColor: '#2196F3',
          monthTextColor: '#2196F3',
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
        }}
        style={styles.calendar}
        enableSwipeMonths={true}
      />

      <View style={styles.tasksSection}>
        <Text style={[styles.dateTitle, rtl && styles.rtlText]}>
          {formatDate(selectedDate)}
        </Text>
        
        {selectedDateTasks.length > 0 ? (
          <FlatList
            data={selectedDateTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.taskItem, rtl && styles.rtlRow]}
                onPress={() => toggleTask(item.id)}
              >
                <Ionicons
                  name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={item.completed ? '#4CAF50' : '#2196F3'}
                />
                <Text style={[styles.taskText, item.completed && styles.taskCompleted]}>
                  {item.title}
                </Text>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
                  <Text style={[styles.categoryText, { color: getCategoryColor(item.category) }]}>
                    {getCategoryName(item.category, t)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>{t.noTasksForDate}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'work': return '#2196F3';
    case 'study': return '#9C27B0';
    case 'personal': return '#4CAF50';
    default: return '#666';
  }
};

const getCategoryName = (category: string, t: any) => {
  switch (category) {
    case 'work': return t.work;
    case 'study': return t.study;
    case 'personal': return t.personal;
    default: return category;
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3F2FD', paddingTop: 50 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#2196F3', paddingHorizontal: 20, marginBottom: 15 },
  rtlText: { textAlign: 'right' },
  rtlRow: { flexDirection: 'row-reverse' },
  calendar: { marginHorizontal: 15, borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  tasksSection: { flex: 1, marginTop: 20, paddingHorizontal: 15 },
  dateTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 15 },
  taskItem: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 8 },
  taskText: { flex: 1, fontSize: 14, color: '#333' },
  taskCompleted: { textDecorationLine: 'line-through', color: '#999' },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  categoryText: { fontSize: 11, fontWeight: '600' },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 14, color: '#999', marginTop: 10 },
});
