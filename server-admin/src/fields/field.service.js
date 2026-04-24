import Field from './field.model.js';
import { cloudinary } from '../../middlewares/file-uploader.js';

export const fetchFields = async ({
  page = 1,
  limit = 10,
  isActive = true,
}) => {
  const filter = { isActive };
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  const fields = await Field.find(filter)
    .limit(limitNumber * 1)
    .skip((pageNumber - 1) * limitNumber)
    .sort({ createdAt: -1 });

  const total = await Field.countDocuments(filter);

  return {
    fields,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      limit,
    },
  };
};

export const fetchFieldById = async (id) => {
  return Field.findById(id);
};

export const createFieldRecord = async ({ fieldData, file }) => {
  const data = { ...fieldData };

  if (file) {
    data.photo = file.path; // ✅ file.path ya trae la URL completa de Cloudinary
  }

  const field = new Field(data);
  await field.save();
  return field;
};

export const updateFieldRecord = async ({ id, updateData, file }) => {
  const data = { ...updateData };

  if (file) {
    const currentField = await Field.findById(id);

    if (currentField?.photo) {
      try {
        // Extraer public_id de la URL para poder eliminarlo
        const publicId = currentField.photo
          .split('/upload/')[1]
          .replace(/^v\d+\//, ''); // quita el versionado si existe

        await cloudinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.error(`Error al eliminar imagen anterior: ${deleteError.message}`);
      }
    }

    data.photo = file.path; // ✅ URL completa
  }

  return Field.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const updateFieldStatus = async ({ id, isActive }) => {
  return Field.findByIdAndUpdate(id, { isActive }, { new: true });
};