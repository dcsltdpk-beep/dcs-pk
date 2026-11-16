import mongoose, { Schema, Document, Model } from 'mongoose';
import seedData from '@/database/seed-data.json';

export interface ISetting extends Document {
  key_name: string;
  key_value: string;
}

const SettingSchema = new Schema<ISetting>({
  key_name: { type: String, required: true, unique: true },
  key_value: { type: String, default: '' },
});

export const Setting: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);

export async function getSettingsMap(): Promise<Record<string, string>> {
  try {
    const settings = await Setting.find({}).lean();
    if (settings && settings.length > 0) {
      const map: Record<string, string> = { ...seedData.settings };
      settings.forEach((s) => {
        map[s.key_name] = s.key_value || '';
      });
      return map;
    }
  } catch (err) {
    // Return fallback settings
  }
  return seedData.settings as Record<string, string>;
}
