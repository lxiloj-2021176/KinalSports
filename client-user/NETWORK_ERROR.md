# Diagnóstico de Conectividad - ERR_NETWORK

El error `ERR_NETWORK` significa que **la aplicación NO puede alcanzar el servidor**.

## 🔴 Soluciones Inmediatas

### 1️⃣ Verifica que el AuthService esté corriendo

```bash
# Abre una terminal en auth-service-dotnet
cd auth-service-dotnet\src\AuthService.Api

# Ejecuta el servidor
dotnet run

# Deberías ver:
# [INFO] AuthService API is running at http://localhost:5001
```

### 2️⃣ Verifica la IP en el .env

El archivo `client-user/.env` tiene:
```
EXPO_PUBLIC_AUTH_URL=http://192.168.0.104:5001/api/v1/auth
```

**¿Cuál es tu IP actual?**

#### Opción A: En el emulador Android/iOS
```
# Si estás usando emulador Android:
- Cambia 192.168.0.104 a 10.0.2.2 (es cómo Android emulador ve localhost)
```

#### Opción B: En dispositivo físico
```
# Si estás usando dispositivo físico:
- 192.168.0.104 debe ser la IP de tu máquina
- Verifica en tu máquina con: ipconfig (Windows) o ifconfig (Mac/Linux)
- La IP debe estar en el mismo rango (192.168.0.x)
```

### 3️⃣ Prueba de Conectividad

#### Desde tu máquina de desarrollo:
```bash
# Windows
ping 192.168.0.104

# Intenta acceder en el navegador:
http://192.168.0.104:5001/health
```

#### Desde el emulador/dispositivo:
```
# En Android Emulator, abre el navegador (en el emulador) e intenta:
http://10.0.2.2:5001/health

# En dispositivo físico, abre el navegador e intenta:
http://192.168.0.104:5001/health
```

## 🔍 Nuevos Logs de Diagnóstico

Ahora los logs te dirán más claramente:

```
[AUTH_CLIENT] Inicializado con baseURL: http://192.168.0.104:5001/api/v1/auth
[AUTH_CLIENT] 🔵 Request: POST http://192.168.0.104:5001/api/v1/auth/login
[AUTH_CLIENT] ❌ Response Error: {
  message: "Network Error",
  code: "ERR_NETWORK",
  url: "/login",
  baseURL: "http://192.168.0.104:5001/api/v1/auth"
}
```

## 📋 Checklist

- [ ] AuthService (.NET) está corriendo en puerto 5001
- [ ] IP en .env es correcta (usa `10.0.2.2` si es emulador)
- [ ] Puedo acceder a `http://[IP]:5001/health` desde el navegador del emulador/dispositivo
- [ ] No hay firewall bloqueando el puerto 5001
- [ ] La máquina de desarrollo está en la misma red que el dispositivo (si es físico)

## 🛠️ Cambiar la IP Rápidamente

### Si usas Android Emulator:
```env
EXPO_PUBLIC_AUTH_URL=http://10.0.2.2:5001/api/v1/auth
EXPO_PUBLIC_USER_URL=http://10.0.2.2:3008/kinalSportsUser/v1
```

### Si usas dispositivo físico:
```env
# Reemplaza 192.168.0.104 con tu IP real
EXPO_PUBLIC_AUTH_URL=http://[TU_IP]:5001/api/v1/auth
EXPO_PUBLIC_USER_URL=http://[TU_IP]:3008/kinalSportsUser/v1
```

## 💡 Tips

1. **Después de cambiar .env**, recarga la app completamente:
   - Presiona `r` en la terminal de Expo para recargar
   - O cierra y abre Expo

2. **Verifica los nuevos logs** en la consola Expo que te dirán la IP exacta que está usando

3. **Si aún falla**, comparte los logs que digan qué IP intenta usar

## ⚠️ Errores Relacionados

- `ENOTFOUND` → IP no existe o está mal escrita
- `ECONNREFUSED` → Servidor no está corriendo en esa IP/puerto
- `ERR_NETWORK` → No hay conectividad de red (IP correcta pero sin conexión)
- Timeout → IP correcta pero servidor muy lento
