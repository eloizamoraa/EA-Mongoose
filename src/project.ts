import { Schema, model, Types } from 'mongoose';
import type { IOrganization } from './organization.js';

export interface IProject {
  _id?: string;
  name: string;
  description?: string;
  organization: Types.ObjectId | IOrganization; 
}

const projectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  description: { type: String },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true }, // ✅ enlace
});

export const ProjectModel = model<IProject>('Project', projectSchema);