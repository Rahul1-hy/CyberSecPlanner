import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../src/components/Header';
import { JobCard } from '../../src/components/JobCard';
import { EmptyState } from '../../src/components/EmptyState';
import { DeleteModal } from '../../src/components/DeleteModal';
import { COLORS } from '../../src/constants/theme';
import { JOB_STAGES } from '../../src/constants/categories';
import { JobItem } from '../../src/database/db';
import {
  getAllJobs,
  updateJobStatus,
  deleteJob,
  getJobPipelineStats,
} from '../../src/database/jobQueries';

export default function JobsScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [stats, setStats] = useState({
    Wishlist: 0,
    Applied: 0,
    Assessment: 0,
    Interview: 0,
    Selected: 0,
    Rejected: 0,
    total: 0,
  });
  const [activeStage, setActiveStage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Delete modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  const loadJobs = async () => {
    try {
      const [allJobs, pipelineStats] = await Promise.all([
        getAllJobs(),
        getJobPipelineStats(),
      ]);
      setJobs(allJobs);
      setStats(pipelineStats);
    } catch (err) {
      console.warn('Failed to load jobs', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadJobs();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const handleStatusChange = async (id: string, nextStatus: JobItem['status']) => {
    await updateJobStatus(id, nextStatus);
    await loadJobs();
  };

  const handleDeleteRequest = (id: string) => {
    setJobToDelete(id);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (jobToDelete) {
      await deleteJob(jobToDelete);
      setJobToDelete(null);
      setDeleteModalVisible(false);
      await loadJobs();
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (activeStage !== 'All' && job.status !== activeStage) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchComp = job.company.toLowerCase().includes(q);
      const matchRole = job.role.toLowerCase().includes(q);
      const matchLoc = job.location?.toLowerCase().includes(q);
      const matchNotes = job.notes?.toLowerCase().includes(q);
      if (!matchComp && !matchRole && !matchLoc && !matchNotes) return false;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <Header title="Cyber Job Tracker" subtitle="Application pipeline & interview readiness" />

      {/* Pipeline Summary Funnel */}
      <View style={styles.pipelineWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pipelineScroll}>
          {JOB_STAGES.map((st) => {
            const count = stats[st.id as keyof typeof stats] || 0;
            const isSelected = activeStage === st.id;
            return (
              <TouchableOpacity
                key={st.id}
                style={[
                  styles.funnelCard,
                  isSelected && { borderColor: st.color, backgroundColor: `${st.color}15` },
                ]}
                onPress={() => setActiveStage(isSelected ? 'All' : st.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.funnelIconWrap, { backgroundColor: `${st.color}20` }]}>
                  <Text style={[styles.funnelCount, { color: st.color }]}>{count}</Text>
                </View>
                <Text style={[styles.funnelLabel, isSelected && { color: st.color }]}>
                  {st.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Search & Add Action */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search companies, roles, locations..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/jobs/add' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color={COLORS.background} />
        </TouchableOpacity>
      </View>

      {/* Active Stage Indicator */}
      {activeStage !== 'All' && (
        <View style={styles.activeFilterRow}>
          <Text style={styles.activeFilterText}>
            Showing stage: <Text style={{ color: COLORS.secondary, fontWeight: '800' }}>{activeStage}</Text>
          </Text>
          <TouchableOpacity onPress={() => setActiveStage('All')}>
            <Text style={styles.clearFilterText}>Show All ({stats.total})</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Jobs List */}
      <ScrollView
        style={styles.jobsList}
        contentContainerStyle={styles.jobsListContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {filteredJobs.length === 0 ? (
          <EmptyState
            icon="briefcase-outline"
            title="No Job Applications"
            description={
              searchQuery
                ? 'No jobs match your search filters.'
                : activeStage !== 'All'
                ? `No jobs found in the "${activeStage}" stage.`
                : 'Start tracking SOC Analyst, Pentester, or Security Engineer jobs!'
            }
            actionLabel="+ Track New Job"
            onAction={() => router.push('/jobs/add' as any)}
          />
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onPress={(j) => router.push(`/jobs/${j.id}` as any)}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteRequest}
            />
          ))
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        visible={deleteModalVisible}
        title="Delete Job Entry?"
        message="Are you sure you want to remove this job application from your tracker?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  pipelineWrapper: {
    marginBottom: 10,
  },
  pipelineScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  funnelCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  funnelIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  funnelCount: {
    fontSize: 16,
    fontWeight: '800',
  },
  funnelLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  activeFilterText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  clearFilterText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  jobsList: {
    flex: 1,
  },
  jobsListContent: {
    paddingHorizontal: 20,
  },
});
