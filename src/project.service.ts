import { Types } from 'mongoose';
import { ProjectModel, type IProject } from './project.js';

export type CreateProjectDTO = {
  name: string;
  description?: string;
  organization: string; // id en string
};

export type UpdateProjectDTO = Partial<CreateProjectDTO>;

function toObjectId(id: string, field = 'id'): Types.ObjectId {
  if (!Types.ObjectId.isValid(id)) throw new Error(`Invalid ${field}`);
  return new Types.ObjectId(id);
}

export const ProjectService = {
  // create: Guarda
  async create(data: CreateProjectDTO) {
    return ProjectModel.create({
      name: data.name,
      description: data.description,
      organization: toObjectId(data.organization, 'organization'),
    });
  },

  // getById(id): Retorna amb el seu populate de la col·lecció enllaçada
  async getById(id: string) {
    const _id = toObjectId(id);
    return ProjectModel.findById(_id).populate('organization').exec();
  },

  // update(id, data): Modifica les dades
  async update(id: string, data: UpdateProjectDTO) {
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

  // delete(id): Elimina
  async delete(id: string) {
    const _id = toObjectId(id);
    return ProjectModel.findByIdAndDelete(_id).exec();
  },

  // listAll(): Llista tots els documents usant .lean()
  async listAll() {
    return ProjectModel.find().lean().exec(); // ✅ requisito
  },
};