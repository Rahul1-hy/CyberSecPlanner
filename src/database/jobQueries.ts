import { db, JobItem } from './db';

export async function getAllJobs(): Promise<JobItem[]> {
  return await db.getJobs();
}

export async function getJobById(id: string): Promise<JobItem | undefined> {
  const jobs = await db.getJobs();
  return jobs.find((j) => j.id === id);
}

export async function createJob(
  jobData: Omit<JobItem, 'id' | 'created_at' | 'updated_at'>
): Promise<JobItem> {
  const newJob: JobItem = {
    ...jobData,
    id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return await db.saveJob(newJob);
}

export async function updateJob(job: JobItem): Promise<JobItem> {
  return await db.saveJob(job);
}

export async function updateJobStatus(
  id: string,
  status: JobItem['status']
): Promise<JobItem | null> {
  const job = await getJobById(id);
  if (!job) return null;

  const updated: JobItem = {
    ...job,
    status,
    updated_at: new Date().toISOString(),
  };

  return await db.saveJob(updated);
}

export async function deleteJob(id: string): Promise<boolean> {
  return await db.deleteJob(id);
}

export async function getJobPipelineStats(): Promise<{
  Wishlist: number;
  Applied: number;
  Assessment: number;
  Interview: number;
  Selected: number;
  Rejected: number;
  total: number;
}> {
  const jobs = await getAllJobs();
  const stats = {
    Wishlist: 0,
    Applied: 0,
    Assessment: 0,
    Interview: 0,
    Selected: 0,
    Rejected: 0,
    total: jobs.length,
  };

  jobs.forEach((job) => {
    if (job.status in stats) {
      stats[job.status as keyof typeof stats]++;
    }
  });

  return stats;
}
