// client-user/src/shared/utils/logger.js

/**
 * Sistema de logging centralizado para debugging
 */

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

const isDevelopment = __DEV__; // Expo variable para desarrollo

const log = (level, module, message, data = null) => {
  if (!isDevelopment) return;

  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${module}] [${level}]`;
  
  if (data) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
};

export const logger = {
  debug: (module, message, data) => log(LOG_LEVELS.DEBUG, module, message, data),
  info: (module, message, data) => log(LOG_LEVELS.INFO, module, message, data),
  warn: (module, message, data) => log(LOG_LEVELS.WARN, module, message, data),
  error: (module, message, data) => log(LOG_LEVELS.ERROR, module, message, data),
};

/**
 * Mejora la lectura de errores de red
 */
export const getNetworkErrorMessage = (error) => {
  const errorInfo = {
    message: error.message,
    code: error.code,
    status: error.response?.status,
    data: error.response?.data,
    url: error.config?.url,
    baseURL: error.config?.baseURL,
  };
  
  console.error('[NETWORK_ERROR_DETAILS]', JSON.stringify(errorInfo, null, 2));

  // Errores de conexión de red (sin servidor respondiendo)
  if (error.code === 'ERR_NETWORK') {
    console.error('[NETWORK_ERROR] ERR_NETWORK - No hay conectividad con el servidor');
    return `❌ Error de conexión: No se puede alcanzar el servidor en ${error.config?.baseURL || 'la URL configurada'}. Verifica:\n1. Que el servidor esté corriendo\n2. Que la IP sea correcta (actualmente: ${error.config?.baseURL})\n3. Tu conexión de red`;
  }

  // Timeout
  if (error.code === 'ECONNABORTED') {
    return `⏱️ Timeout: La solicitud tardó demasiado tiempo. El servidor ${error.config?.baseURL} no respondió a tiempo.`;
  }

  // Host no encontrado
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return `🔴 No se puede conectar a ${error.config?.baseURL}. Verifica que la IP y puerto sean correctos.`;
  }

  // Errores HTTP
  if (error.response?.status === 401) {
    return 'Credenciales inválidas. Verifica tu email/usuario y contraseña.';
  }

  if (error.response?.status === 403) {
    return 'No tienes permiso para acceder. Contacta al administrador.';
  }

  if (error.response?.status === 404) {
    return 'El servidor no encontró el recurso. Verifica la configuración.';
  }

  if (error.response?.status === 500) {
    return 'Error del servidor. Por favor, intenta más tarde.';
  }

  if (error.response?.status >= 500) {
    return 'El servidor está experimentando problemas. Por favor, intenta más tarde.';
  }

  // Mensaje personalizado del servidor
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.data?.message) {
    return error.response.data.data.message;
  }

  // Error genérico
  return error.message || 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
};
