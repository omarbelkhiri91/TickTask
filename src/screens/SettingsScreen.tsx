import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Switch, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage, Language } from '../context/LanguageContext';
import { useUserStore } from '../stores/userStore';

export default function SettingsScreen({ navigation }: any) {
  const { language, setLanguage, t, rtl } = useLanguage();
  const { user } = useUserStore();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedColor, setSelectedColor] = useState('#2196F3');

  const languages = [
    { code: 'ar' as Language, name: 'العربية', flag: '🇸🇦' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  ];

  const colors = ['#2196F3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0'];

  const getFullName = () => {
    const name = `${user.firstName} ${user.lastName}`.trim();
    return name || t.yourName;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.header, rtl && styles.rtlText]}>{t.settings}</Text>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <TouchableOpacity 
          style={[styles.profileCard, rtl && styles.rtlRow]}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={[styles.profileInfo, rtl && styles.rtlRow]}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={30} color="#fff" />
              </View>
            )}
            <View style={rtl ? { alignItems: 'flex-end' } : {}}>
              <Text style={[styles.profileName, rtl && styles.rtlText]}>{getFullName()}</Text>
              <Text style={[styles.profileEmail, rtl && styles.rtlText]}>
                {user.email || t.notSet}
              </Text>
            </View>
          </View>
          <Ionicons name={rtl ? "chevron-back" : "chevron-forward"} size={20} color="#ccc" />
        </TouchableOpacity>

        {/* Settings Items */}
        <View style={styles.section}>
          <TouchableOpacity style={[styles.item, rtl && styles.rtlRow]} onPress={() => setActiveModal('notifications')}>
            <View style={[styles.itemLeft, rtl && styles.rtlRow]}>
              <View style={[styles.iconBox, { backgroundColor: '#FF9800' }]}>
                <Ionicons name="notifications" size={20} color="#fff" />
              </View>
              <Text style={styles.itemText}>{t.notifications}</Text>
            </View>
            <Ionicons name={rtl ? "chevron-back" : "chevron-forward"} size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.item, rtl && styles.rtlRow]} onPress={() => setActiveModal('appearance')}>
            <View style={[styles.itemLeft, rtl && styles.rtlRow]}>
              <View style={[styles.iconBox, { backgroundColor: '#9C27B0' }]}>
                <Ionicons name="color-palette" size={20} color="#fff" />
              </View>
              <Text style={styles.itemText}>{t.appearance}</Text>
            </View>
            <Ionicons name={rtl ? "chevron-back" : "chevron-forward"} size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.item, rtl && styles.rtlRow]} onPress={() => setActiveModal('language')}>
            <View style={[styles.itemLeft, rtl && styles.rtlRow]}>
              <View style={[styles.iconBox, { backgroundColor: '#2196F3' }]}>
                <Ionicons name="globe" size={20} color="#fff" />
              </View>
              <Text style={styles.itemText}>{t.language}</Text>
            </View>
            <View style={[styles.langBadge, rtl && styles.rtlRow]}>
              <Text style={styles.langBadgeText}>
                {languages.find(l => l.code === language)?.flag}
              </Text>
              <Ionicons name={rtl ? "chevron-back" : "chevron-forward"} size={20} color="#ccc" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={[styles.item, rtl && styles.rtlRow]} onPress={() => setActiveModal('help')}>
            <View style={[styles.itemLeft, rtl && styles.rtlRow]}>
              <View style={[styles.iconBox, { backgroundColor: '#4CAF50' }]}>
                <Ionicons name="help-circle" size={20} color="#fff" />
              </View>
              <Text style={styles.itemText}>{t.help}</Text>
            </View>
            <Ionicons name={rtl ? "chevron-back" : "chevron-forward"} size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.item, rtl && styles.rtlRow]} onPress={() => setActiveModal('about')}>
            <View style={[styles.itemLeft, rtl && styles.rtlRow]}>
              <View style={[styles.iconBox, { backgroundColor: '#607D8B' }]}>
                <Ionicons name="information-circle" size={20} color="#fff" />
              </View>
              <Text style={styles.itemText}>{t.about}</Text>
            </View>
            <Ionicons name={rtl ? "chevron-back" : "chevron-forward"} size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton}>
          <Ionicons name="log-out-outline" size={22} color="#F44336" />
          <Text style={styles.signOutText}>{t.signOut}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modals */}
      <Modal visible={activeModal !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, rtl && styles.rtlRow]}>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {activeModal === 'notifications' ? t.notifications :
                 activeModal === 'appearance' ? t.appearance :
                 activeModal === 'language' ? t.language :
                 activeModal === 'help' ? t.help : t.about}
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.modalBody}>
              {activeModal === 'notifications' && (
                <View style={[styles.switchRow, rtl && styles.rtlRow]}>
                  <Text style={styles.switchText}>{t.enableNotifications}</Text>
                  <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
                </View>
              )}

              {activeModal === 'appearance' && (
                <>
                  <View style={[styles.switchRow, rtl && styles.rtlRow]}>
                    <Text style={styles.switchText}>{t.darkMode}</Text>
                    <Switch value={darkMode} onValueChange={setDarkMode} />
                  </View>
                  <Text style={[styles.label, rtl && styles.rtlText]}>{t.primaryColor}</Text>
                  <View style={styles.colorsRow}>
                    {colors.map(c => (
                      <TouchableOpacity
                        key={c}
                        style={[styles.colorCircle, { backgroundColor: c }, selectedColor === c && styles.colorSelected]}
                        onPress={() => setSelectedColor(c)}
                      />
                    ))}
                  </View>
                </>
              )}

              {activeModal === 'language' && (
                <>
                  {languages.map(lang => (
                    <TouchableOpacity
                      key={lang.code}
                      style={[styles.langItem, language === lang.code && styles.langSelected]}
                      onPress={() => { setLanguage(lang.code); setActiveModal(null); }}
                    >
                      <Text style={styles.langText}>{lang.flag} {lang.name}</Text>
                      {language === lang.code && <Ionicons name="checkmark" size={20} color="#2196F3" />}
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {activeModal === 'help' && (
                <>
                  <Text style={styles.infoText}>📧 support@taskapp.com</Text>
                  <Text style={styles.infoText}>📱 @taskapp</Text>
                </>
              )}

              {activeModal === 'about' && (
                <>
                  <Text style={styles.infoText}>📱 Task Manager App</Text>
                  <Text style={styles.infoText}>{t.version} 1.0.0</Text>
                  <Text style={styles.infoText}>© 2026 {t.allRights}</Text>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#2196F3', paddingHorizontal: 20, marginBottom: 20 },
  rtlText: { textAlign: 'right' },
  rtlRow: { flexDirection: 'row-reverse' },
  content: { flex: 1 },
  
  profileCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', margin: 15, padding: 15, borderRadius: 16 },
  profileInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#2196F3', justifyContent: 'center', alignItems: 'center' },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  profileEmail: { fontSize: 14, color: '#999', marginTop: 2 },
  
  section: { backgroundColor: '#fff', marginHorizontal: 15, marginBottom: 15, borderRadius: 16, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  itemText: { fontSize: 16, color: '#333' },
  langBadge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  langBadgeText: { fontSize: 18 },
  
  signOutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#fff', margin: 15, padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#F44336' },
  signOutText: { fontSize: 16, color: '#F44336', fontWeight: '600' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, minHeight: 250 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  modalBody: { padding: 20 },
  
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  switchText: { fontSize: 16, color: '#333' },
  label: { fontSize: 14, color: '#666', marginTop: 20, marginBottom: 10 },
  colorsRow: { flexDirection: 'row', gap: 15 },
  colorCircle: { width: 40, height: 40, borderRadius: 20 },
  colorSelected: { borderWidth: 3, borderColor: '#333' },
  langItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#f5f5f5', borderRadius: 10, marginBottom: 10 },
  langSelected: { backgroundColor: '#E3F2FD', borderWidth: 1, borderColor: '#2196F3' },
  langText: { fontSize: 16 },
  infoText: { fontSize: 16, color: '#333', textAlign: 'center', marginBottom: 15 },
});
