import { Types, type HydratedDocument, type LeanDocument } from 'mongoose';
import { ProjectModel, type IProject } from '../project.js';

export type CreateProjectDTO = {
  name: string;
  description?: string;
  organization: string;
};

export type UpdateProjectDTO = Partial<CreateProjectDTO>;

type ProjectDocument = HydratedDocument<IProject>;
type ProjectLeanDocument = LeanDocument<IProject>;

function toObjectId(id: string, field = 'id'): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) throw new Error(`Invalid ${field}`);
  return new Types.ObjectId(id);
}

export const ProjectService = {
  async create(data: CreateProjectDTO): Promise<ProjectDocument> {
    return ProjectModel.create({
      name: data.name,
      description: data.description,
      organization: toObjectId(data.organization, 'organization'),
    });
  },

  async getById(id: string): Promise<ProjectDocument | null> {
    const _id = toObjectId(id);
    return ProjectModel.findById(_id).populate('organization').exec();
  },

  async update(id: string, data: UpdateProjectDTO): Promise<ProjectDocument | null> {
    const _id = toObjectId(id);

    const update: Partial<IProject> = {};
    if (data.name !== undefined) update.name = data.name as any;
    if (data.description !== undefined) update.description = data.description as any;
    if (data.organization !== undefined) {
      update.organization = toObjectId(data.organization, 'organization') as any;
    }

    return ProjectModel.findByIdAndUpdate(_id, update, {
      new: true,
      runValidators: true,
    })
      .populate('organization')
      .exec();
  },

  async delete(id: string): Promise<ProjectDocument | null> {
    const _id = toObjectId(id);
    return ProjectModel.findByIdAndDelete(_id).exec();
  },

  async listAll(): Promise<ProjectLeanDocument[]> {
    return ProjectModel.find().lean().exec();
  },
};