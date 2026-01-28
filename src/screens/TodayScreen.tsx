import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import { useTaskStore } from '../stores/taskStore';

const categories = [
  { id: 'all', name: 'الكل', icon: 'infinite' },
  { id: 'work', name: 'عمل', icon: 'briefcase' },
  { id: 'study', name: 'دراسة', icon: 'school' },
  { id: 'personal', name: 'شخصي', icon: 'person' },
];

export default function TodayScreen() {
  const { tasks, addTask, toggleTask } = useTaskStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskReminder, setTaskReminder] = useState(false);
  const [taskCategory, setTaskCategory] = useState('personal');

  const activeTasks = tasks.filter(t => !t.deleted_at);
  
  const filteredTasks = activeTasks.filter(task => {
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pendingCount = activeTasks.filter(t => !t.completed).length;

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle.trim(),
        category: taskCategory,
        dueDate: taskDueDate || undefined,
        reminder: taskReminder,
      });
      setNewTaskTitle('');
      setTaskDueDate('');
      setTaskReminder(false);
      setShowModal(false);
    }
  };

  const quickAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle.trim(),
        category: 'personal',
      });
      setNewTaskTitle('');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'اليوم';
    if (date.toDateString() === tomorrow.toDateString()) return 'غداً';
    return date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateString?: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const renderTask = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.taskItem} 
      onPress={() => toggleTask(item.id)}
      activeOpacity={0.7}
    >
      <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.checkbox}>
        <Ionicons 
          name={item.completed ? 'checkmark-circle' : 'ellipse-outline'} 
          size={26} 
          color={item.completed ? colors.success : colors.primary} 
        />
      </TouchableOpacity>
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, item.completed && styles.completedTask]}>
          {item.title}
        </Text>
        <View style={styles.taskMeta}>
          {item.dueDate && (
            <View style={[styles.dueDateBadge, isOverdue(item.dueDate) && !item.completed && styles.overdueBadge]}>
              <Ionicons name="calendar-outline" size={12} color={isOverdue(item.dueDate) && !item.completed ? colors.danger : colors.textMuted} />
              <Text style={[styles.dueDateText, isOverdue(item.dueDate) && !item.completed && styles.overdueText]}>
                {formatDate(item.dueDate)}
              </Text>
            </View>
          )}
          {item.reminder && (
            <View style={styles.reminderBadge}>
              <Ionicons name="notifications-outline" size={12} color={colors.primary} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>مرحباً، مستخدم! 👋</Text>
          <Text style={styles.subtitle}>{pendingCount} مهام متبقية</Text>
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={() => setShowSearch(!showSearch)}>
          <Ionicons name={showSearch ? 'close' : 'search'} size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن مهمة..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Categories */}
      <View style={styles.categories}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryChip, selectedCategory === cat.id && styles.selectedChip]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Ionicons 
              name={cat.icon as any} 
              size={16} 
              color={selectedCategory === cat.id ? '#FFF' : colors.primary} 
            />
            <Text style={[styles.categoryText, selectedCategory === cat.id && styles.selectedText]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={80} color={colors.border} />
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'لا توجد نتائج' : 'لا توجد مهام بعد'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery ? 'جرب كلمات بحث أخرى' : 'اضغط + لإضافة أول مهمة'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={item => item.id}
          style={styles.taskList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Quick Add Bar */}
      <View style={styles.addTaskBar}>
        <TextInput
          style={styles.addTaskInput}
          placeholder="...أضف مهمة جديدة"
          placeholderTextColor={colors.textMuted}
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          onSubmitEditing={quickAddTask}
        />
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => newTaskTitle.trim() ? setShowModal(true) : null}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Add Task Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>مهمة جديدة</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="عنوان المهمة"
              placeholderTextColor={colors.textMuted}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />

            {/* Category Selection */}
            <Text style={styles.modalLabel}>التصنيف</Text>
            <View style={styles.categoryRow}>
              {categories.filter(c => c.id !== 'all').map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catOption, taskCategory === cat.id && styles.selectedCatOption]}
                  onPress={() => setTaskCategory(cat.id)}
                >
                  <Ionicons name={cat.icon as any} size={18} color={taskCategory === cat.id ? '#FFF' : colors.primary} />
                  <Text style={[styles.catOptionText, taskCategory === cat.id && styles.selectedCatText]}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Due Date */}
            <Text style={styles.modalLabel}>تاريخ الاستحقاق</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity 
                style={[styles.dateOption, taskDueDate === new Date().toISOString().split('T')[0] && styles.selectedDateOption]}
                onPress={() => setTaskDueDate(new Date().toISOString().split('T')[0])}
              >
                <Ionicons name="today" size={18} color={colors.primary} />
                <Text style={styles.dateOptionText}>اليوم</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.dateOption, taskDueDate === new Date(Date.now() + 86400000).toISOString().split('T')[0] && styles.selectedDateOption]}
                onPress={() => setTaskDueDate(new Date(Date.now() + 86400000).toISOString().split('T')[0])}
              >
                <Ionicons name="calendar" size={18} color={colors.primary} />
                <Text style={styles.dateOptionText}>غداً</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.dateOption, taskDueDate === new Date(Date.now() + 604800000).toISOString().split('T')[0] && styles.selectedDateOption]}
                onPress={() => setTaskDueDate(new Date(Date.now() + 604800000).toISOString().split('T')[0])}
              >
                <Ionicons name="calendar-outline" size={18} color={colors.primary} />
                <Text style={styles.dateOptionText}>أسبوع</Text>
              </TouchableOpacity>
            </View>

            {/* Reminder Toggle */}
            <TouchableOpacity 
              style={styles.reminderRow}
              onPress={() => setTaskReminder(!taskReminder)}
            >
              <View style={styles.reminderLeft}>
                <Ionicons name="notifications-outline" size={22} color={colors.primary} />
                <Text style={styles.reminderLabel}>تذكير</Text>
              </View>
              <View style={[styles.toggle, taskReminder && styles.toggleActive]}>
                <View style={[styles.toggleCircle, taskReminder && styles.toggleCircleActive]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleAddTask}>
              <Text style={styles.saveButtonText}>إضافة المهمة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  searchButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, marginHorizontal: 20, marginTop: 12, paddingHorizontal: 16, borderRadius: 12, height: 48 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: colors.text, textAlign: 'right' },
  categories: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 16, gap: 10 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.surface, gap: 6 },
  selectedChip: { backgroundColor: colors.primary },
  categoryText: { fontSize: 14, color: colors.primary, fontWeight: '500' },
  selectedText: { color: '#FFF' },
  taskList: { flex: 1, paddingHorizontal: 20, marginTop: 16 },
  taskItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 10 },
  checkbox: { marginRight: 12 },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 16, color: colors.text },
  completedTask: { textDecorationLine: 'line-through', color: colors.textMuted },
  taskMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
  dueDateBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.border, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, gap: 4 },
  overdueBadge: { backgroundColor: colors.danger + '20' },
  dueDateText: { fontSize: 11, color: colors.textMuted },
  overdueText: { color: colors.danger },
  reminderBadge: { backgroundColor: colors.primary + '20', padding: 4, borderRadius: 6 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 18, color: colors.textMuted, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: colors.textMuted, marginTop: 8 },
  addTaskBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
  addTaskInput: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, fontSize: 16, color: colors.text, textAlign: 'right', marginRight: 12 },
  addButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  modalInput: { backgroundColor: colors.background, padding: 16, borderRadius: 12, fontSize: 16, color: colors.text, textAlign: 'right', marginBottom: 16 },
  modalLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 10, textAlign: 'right' },
  categoryRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  catOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 10, backgroundColor: colors.background, gap: 6 },
  selectedCatOption: { backgroundColor: colors.primary },
  catOptionText: { fontSize: 13, color: colors.primary },
  selectedCatText: { color: '#FFF' },
  dateRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  dateOption: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 10, backgroundColor: colors.background, gap: 4 },
  selectedDateOption: { backgroundColor: colors.primary + '20', borderWidth: 1, borderColor: colors.primary },
  dateOptionText: { fontSize: 12, color: colors.text },
  reminderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: colors.background, borderRadius: 12, marginBottom: 20 },
  reminderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reminderLabel: { fontSize: 16, color: colors.text },
  toggle: { width: 50, height: 28, borderRadius: 14, backgroundColor: colors.border, padding: 2 },
  toggleActive: { backgroundColor: colors.primary },
  toggleCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFF' },
  toggleCircleActive: { marginLeft: 22 },
  saveButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
});
