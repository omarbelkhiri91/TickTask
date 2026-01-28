import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { useCategoryStore, Category, SubCategory } from '../stores/categoryStore';
import { useTaskStore } from '../stores/taskStore';

export default function ListsScreen() {
  const { t, rtl } = useLanguage();
  const { categories, addCategory, addSubCategory, deleteCategory, deleteSubCategory } = useCategoryStore();
  const { tasks } = useTaskStore();
  
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('folder');
  const [selectedColor, setSelectedColor] = useState('#2196F3');

  const icons = ['briefcase', 'school', 'person', 'home', 'wallet', 'heart', 'star', 'flag', 'bookmark', 'bulb', 'rocket', 'fitness', 'cart', 'car', 'airplane', 'game-controller'];
  const colors = ['#2196F3', '#9C27B0', '#4CAF50', '#FF9800', '#E91E63', '#00BCD4', '#795548', '#607D8B', '#F44336', '#3F51B5'];

  const getName = (nameKey: string) => {
    return (t as any)[nameKey] || nameKey;
  };

  const getTaskCount = (categoryId: string, subCategoryId?: string) => {
    return tasks.filter(task => {
      if (task.deleted_at) return false;
      if (subCategoryId) {
        return task.category === categoryId && task.subCategory === subCategoryId;
      }
      return task.category === categoryId;
    }).length;
  };

  const getPendingCount = (categoryId: string, subCategoryId?: string) => {
    return tasks.filter(task => {
      if (task.deleted_at || task.completed) return false;
      if (subCategoryId) {
        return task.category === categoryId && task.subCategory === subCategoryId;
      }
      return task.category === categoryId;
    }).length;
  };

  const handleAddCategory = () => {
    if (newName.trim()) {
      addCategory({
        nameKey: newName,
        icon: selectedIcon,
        color: selectedColor,
      });
      resetForm();
    }
  };

  const handleAddSubCategory = () => {
    if (newName.trim() && selectedCategoryId) {
      addSubCategory(selectedCategoryId, {
        nameKey: newName,
        icon: selectedIcon,
        color: selectedColor,
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setNewName('');
    setSelectedIcon('folder');
    setSelectedColor('#2196F3');
    setShowAddModal(false);
    setShowAddSubModal(false);
    setSelectedCategoryId(null);
  };

  const openAddSubCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setSelectedColor(category.color);
    }
    setShowAddSubModal(true);
  };

  const renderSubCategory = (subCategory: SubCategory, category: Category) => (
    <TouchableOpacity 
      key={subCategory.id} 
      style={[styles.subCategoryItem, rtl && styles.rtlRow]}
      onLongPress={() => deleteSubCategory(category.id, subCategory.id)}
    >
      <View style={[styles.subCategoryLeft, rtl && styles.rtlRow]}>
        <View style={[styles.subIconContainer, { backgroundColor: subCategory.color + '20' }]}>
          <Ionicons name={subCategory.icon as any} size={18} color={subCategory.color} />
        </View>
        <Text style={styles.subCategoryName}>{getName(subCategory.nameKey)}</Text>
      </View>
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{getPendingCount(category.id, subCategory.id)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: Category }) => {
    const isExpanded = expandedCategory === item.id;
    const totalTasks = getTaskCount(item.id);
    const pendingTasks = getPendingCount(item.id);

    return (
      <View style={styles.categoryContainer}>
        <TouchableOpacity 
          style={[styles.categoryItem, rtl && styles.rtlRow]}
          onPress={() => setExpandedCategory(isExpanded ? null : item.id)}
          onLongPress={() => deleteCategory(item.id)}
        >
          <View style={[styles.categoryLeft, rtl && styles.rtlRow]}>
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon as any} size={24} color="#fff" />
            </View>
            <View style={rtl ? { alignItems: 'flex-end' } : {}}>
              <Text style={[styles.categoryName, rtl && styles.rtlText]}>{getName(item.nameKey)}</Text>
              <Text style={[styles.categoryInfo, rtl && styles.rtlText]}>
                {totalTasks} {t.tasks} • {pendingTasks} {t.pending}
              </Text>
            </View>
          </View>
          <View style={[styles.categoryRight, rtl && styles.rtlRow]}>
            <TouchableOpacity 
              style={styles.addSubBtn}
              onPress={() => openAddSubCategory(item.id)}
            >
              <Ionicons name="add-circle-outline" size={22} color={item.color} />
            </TouchableOpacity>
            <Ionicons 
              name={isExpanded ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#999" 
            />
          </View>
        </TouchableOpacity>

        {isExpanded && item.subCategories.length > 0 && (
          <View style={[styles.subCategoriesContainer, rtl ? { marginRight: 20, marginLeft: 5 } : { marginLeft: 20, marginRight: 5 }]}>
            {item.subCategories.map(sub => renderSubCategory(sub, item))}
          </View>
        )}

        {isExpanded && item.subCategories.length === 0 && (
          <View style={[styles.emptySubCategories, rtl ? { marginRight: 20 } : { marginLeft: 20 }]}>
            <Text style={styles.emptyText}>{t.noSubCategories}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, rtl && styles.rtlRow]}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="#2196F3" />
        </TouchableOpacity>
        <Text style={[styles.title, rtl && styles.rtlText]}>{t.myLists}</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategory}
        contentContainerStyle={styles.listContent}
      />

      {/* Add Category Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, rtl && styles.rtlRow]}>
              <TouchableOpacity onPress={resetForm}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{t.addCategory}</Text>
              <TouchableOpacity onPress={handleAddCategory}>
                <Text style={styles.saveText}>{t.save}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.label, rtl && styles.rtlText]}>{t.name}</Text>
              <TextInput
                style={[styles.input, rtl && styles.rtlText]}
                value={newName}
                onChangeText={setNewName}
                placeholder={t.categoryName}
                textAlign={rtl ? 'right' : 'left'}
              />

              <Text style={[styles.label, rtl && styles.rtlText]}>{t.icon}</Text>
              <View style={[styles.iconsGrid, rtl && styles.rtlRow]}>
                {icons.map(icon => (
                  <TouchableOpacity
                    key={icon}
                    style={[styles.iconOption, selectedIcon === icon && { backgroundColor: selectedColor + '30' }]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Ionicons name={icon as any} size={24} color={selectedIcon === icon ? selectedColor : '#666'} />
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, rtl && styles.rtlText]}>{t.color}</Text>
              <View style={[styles.colorsRow, rtl && styles.rtlRow]}>
                {colors.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[styles.colorOption, { backgroundColor: color }, selectedColor === color && styles.colorSelected]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add SubCategory Modal */}
      <Modal visible={showAddSubModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, rtl && styles.rtlRow]}>
              <TouchableOpacity onPress={resetForm}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{t.addSubCategory}</Text>
              <TouchableOpacity onPress={handleAddSubCategory}>
                <Text style={styles.saveText}>{t.save}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={[styles.label, rtl && styles.rtlText]}>{t.name}</Text>
              <TextInput
                style={[styles.input, rtl && styles.rtlText]}
                value={newName}
                onChangeText={setNewName}
                placeholder={t.subCategoryName}
                textAlign={rtl ? 'right' : 'left'}
              />

              <Text style={[styles.label, rtl && styles.rtlText]}>{t.icon}</Text>
              <View style={[styles.iconsGrid, rtl && styles.rtlRow]}>
                {icons.map(icon => (
                  <TouchableOpacity
                    key={icon}
                    style={[styles.iconOption, selectedIcon === icon && { backgroundColor: selectedColor + '30' }]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Ionicons name={icon as any} size={24} color={selectedIcon === icon ? selectedColor : '#666'} />
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, rtl && styles.rtlText]}>{t.color}</Text>
              <View style={[styles.colorsRow, rtl && styles.rtlRow]}>
                {colors.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[styles.colorOption, { backgroundColor: color }, selectedColor === color && styles.colorSelected]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3F2FD', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  rtlRow: { flexDirection: 'row-reverse' },
  rtlText: { textAlign: 'right' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2196F3' },
  addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 15 },
  categoryContainer: { marginBottom: 10 },
  categoryItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: 15, borderRadius: 12 },
  categoryLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  categoryRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconContainer: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  categoryName: { fontSize: 16, fontWeight: '600', color: '#333' },
  categoryInfo: { fontSize: 12, color: '#999', marginTop: 2 },
  addSubBtn: { padding: 5 },
  subCategoriesContainer: { backgroundColor: '#fff', marginTop: 2, borderRadius: 12, overflow: 'hidden' },
  subCategoryItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  subCategoryLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  subIconContainer: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  subCategoryName: { fontSize: 14, color: '#333' },
  countBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  countText: { fontSize: 12, color: '#2196F3', fontWeight: '600' },
  emptySubCategories: { backgroundColor: '#fff', marginTop: 2, borderRadius: 12, padding: 15 },
  emptyText: { fontSize: 13, color: '#999', textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  saveText: { fontSize: 16, color: '#2196F3', fontWeight: '600' },
  modalBody: { padding: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 12, fontSize: 16 },
  iconsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  iconOption: { width: 48, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  colorsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorOption: { width: 40, height: 40, borderRadius: 20 },
  colorSelected: { borderWidth: 3, borderColor: '#333' },
});
