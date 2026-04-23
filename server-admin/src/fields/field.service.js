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
    // Guardar SOLO el public_id
    data.photo = `kinal_sports_in6am/fields/${file.filename}`;
  } else {
    data.photo = 'kinal_sports_in6am/fields/j9fr1ebmfxw1to7llzpy';
  }

  const field = new Field(data);
  await field.save();
  return field;
};

export const updateFieldRecord = async ({ id, updateData, file }) => {
  const data = { ...updateData };

  if (file) {
    const currentField = await Field.findById(id);

    if (currentField && currentField.photo) {
      try {
        // Ahora photo ya es public_id directamente
        await cloudinary.uploader.destroy(currentField.photo);
      } catch (deleteError) {
        console.error(`Error al eliminar imagen anterior: ${deleteError.message}`);
      }
    }

    // Guardar nuevo public_id
    data.photo = `kinal_sports_in6am/fields/${file.filename}`;
  }

  return Field.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const updateFieldStatus = async ({ id, isActive }) => {
  return Field.findByIdAndUpdate(id, { isActive }, { new: true });
};
