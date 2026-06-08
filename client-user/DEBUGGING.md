# Guía de Debugging - Client User

## 🔍 Sistema de Logging Implementado

Se ha agregado un sistema completo de logging para ayudarte a identificar problemas con la autenticación.

### Logs Disponibles

Todos los logs aparecerán en la consola del Expo con los prefijos:

- `[AUTH_CLIENT]` - Peticiones al AuthService
- `[USER_CLIENT]` - Peticiones al User Service  
- `[useAuth]` - Hook de autenticación
- `[LoginScreen]` - Pantalla de login
- `[NETWORK_ERROR]` - Errores de red

### 📍 Puntos de Logging Agregados

#### 1. authClient.js
- Request enviado: método, URL
- Response recibida: status, datos
- Errores de red con detalles completos

#### 2. useAuth.js (Hook)
- Credenciales enviadas (sin password)
- Response procesada
- Tokens extraídos
- Guardado en authStore
- Todos los errores con stack trace

#### 3. LoginScreen.jsx
- Form data enviado
- Resultado del login
- Estado de carga
- Errores mostrados

### 🛠️ Cómo Ver los Logs

#### Opción 1: Consola de Expo
```bash
# En la terminal donde corre `expo start`
# Los logs aparecen en tiempo real
```

#### Opción 2: Expo DevTools
```bash
# Presiona 'd' en la terminal o abre http://localhost:19000
# Luego ve a "Logs"
```

#### Opción 3: Panel de Debug en Pantalla (Dev)
```javascript
// Importa en App.jsx:
import DebugPanel from './src/shared/components/common/DebugPanel.jsx';
import { useConsoleLogs } from './src/shared/hooks/useConsoleLogs.js';

// En el componente:
const { logs } = useConsoleLogs();

// Renderiza:
<DebugPanel visible={true} logs={logs} />
```

### 🔴 Errores Comunes Que Verás

#### Error: "No se puede conectar al servidor"
```
[AUTH_CLIENT] Response Error: Network Error
Posibles causas:
- IP del servidor es incorrecta (verifica .env)
- Firewall bloqueando la conexión
- Servidor no está corriendo
- Puerto incorrecto (debe ser 5001)
```

#### Error: "Credenciales inválidas"
```
[useAuth] Response Error: 401
Posibles causas:
- Email o username incorrecto
- Contraseña incorrecta
- Usuario no existe
```

#### Error: "Token expired"
```
[AUTH_CLIENT] Response Error: 401
El refresh token está intentando renovar automáticamente.
Observa si el /refresh endpoint responde correctamente.
```

### 📝 Flujo Completo de Login

```
1. Usuario ingresa credenciales
   └─> [LoginScreen] onSubmit iniciado

2. Se valida el formulario
   └─> [LoginScreen] Datos form: {...}

3. Se envía al servidor
   └─> [AUTH_CLIENT] Request: POST /login

4. Respuesta del servidor
   └─> [AUTH_CLIENT] Response: 200
   └─> [useAuth] Response recibida: {...}

5. Se extrae el token
   └─> [useAuth] Tokens extraídos - accessToken: true, refreshToken: true

6. Se guarda en store
   └─> [useAuth] Guardando en authStore...

7. Éxito o error
   └─> [useAuth] Login exitoso
   └─> [LoginScreen] Resultado login: {success: true}
```

### 🐛 Debugging Paso a Paso

#### Si el botón se queda enganchado:

1. Abre la consola de Expo
2. Busca `[LoginScreen] onSubmit iniciado`
3. Busca `[AUTH_CLIENT] Request: POST /login`
4. Busca `[AUTH_CLIENT] Response` o `[AUTH_CLIENT] Response Error`

Si ves Response pero no ves "Login exitoso", el problema está en procesar la respuesta.

#### Si ves error de conexión:

1. Verifica la IP en `.env`:
   ```
   EXPO_PUBLIC_AUTH_URL=http://192.168.0.104:5001/api/v1/auth
   ```

2. Prueba conectar directamente desde el dispositivo:
   ```bash
   # En el emulador/dispositivo, abre un navegador y prueba:
   http://192.168.0.104:5001/health
   ```

3. Si no funciona, la IP es incorrecta o el servidor no está accesible

### 💡 Tips de Debugging

- Los logs solo aparecen en modo desarrollo (`__DEV__`)
- Los últimos 50 logs se mantienen en memoria
- Los logs desaparecen cuando recarga la app
- Abre la consola ANTES de intentar login para no perder logs

### 📦 Archivos Agregados

- `src/shared/utils/logger.js` - Utilidades de logging
- `src/shared/components/common/DebugPanel.jsx` - Panel visual (opcional)
- `src/shared/hooks/useConsoleLogs.js` - Hook para capturar logs (opcional)

### ✅ Próximos Pasos

1. Intenta hacer login de nuevo
2. Abre la consola de Expo
3. Busca los errores y comparte la salida
4. Con los logs podremos identificar exactamente qué falla
