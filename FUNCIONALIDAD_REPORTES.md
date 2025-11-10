# Funcionalidad de Reportes - Guía de Uso

## ✅ Funcionalidades Implementadas

### 1. **Agregar Reporte**
- Botón "Agregar" en la página de reportes
- Modal con formulario que incluye:
  - **Nivel de severidad**: Selector con 3 niveles (😶 Leve, 🤐 Fuerte, 😠 Grave)
  - **Código del estudiante**: Campo de texto (ej: EST-2024-001)
  - **Descripción**: Área de texto expandible automáticamente
- Validaciones implementadas:
  - Todos los campos son obligatorios
  - Busca al estudiante por código antes de crear el reporte
  - Muestra alertas si el estudiante no existe

### 2. **Eliminar Reporte**
- Botón "🗑️ Eliminar" en cada reporte individual
- Confirmación antes de eliminar
- Animación de éxito al eliminar
- Recarga automática de la lista después de eliminar

### 3. **Visualización por Severidad**
Los reportes se clasifican automáticamente en 3 secciones:
- **Reportes Leves 😶**: Severidad 1 o 'LEVE'
- **Reportes Fuertes 🤐**: Severidad 2 o 'FUERTE'
- **Reportes Graves 😠**: Severidad 3 o 'GRAVE'

### 4. **Búsqueda y Filtrado**
- Búsqueda en tiempo real por nombre, código o descripción
- Filtrado por curso usando URL: `?cursoId={uuid}`

---

## 🔧 Estructura de Datos

### Crear Reporte (Payload)
```javascript
{
  "estudianteId": "uuid-del-estudiante",
  "usuarioId": "uuid-del-usuario-actual",
  "descripcion": "Descripción del comportamiento",
  "severidad": "LEVE" | "FUERTE" | "GRAVE",
  "tipo": "CONDUCTA",
  "cursoId": "uuid-del-curso" // Opcional, se toma de la URL
}
```

### Respuesta de Reporte (API)
```javascript
{
  "id": "uuid",
  "descripcion": "texto",
  "severidad": "LEVE",
  "tipo": "CONDUCTA",
  "estudiante": {
    "id": "uuid",
    "codigoEstudiante": "EST-2024-001",
    "nombre": "Nombre",
    "fotoUrl": "uploads/estudiantes/foto.jpg",
    "usuario": {
      "nombre": "Nombre Completo"
    }
  },
  "curso": {
    "id": "uuid"
  }
}
```

---

## 🧪 Cómo Probar

### Prueba 1: Agregar Reporte
1. Abre `reportes-estudiantes.html`
2. Haz clic en el botón **"Agregar"**
3. Completa el formulario:
   - Selecciona severidad: **Leve**
   - Código estudiante: Usa un código real de la BD (ej: `EST-2024-001`)
   - Descripción: `"Llegó tarde a clase"`
4. Haz clic en **"Guardar Reporte"**
5. Verifica que aparezca en la sección de "Reportes Leves"

### Prueba 2: Eliminar Reporte
1. En la lista de reportes, localiza cualquier reporte
2. Haz clic en el botón **"🗑️ Eliminar"** a la derecha
3. Confirma la eliminación en el diálogo
4. Verifica que:
   - Se muestre la animación de éxito
   - El reporte desaparezca de la lista
   - Se muestre el mensaje de confirmación

### Prueba 3: Filtrar por Curso
1. Desde la página de cursos (`estudiantes.html` o `mis-clases.html`)
2. Haz clic en un curso específico
3. Navega a reportes con el cursoId en la URL
4. Verifica que solo se muestren reportes de ese curso

### Prueba 4: Búsqueda
1. En el campo de búsqueda, escribe un nombre, código o palabra de la descripción
2. Verifica que se filtren los reportes en tiempo real
3. Prueba con búsquedas parciales

---

## ⚠️ Validaciones y Errores

### Errores Manejados:
1. **Código de estudiante no existe**: Muestra alerta
2. **Campos vacíos**: Muestra alerta pidiendo completar
3. **Error de conexión con API**: Muestra mensaje de error
4. **Usuario no autenticado**: Solicita iniciar sesión

### Datos Necesarios:
- El usuario debe estar en `localStorage.userData` con su `id`
- Los códigos de estudiante deben existir en la base de datos
- El backend debe estar corriendo en `http://localhost:8080`

---

## 📋 Servicios API Utilizados

### Estudiantes
- `GET /api/estudiantes/codigo/{codigo}` - Buscar estudiante por código

### Reportes
- `GET /api/reportes?page=0&size=100` - Obtener todos los reportes
- `POST /api/reportes` - Crear nuevo reporte
- `DELETE /api/reportes/{id}` - Eliminar reporte (soft delete)

---

## 🎨 Características de UX

1. **Textarea expandible**: El campo de descripción crece automáticamente
2. **Iconos en selectores**: Emojis para identificar niveles de severidad
3. **Botones contextuales**: Eliminar aparece en cada reporte
4. **Animación de éxito**: Efecto visual al eliminar
5. **Confirmación de acciones**: Dialog nativo antes de eliminar
6. **Mensajes claros**: Alertas con SweetAlert
7. **Loading states**: Mensajes de "Cargando..." mientras se obtienen datos

---

## 🐛 Troubleshooting

### El estudiante no se encuentra
- Verifica que el código esté escrito correctamente (case-sensitive)
- Confirma que el estudiante existe en la BD con `GET /api/estudiantes/codigo/{codigo}`

### No se puede crear el reporte
- Verifica que `localStorage.userData` contenga el `id` del usuario
- Revisa la consola del navegador para ver errores de API
- Confirma que el backend esté corriendo

### Los reportes no se clasifican correctamente
- Verifica que el campo `severidad` en la respuesta tenga uno de estos valores:
  - `'LEVE'`, `'FUERTE'`, `'GRAVE'` (strings)
  - `1`, `2`, `3` (números o strings)

### El botón eliminar no funciona
- Verifica que el `reporte.id` exista en la respuesta de la API
- Confirma que el endpoint `DELETE /api/reportes/{id}` esté disponible

---

## 💡 Próximas Mejoras Sugeridas

1. **Filtro por fecha**: Agregar rango de fechas para buscar reportes
2. **Editar reporte**: Permitir modificar descripción y severidad
3. **Historial**: Ver reportes eliminados y restaurarlos
4. **Exportar**: Generar PDF o Excel con los reportes
5. **Notificaciones**: Enviar email al crear reporte grave
6. **Contador**: Mostrar cantidad de reportes por severidad
7. **Detalles expandidos**: Click en reporte para ver más información
8. **Filtro por tipo**: CONDUCTA, ACADEMICO, OTRO
