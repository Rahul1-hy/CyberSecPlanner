import { db, SkillItem } from './db';

export async function getAllSkills(): Promise<SkillItem[]> {
  return await db.getSkills();
}

export async function updateSkillProgress(id: string, progress: number): Promise<void> {
  await db.updateSkill(id, progress);
}

export async function getAverageSkillProgress(): Promise<number> {
  const skills = await db.getSkills();
  if (!skills.length) return 0;
  const sum = skills.reduce((acc, s) => acc + s.progress, 0);
  return Math.round(sum / skills.length);
}
