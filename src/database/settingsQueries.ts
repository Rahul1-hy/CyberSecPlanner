import { db, SettingsItem } from './db';

export async function getAppSettings(): Promise<SettingsItem> {
  return await db.getSettings();
}

export async function updateAppSettings(updates: Partial<SettingsItem>): Promise<SettingsItem> {
  return await db.updateSettings(updates);
}

export async function exportDatabaseBackup(): Promise<string> {
  return await db.exportAllData();
}

export async function restoreDatabaseBackup(jsonString: string): Promise<boolean> {
  return await db.importData(jsonString);
}

export async function resetDatabaseToDefaults(): Promise<void> {
  await db.resetToSeedData();
}
