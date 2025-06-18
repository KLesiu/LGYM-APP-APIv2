import { Platforms } from '../enums/Platforms';
import Schema from './configModels'
import mongoose from 'mongoose';


export interface AppConfigEntity extends Document {
    platform: Platforms;
    minRequiredVersion: string;
    latestVersion: string;
    forceUpdate: boolean;
    updateUrl: string;
    releaseNotes?: string;
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

const AppConfigSchema = new Schema({
  platform: {
    type: String,
    enum: [Platforms.ANDROID, Platforms.IOS],
    required: true
  },
  minRequiredVersion: {
    type: String,
    required: true
  },
  latestVersion: {
    type: String,
    required: true
  },
  forceUpdate: {
    type: Boolean,
    default: false
  },
  updateUrl: {
    type: String,
    required: true
  },
  releaseNotes: {
    type: String
  },
},{
    timestamps:true
});


const AppConfig = mongoose.model<AppConfigEntity>('AppConfig', AppConfigSchema);
export default AppConfig;
