// client-user/src/features/fields/hooks/useFields.js

import { useState, useCallback, useEffect } from 'react';
import userClient from '../../../shared/api/userClient.js';

export const useFields = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fields, setFields] = useState([]);

  const fetchFields = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/fields');
      const data = response.data.data || response.data;
      
      const mappedFields = data.map((field) => ({
        id: field._id || field.id,
        name: field.fieldName || field.name,
        image: field.photo || field.image,
        location: `${field.fieldType || field.type} • ${field.capacity || ''}`,
        isAvailable: Boolean(field.isActive || field.isAvailable),
        originalData: field,
      }));
      
      setFields(mappedFields);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar canchas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const getFieldById = useCallback((id) => {
    return fields.find((field) => field.id === id);
  }, [fields]);

  return {
    fields,
    loading,
    error,
    refetch: fetchFields,
    getFieldById,
  };
};
