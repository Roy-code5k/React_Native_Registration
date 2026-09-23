import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { COLORS } from '../constants/theme';
import {
  getCompetitionDetails,
  registerForCompetition,
  submitEntry,
  login,
  resetRegistration,
} from '../services/api';

import TopHeader from '../components/TopHeader';
import CompetitionHeader from '../components/CompetitionHeader';
import JudgeCard from '../components/JudgeCard';
import CountdownCard from '../components/CountdownCard';
import ImportantDatesCard from '../components/ImportantDatesCard';
import PreviousWinnersCarousel from '../components/PreviousWinnersCarousel';
import CompetitionTabs from '../components/CompetitionTabs';
import RewardsList from '../components/RewardsList';
import ReferralAndPaymentInfo from '../components/ReferralAndPaymentInfo';
import StickyBottomActionBar from '../components/StickyBottomActionBar';
import SubmissionModal from '../components/SubmissionModal';
import VideoModal from '../components/VideoModal';
import DemoToolbar from '../components/DemoToolbar';
import ProfileScreen from './ProfileScreen';
import AuthScreen from './AuthScreen';

export default function CompetitionDetailsScreen() {
  const queryClient = useQueryClient();

  // Navigation view: 'competition' | 'profile' | 'auth'
  const [currentView, setCurrentView] = useState('competition');

  // Selected competition slug
  const [competitionSlug, setCompetitionSlug] = useState('classical-dance-2026');

  // Active user auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Modals state
  const [videoModal, setVideoModal] = useState({ visible: false, url: '', title: '' });
  const [submissionModalVisible, setSubmissionModalVisible] = useState(false);

  // Initialize in Guest mode (unauthenticated)
  // Users can log in or sign up via Profile or Register Now

  const handleSwitchUser = async (email) => {
    if (!email) {
      setCurrentUser(null);
      setAuthToken(null);
      queryClient.invalidateQueries({ queryKey: ['competition', competitionSlug] });
      return;
    }
    try {
      const data = await login(email, 'password123');
      setCurrentUser(data.user);
      setAuthToken(data.token);
      queryClient.invalidateQueries({ queryKey: ['competition', competitionSlug] });
    } catch (err) {
      console.warn('Login failed, proceeding as guest:', err.message);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    queryClient.invalidateQueries({ queryKey: ['competition'] });
    setCurrentView('auth');
  };

  const handleAuthSuccess = ({ user, token }) => {
    setCurrentUser(user);
    setAuthToken(token);
    queryClient.invalidateQueries({ queryKey: ['competition'] });
    setCurrentView('competition');
  };

  // Dynamic Query for Competition Details
  const {
    data: competition,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['competition', competitionSlug, authToken],
    queryFn: () => getCompetitionDetails(competitionSlug, authToken),
    staleTime: 5000,
  });

  // Registration Mutation
  const registerMutation = useMutation({
    mutationFn: () => registerForCompetition(competition.id, authToken),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['competition', competitionSlug] });
      const msg = data.message || 'Successfully registered for this competition!';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Registration Confirmed 🎉', msg);
      }
    },
    onError: (err) => {
      const msg = err.response?.data?.error?.message || err.message || 'Registration failed';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Registration Error', msg);
      }
    },
  });

  // Submission Mutation
  const submitMutation = useMutation({
    mutationFn: (payload) => submitEntry(competition.id, payload, authToken),
    onSuccess: (data) => {
      setSubmissionModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ['competition', competitionSlug] });
      const msg = data.message || 'Submission uploaded successfully!';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Submission Received 🎬', msg);
      }
    },
    onError: (err) => {
      const msg = err.response?.data?.error?.message || err.message || 'Submission failed';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Submission Error', msg);
      }
    },
  });

  // Reset Demo Mutation
  const handleResetRegistration = async () => {
    if (!competition?.id || !authToken) return;
    try {
      await resetRegistration(competition.id, authToken);
      queryClient.invalidateQueries({ queryKey: ['competition', competitionSlug] });
      const msg = 'Registration state reset. You can now test the live registration flow again!';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Reset Complete', msg);
      }
    } catch (err) {
      console.warn('Reset error:', err.message);
    }
  };

  // Primary CTA click action
  const handleCtaPress = () => {
    if (!authToken) {
      setCurrentView('auth');
      return;
    }

    if (competition?.userState?.isRegistered) {
      if (competition?.actions?.canSubmit) {
        setSubmissionModalVisible(true);
      }
      return;
    }

    if (competition?.actions?.canRegister) {
      registerMutation.mutate();
    }
  };

  const handleOpenVideo = (url, title) => {
    setVideoModal({ visible: true, url, title });
  };

  // Profile View
  if (currentView === 'profile' && currentUser) {
    return (
      <ProfileScreen
        user={currentUser}
        onLogout={handleLogout}
        onGoBack={() => setCurrentView('competition')}
        onNavigateCompetitions={() => setCurrentView('competition')}
      />
    );
  }

  // Auth (Login / Sign Up) View
  if (currentView === 'auth') {
    return (
      <AuthScreen
        onAuthSuccess={handleAuthSuccess}
        onCancel={() => setCurrentView('competition')}
      />
    );
  }

  // Loading Screen
  if (isLoading && !competition) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Fetching Competition Details...</Text>
      </SafeAreaView>
    );
  }

  // Error Screen
  if (isError && !competition) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Failed to load competition</Text>
        <Text style={styles.errorMessage}>
          {error?.response?.data?.error?.message || error?.message || 'Server connection error'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isRegistered = competition?.userState?.isRegistered ?? false;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Reviewer Toolbar (Interactive states switch) */}
      <DemoToolbar
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        currentCompSlug={competitionSlug}
        onSelectCompetition={(slug) => setCompetitionSlug(slug)}
        onResetRegistration={handleResetRegistration}
        isRegistered={isRegistered}
        onOpenAuthOrProfile={() => setCurrentView(currentUser ? 'profile' : 'auth')}
      />

      {/* Top Header */}
      <TopHeader onGoBack={() => {}} />

      {/* Scrollable Competition Details Body */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Main Competition Header & Stats */}
        <CompetitionHeader
          competition={competition}
          isRegistered={isRegistered}
        />

        {/* Judge Card */}
        <JudgeCard
          judge={competition?.judge}
          onWatchIntro={(url, title) => handleOpenVideo(url, title)}
        />

        {/* Countdown Banner */}
        <CountdownCard
          registrationEndsAt={competition?.lifecycle?.registrationEndsAt}
          lifecycleState={competition?.lifecycle?.state}
        />

        {/* 2x2 Important Dates Grid */}
        <ImportantDatesCard lifecycle={competition?.lifecycle} />

        {/* Previous Winners Carousel */}
        <PreviousWinnersCarousel
          winners={competition?.previousWinners}
          onWatchVideo={(url, title) => handleOpenVideo(url, title)}
        />

        {/* Dynamic Tabs (About, Judging Parameters, Rules & Eligibility) */}
        <CompetitionTabs
          description={competition?.description}
          judgingParameters={competition?.judgingParameters}
          rules={competition?.rules}
          eligibility={competition?.eligibility}
        />

        {/* Rewards List */}
        <RewardsList rewards={competition?.rewards} />

        {/* Disclaimer, Razorpay Security, Referral Card, Testimonial, Ad */}
        <ReferralAndPaymentInfo
          meta={competition?.meta}
          onWatchVideo={(url, title) => handleOpenVideo(url, title)}
        />

        {/* Bottom padding for sticky action bar */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Sticky Bottom Action Bar with Dynamic CTA & Nav Tabs */}
      <StickyBottomActionBar
        competition={competition}
        userState={competition?.userState}
        actions={competition?.actions}
        onPressAction={handleCtaPress}
        isLoading={registerMutation.isPending || submitMutation.isPending}
        onNavigateProfile={() => setCurrentView(currentUser ? 'profile' : 'auth')}
        onNavigateCompetitions={() => setCurrentView('competition')}
      />

      {/* Submission Modal */}
      <SubmissionModal
        visible={submissionModalVisible}
        onClose={() => setSubmissionModalVisible(false)}
        onSubmit={(payload) => submitMutation.mutate(payload)}
        competitionTitle={competition?.title}
        isSubmitting={submitMutation.isPending}
      />

      {/* Video Preview Modal */}
      <VideoModal
        visible={videoModal.visible}
        onClose={() => setVideoModal({ visible: false, url: '', title: '' })}
        videoUrl={videoModal.url}
        title={videoModal.title}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textMedium,
    fontWeight: '600',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.danger,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
