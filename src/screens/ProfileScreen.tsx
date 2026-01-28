import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../context/LanguageContext';
import { useUserStore } from '../stores/userStore';
import { useTaskStore } from '../stores/taskStore';

export default function ProfileScreen({ navigation }: any) {
  const { t, rtl } = useLanguage();
  const { user, updateProfile, updateSocialLinks, setAvatar } = useUserStore();
  const { tasks } = useTaskStore();
  
  const [editModal, setEditModal] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editValue2, setEditValue2] = useState('');

  // حساب الإحصائيات
  const completedTasks = tasks.filter(t => t.completed && !t.deleted_at).length;
  const totalTasks = tasks.filter(t => !t.deleted_at).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.error, t.permissionRequired);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.error, t.permissionRequired);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      t.changePhoto,
      t.selectOption,
      [
        { text: t.camera, onPress: takePhoto },
        { text: t.gallery, onPress: pickImage },
        { text: t.removePhoto, onPress: () => setAvatar(null), style: 'destructive' },
        { text: t.cancel, style: 'cancel' },
      ]
    );
  };

  const openEditModal = (field: string, value: string, value2?: string) => {
    setEditModal(field);
    setEditValue(value);
    setEditValue2(value2 || '');
  };

  const saveEdit = () => {
    if (!editModal) return;

    switch (editModal) {
      case 'name':
        updateProfile({ firstName: editValue, lastName: editValue2 });
        break;
      case 'email':
        updateProfile({ email: editValue });
        break;
      case 'phone':
        updateProfile({ phone: editValue });
        break;
      case 'bio':
        updateProfile({ bio: editValue });
        break;
      case 'occupation':
        updateProfile({ occupation: editValue, company: editValue2 });
        break;
      case 'location':
        updateProfile({ location: editValue });
        break;
      case 'website':
        updateProfile({ website: editValue });
        break;
      case 'twitter':
        updateSocialLinks({ twitter: editValue });
        break;
      case 'linkedin':
        updateSocialLinks({ linkedin: editValue });
        break;
      case 'github':
        updateSocialLinks({ github: editValue });
        break;
      case 'instagram':
        updateSocialLinks({ instagram: editValue });
        break;
    }
    setEditModal(null);
  };

  const getFullName = () => {
    const name = `${user.firstName} ${user.lastName}`.trim();
    return name || t.yourName;
  };

  const ProfileItem = ({ icon, label, value, field, value2 }: any) => (
    <TouchableOpacity 
      style={[styles.profileItem, rtl && styles.rtlRow]}
      onPress={() => openEditModal(field, value, value2)}
    >
      <View style={[styles.itemLeft, rtl && styles.rtlRow]}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#2196F3" />
        </View>
        <View style={rtl ? { alignItems: 'flex-end' } : {}}>
          <Text style={[styles.itemLabel, rtl && styles.rtlText]}>{label}</Text>
          <Text style={[styles.itemValue, rtl && styles.rtlText, !value && styles.placeholder]}>
            {value || t.notSet}
          </Text>
        </View>
      </View>
      <Ionicons name={rtl ? "chevron-back" : "chevron-forward"} size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const SocialItem = ({ icon, label, value, field, color }: any) => (
    <TouchableOpacity 
      style={[styles.socialItem, rtl && styles.rtlRow]}
      onPress={() => openEditModal(field, value)}
    >
      <View style={[styles.socialIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.socialValue, !value && styles.placeholder]}>
        {value || t.addAccount}
      </Text>
    </TouchableOpacity>
  );

  const StatCard = ({ icon, value, label, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, rtl && styles.rtlRow]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={rtl ? "arrow-forward" : "arrow-back"} size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.profile}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={showImageOptions}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={50} color="#fff" />
              </View>
            )}
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{getFullName()}</Text>
          {user.bio ? <Text style={styles.userBio}>{user.bio}</Text> : null}
          {user.occupation ? (
            <View style={[styles.occupationRow, rtl && styles.rtlRow]}>
              <Ionicons name="briefcase-outline" size={14} color="#666" />
              <Text style={styles.occupationText}>
                {user.occupation}{user.company ? ` ${t.at} ${user.company}` : ''}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <StatCard icon="checkmark-done" value={completedTasks} label={t.completed} color="#4CAF50" />
          <StatCard icon="flame" value={user.stats.streakDays} label={t.streak} color="#FF9800" />
          <StatCard icon="trending-up" value={`${completionRate}%`} label={t.rate} color="#2196F3" />
        </View>

        {/* Personal Info Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, rtl && styles.rtlText]}>{t.personalInfo}</Text>
          <View style={styles.sectionContent}>
            <ProfileItem 
              icon="person-outline" 
              label={t.fullName} 
              value={getFullName() !== t.yourName ? getFullName() : ''} 
              field="name"
              value2={user.lastName}
            />
            <ProfileItem icon="mail-outline" label={t.email} value={user.email} field="email" />
            <ProfileItem icon="call-outline" label={t.phone} value={user.phone} field="phone" />
            <ProfileItem icon="document-text-outline" label={t.bio} value={user.bio} field="bio" />
            <ProfileItem icon="location-outline" label={t.location} value={user.location} field="location" />
          </View>
        </View>

        {/* Work Info Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, rtl && styles.rtlText]}>{t.workInfo}</Text>
          <View style={styles.sectionContent}>
            <ProfileItem 
              icon="briefcase-outline" 
              label={t.occupation} 
              value={user.occupation} 
              field="occupation"
              value2={user.company}
            />
            <ProfileItem icon="globe-outline" label={t.website} value={user.website} field="website" />
          </View>
        </View>

        {/* Social Links Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, rtl && styles.rtlText]}>{t.socialLinks}</Text>
          <View style={styles.socialGrid}>
            <SocialItem icon="logo-twitter" label="Twitter" value={user.socialLinks.twitter} field="twitter" color="#1DA1F2" />
            <SocialItem icon="logo-linkedin" label="LinkedIn" value={user.socialLinks.linkedin} field="linkedin" color="#0A66C2" />
            <SocialItem icon="logo-github" label="GitHub" value={user.socialLinks.github} field="github" color="#333" />
            <SocialItem icon="logo-instagram" label="Instagram" value={user.socialLinks.instagram} field="instagram" color="#E4405F" />
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editModal !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.editModal}>
            <View style={[styles.modalHeader, rtl && styles.rtlRow]}>
              <TouchableOpacity onPress={() => setEditModal(null)}>
                <Text style={styles.cancelText}>{t.cancel}</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{t.edit}</Text>
              <TouchableOpacity onPress={saveEdit}>
                <Text style={styles.saveText}>{t.save}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {editModal === 'name' && (
                <>
                  <Text style={[styles.inputLabel, rtl && styles.rtlText]}>{t.firstName}</Text>
                  <TextInput
                    style={[styles.input, rtl && styles.rtlText]}
                    value={editValue}
                    onChangeText={setEditValue}
                    placeholder={t.firstName}
                    textAlign={rtl ? 'right' : 'left'}
                  />
                  <Text style={[styles.inputLabel, rtl && styles.rtlText]}>{t.lastName}</Text>
                  <TextInput
                    style={[styles.input, rtl && styles.rtlText]}
                    value={editValue2}
                    onChangeText={setEditValue2}
                    placeholder={t.lastName}
                    textAlign={rtl ? 'right' : 'left'}
                  />
                </>
              )}

              {editModal === 'occupation' && (
                <>
                  <Text style={[styles.inputLabel, rtl && styles.rtlText]}>{t.occupation}</Text>
                  <TextInput
                    style={[styles.input, rtl && styles.rtlText]}
                    value={editValue}
                    onChangeText={setEditValue}
                    placeholder={t.occupation}
                    textAlign={rtl ? 'right' : 'left'}
                  />
                  <Text style={[styles.inputLabel, rtl && styles.rtlText]}>{t.company}</Text>
                  <TextInput
                    style={[styles.input, rtl && styles.rtlText]}
                    value={editValue2}
                    onChangeText={setEditValue2}
                    placeholder={t.company}
                    textAlign={rtl ? 'right' : 'left'}
                  />
                </>
              )}

              {editModal === 'bio' && (
                <>
                  <Text style={[styles.inputLabel, rtl && styles.rtlText]}>{t.bio}</Text>
                  <TextInput
                    style={[styles.input, styles.textArea, rtl && styles.rtlText]}
                    value={editValue}
                    onChangeText={setEditValue}
                    placeholder={t.bioPlaceholder}
                    multiline
                    numberOfLines={4}
                    textAlign={rtl ? 'right' : 'left'}
                  />
                </>
              )}

              {['email', 'phone', 'location', 'website', 'twitter', 'linkedin', 'github', 'instagram'].includes(editModal || '') && (
                <>
                  <Text style={[styles.inputLabel, rtl && styles.rtlText]}>
                    {editModal === 'email' ? t.email : 
                     editModal === 'phone' ? t.phone :
                     editModal === 'location' ? t.location :
                     editModal === 'website' ? t.website :
                     editModal}
                  </Text>
                  <TextInput
                    style={[styles.input, rtl && styles.rtlText]}
                    value={editValue}
                    onChangeText={setEditValue}
                    placeholder={
                      editModal === 'email' ? 'example@email.com' :
                      editModal === 'phone' ? '+213 XXX XXX XXX' :
                      editModal === 'website' ? 'https://yourwebsite.com' :
                      `@username`
                    }
                    keyboardType={
                      editModal === 'email' ? 'email-address' :
                      editModal === 'phone' ? 'phone-pad' :
                      editModal === 'website' ? 'url' : 'default'
                    }
                    textAlign={rtl ? 'right' : 'left'}
                    autoCapitalize="none"
                  />
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
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#fff' },
  rtlRow: { flexDirection: 'row-reverse' },
  rtlText: { textAlign: 'right' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  content: { flex: 1 },
  
  // Avatar Section
  avatarSection: { alignItems: 'center', padding: 30, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  avatarContainer: { position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#2196F3', justifyContent: 'center', alignItems: 'center' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, backgroundColor: '#2196F3', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 15 },
  userBio: { fontSize: 14, color: '#666', marginTop: 5, textAlign: 'center', paddingHorizontal: 20 },
  occupationRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  occupationText: { fontSize: 14, color: '#666' },

  // Stats Section
  statsSection: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: '#fff', marginTop: 10 },
  statCard: { alignItems: 'center', padding: 15, borderLeftWidth: 3, paddingLeft: 20 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 5 },
  statLabel: { fontSize: 12, color: '#999', marginTop: 2 },

  // Sections
  section: { marginTop: 10, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#999', padding: 15, paddingBottom: 5, textTransform: 'uppercase' },
  sectionContent: {},

  // Profile Items
  profileItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center' },
  itemLabel: { fontSize: 12, color: '#999' },
  itemValue: { fontSize: 16, color: '#333', marginTop: 2 },
  placeholder: { color: '#ccc', fontStyle: 'italic' },

  // Social Items
  socialGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10 },
  socialItem: { flexDirection: 'row', alignItems: 'center', width: '50%', padding: 10 },
  socialIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  socialValue: { fontSize: 14, color: '#333', flex: 1 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  editModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cancelText: { fontSize: 16, color: '#999' },
  saveText: { fontSize: 16, color: '#2196F3', fontWeight: '600' },
  modalBody: { padding: 20 },
  inputLabel: { fontSize: 14, color: '#666', marginBottom: 8, marginTop: 10 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 15, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
});
