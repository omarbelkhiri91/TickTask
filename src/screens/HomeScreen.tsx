import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, ScrollView, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTaskStore, Task } from '../stores/taskStore';
import { useCategoryStore } from '../stores/categoryStore';
import { useLanguage } from '../context/LanguageContext';
import { useUserStore } from '../stores/userStore';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | undefined>(undefined);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState('');
  const [taskSubCategory, setTaskSubCategory] = useState('');

  const categoriesScrollRef = useRef<ScrollView>(null);
  const subCategoriesScrollRef = useRef<ScrollView>(null);

  const { tasks, addTask, toggleTask, deleteTask } = useTaskStore();
  const { categories } = useCategoryStore();
  const { t, rtl } = useLanguage();
  const { user } = useUserStore();

  useEffect(() => {
    if (rtl && categoriesScrollRef.current) {
      setTimeout(() => {
        categoriesScrollRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [rtl]);

  const getName = (nameKey: string) => {
    return (t as any)[nameKey] || nameKey;
  };

  // الحصول على اسم المستخدم
  const getUserName = () => {
    if (user.firstName) {
      return user.firstName;
    }
    return t.user;
  };

  const filteredTasks = tasks.filter(task => {
    if (task.deleted_at) return false;
    if (selectedCategory === 'all') return true;
    if (selectedSubCategory) {
      return task.category === selectedCategory && task.subCategory === selectedSubCategory;
    }
    return task.category === selectedCategory;
  });

  const remainingTasks = tasks.filter(task => !task.deleted_at && !task.completed).length;

  const handleQuickAddTask = () => {
    if (newTask.trim()) {
      addTask({ 
        title: newTask, 
        category: selectedCategory === 'all' ? 'personal' : selectedCategory,
        subCategory: selectedSubCategory,
      });
      setNewTask('');
    }
  };

  const handleAddTaskWithCategory = () => {
    if (taskTitle.trim() && taskCategory) {
      addTask({ 
        title: taskTitle, 
        category: taskCategory,
        subCategory: taskSubCategory || undefined,
      });
      setTaskTitle('');
      setTaskCategory('');
      setTaskSubCategory('');
      setShowAddTaskModal(false);
    }
  };

  const handleTaskLongPress = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
    }
    setShowTaskModal(false);
  };

  const handleCategoryPress = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory('all');
      setSelectedSubCategory(undefined);
    } else {
      setSelectedCategory(categoryId);
      setSelectedSubCategory(undefined);
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  const getSubCategoryInfo = (categoryId: string, subCategoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.subCategories.find(s => s.id === subCategoryId);
  };

  const selectedCategoryData = categories.find(c => c.id === taskCategory);
  const currentCategorySubCategories = getCategoryInfo(selectedCategory)?.subCategories || [];

  const allCategories = [
    { id: 'all', nameKey: 'all', icon: 'infinite', color: '#2196F3', isAll: true },
    ...categories
  ];
  const displayCategories = rtl ? [...allCategories].reverse() : allCategories;
  const displaySubCategories = rtl ? [...currentCategorySubCategories].reverse() : currentCategorySubCategories;

  return (
    <View style={styles.container}>
      <View style={[styles.header, rtl && styles.rtlRow]}>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#2196F3" />
        </TouchableOpacity>
        <View style={[styles.userInfo, rtl && styles.rtlRow]}>
          <View style={rtl ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }}>
            <Text style={[styles.greeting, rtl && styles.rtlText]}>{t.hello}، {getUserName()}! 👋</Text>
            <Text style={[styles.subtitle, rtl && styles.rtlText]}>{remainingTasks} {t.tasksRemaining}</Text>
          </View>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color="#fff" />
            </View>
          )}
        </View>
      </View>

      {/* التصنيفات الرئيسية */}
      <ScrollView 
        ref={categoriesScrollRef}
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesScroll}
        contentContainerStyle={[
          styles.categoriesContent,
          rtl && { justifyContent: 'flex-end', minWidth: screenWidth }
        ]}
        onContentSizeChange={() => {
          if (rtl && categoriesScrollRef.current) {
            categoriesScrollRef.current.scrollToEnd({ animated: false });
          }
        }}
      >
        {displayCategories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryBtn, 
              selectedCategory === cat.id && (cat.id === 'all' 
                ? styles.categoryActive 
                : { backgroundColor: cat.color, borderColor: cat.color })
            ]}
            onPress={() => handleCategoryPress(cat.id)}
          >
            <Ionicons 
              name={cat.icon as any} 
              size={16} 
              color={selectedCategory === cat.id ? '#fff' : cat.color} 
            />
            <Text style={[
              styles.categoryText, 
              { color: selectedCategory === cat.id ? '#fff' : cat.color }
            ]}>
              {getName(cat.nameKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* التصنيفات الفرعية */}
      {selectedCategory !== 'all' && displaySubCategories.length > 0 && (
        <ScrollView 
          ref={subCategoriesScrollRef}
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.subCategoriesScroll}
          contentContainerStyle={[
            styles.subCategoriesContent,
            rtl && { justifyContent: 'flex-end', minWidth: screenWidth }
          ]}
          onContentSizeChange={() => {
            if (rtl && subCategoriesScrollRef.current) {
              subCategoriesScrollRef.current.scrollToEnd({ animated: false });
            }
          }}
        >
          {displaySubCategories.map(sub => (
            <TouchableOpacity
              key={sub.id}
              style={[
                styles.subCategoryBtn,
                selectedSubCategory === sub.id && { backgroundColor: sub.color + '30', borderColor: sub.color }
              ]}
              onPress={() => setSelectedSubCategory(selectedSubCategory === sub.id ? undefined : sub.id)}
            >
              <Ionicons name={sub.icon as any} size={14} color={sub.color} />
              <Text style={[styles.subCategoryText, { color: sub.color }]}>
                {getName(sub.nameKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        style={styles.taskList}
        renderItem={({ item }) => {
          const catInfo = getCategoryInfo(item.category);
          const subCatInfo = item.subCategory ? getSubCategoryInfo(item.category, item.subCategory) : null;
          
          return (
            <TouchableOpacity 
              style={[styles.taskItem, rtl && styles.rtlRow]} 
              onPress={() => toggleTask(item.id)}
              onLongPress={() => handleTaskLongPress(item)}
            >
              <Ionicons
                name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={item.completed ? '#4CAF50' : catInfo?.color || '#2196F3'}
              />
              <View style={[styles.taskContent, rtl && { alignItems: 'flex-end' }]}>
                <Text style={[styles.taskText, item.completed && styles.taskCompleted, rtl && styles.rtlText]}>
                  {item.title}
                </Text>
                <View style={[styles.taskBadges, rtl && styles.rtlRow]}>
                  {catInfo && (
                    <View style={[styles.badge, { backgroundColor: catInfo.color + '20' }]}>
                      <Ionicons name={catInfo.icon as any} size={10} color={catInfo.color} />
                      <Text style={[styles.badgeText, { color: catInfo.color }]}>{getName(catInfo.nameKey)}</Text>
                    </View>
                  )}
                  {subCatInfo && (
                    <View style={[styles.badge, { backgroundColor: subCatInfo.color + '20' }]}>
                      <Ionicons name={subCatInfo.icon as any} size={10} color={subCatInfo.color} />
                      <Text style={[styles.badgeText, { color: subCatInfo.color }]}>{getName(subCatInfo.nameKey)}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>{t.noTasks}</Text>
            <Text style={styles.emptySubtext}>{t.addFirstTask}</Text>
          </View>
        }
      />

      <View style={[styles.inputContainer, rtl && styles.rtlRow]}>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddTaskModal(true)}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, rtl && styles.rtlText]}
          placeholder={t.addNewTask}
          placeholderTextColor="#999"
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={handleQuickAddTask}
          textAlign={rtl ? 'right' : 'left'}
        />
      </View>

      {/* Task Options Modal */}
      <Modal visible={showTaskModal} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowTaskModal(false)}
        >
          <View style={styles.optionsModal}>
            <Text style={styles.optionsTitle}>{t.taskOptions}</Text>
            <TouchableOpacity style={[styles.optionItem, rtl && styles.rtlRow]} onPress={handleDeleteTask}>
              <Ionicons name="trash-outline" size={24} color="#F44336" />
              <Text style={[styles.optionText, { color: '#F44336' }]}>{t.delete}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.optionItem, styles.cancelOption]} 
              onPress={() => setShowTaskModal(false)}
            >
              <Text style={styles.cancelText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add Task Modal */}
      <Modal visible={showAddTaskModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.addTaskModal}>
            <View style={[styles.modalHeader, rtl && styles.rtlRow]}>
              <TouchableOpacity onPress={() => setShowAddTaskModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{t.addNewTask}</Text>
              <TouchableOpacity onPress={handleAddTaskWithCategory}>
                <Text style={styles.saveText}>{t.save}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.label, rtl && styles.rtlText]}>{t.name}</Text>
              <TextInput
                style={[styles.textInput, rtl && styles.rtlText]}
                value={taskTitle}
                onChangeText={setTaskTitle}
                placeholder={t.addNewTask}
                textAlign={rtl ? 'right' : 'left'}
              />

              <Text style={[styles.label, rtl && styles.rtlText]}>{t.selectCategory}</Text>
              <View style={[styles.categoryGrid, rtl && styles.rtlWrap]}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryOption,
                      taskCategory === cat.id && { backgroundColor: cat.color, borderColor: cat.color }
                    ]}
                    onPress={() => {
                      setTaskCategory(cat.id);
                      setTaskSubCategory('');
                    }}
                  >
                    <Ionicons 
                      name={cat.icon as any} 
                      size={20} 
                      color={taskCategory === cat.id ? '#fff' : cat.color} 
                    />
                    <Text style={{ color: taskCategory === cat.id ? '#fff' : cat.color, fontSize: 12 }}>
                      {getName(cat.nameKey)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedCategoryData && selectedCategoryData.subCategories.length > 0 && (
                <>
                  <Text style={[styles.label, rtl && styles.rtlText]}>{t.selectSubCategory}</Text>
                  <View style={[styles.subCategoryGrid, rtl && styles.rtlWrap]}>
                    {selectedCategoryData.subCategories.map(sub => (
                      <TouchableOpacity
                        key={sub.id}
                        style={[
                          styles.subCategoryOption,
                          taskSubCategory === sub.id && { backgroundColor: sub.color + '30', borderColor: sub.color }
                        ]}
                        onPress={() => setTaskSubCategory(taskSubCategory === sub.id ? '' : sub.id)}
                      >
                        <Ionicons name={sub.icon as any} size={16} color={sub.color} />
                        <Text style={{ color: sub.color, fontSize: 11 }}>{getName(sub.nameKey)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3F2FD' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50 },
  rtlRow: { flexDirection: 'row-reverse' },
  rtlText: { textAlign: 'right' },
  rtlWrap: { flexDirection: 'row-reverse', flexWrap: 'wrap' },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  userAvatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#2196F3' },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#2196F3', justifyContent: 'center', alignItems: 'center' },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  searchButton: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  categoriesScroll: { maxHeight: 50, marginBottom: 10 },
  categoriesContent: { paddingHorizontal: 15, gap: 10, flexDirection: 'row' },
  categoryBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#2196F3' },
  categoryActive: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
  categoryText: { color: '#2196F3', fontWeight: '600', fontSize: 13 },
  categoryTextActive: { color: '#fff' },
  subCategoriesScroll: { maxHeight: 40, marginBottom: 10 },
  subCategoriesContent: { paddingHorizontal: 15, gap: 8, flexDirection: 'row' },
  subCategoryBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  subCategoryText: { fontSize: 12, fontWeight: '500' },
  taskList: { flex: 1, paddingHorizontal: 15 },
  taskItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10 },
  taskContent: { flex: 1 },
  taskText: { fontSize: 16, color: '#333' },
  taskCompleted: { textDecorationLine: 'line-through', color: '#999' },
  taskBadges: { flexDirection: 'row', gap: 6, marginTop: 6 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '600' },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, color: '#999', marginTop: 15 },
  emptySubtext: { fontSize: 14, color: '#ccc', marginTop: 5 },
  inputContainer: { flexDirection: 'row', padding: 15, gap: 10, backgroundColor: '#E3F2FD' },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, fontSize: 16 },
  addButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#2196F3', justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  optionsModal: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '80%' },
  optionsTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 20 },
  optionItem: { flexDirection: 'row', alignItems: 'center', gap: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  optionText: { fontSize: 16, color: '#333' },
  cancelOption: { borderBottomWidth: 0, justifyContent: 'center' },
  cancelText: { fontSize: 16, color: '#666', textAlign: 'center' },
  addTaskModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, width: '100%', maxHeight: '80%', position: 'absolute', bottom: 0 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  saveText: { fontSize: 16, color: '#2196F3', fontWeight: '600' },
  modalBody: { padding: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 8, marginTop: 15 },
  textInput: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 12, fontSize: 16 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryOption: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  subCategoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  subCategoryOption: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
});
