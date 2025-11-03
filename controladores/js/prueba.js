// controladores/js/prueba.js
// Archivo de pruebas para verificar las llamadas a los endpoints

import * as rolService from '../services/rol.service.js';
import * as usuarioService from '../services/usuario.service.js';
import * as estudianteService from '../services/estudiante.service.js';

console.log('=== INICIANDO PRUEBAS DE SERVICIOS ===\n');

// ============================================
// PRUEBAS DE ROL SERVICE
// ============================================

async function testRolService() {
  console.log('🔵 PRUEBAS DE ROL SERVICE\n');
  
  try {
    // 1. Listar todos los roles
    console.log('📋 Test 1: Obtener todos los roles activos');
    const roles = await rolService.getAllRoles();
    console.log('✅ Roles obtenidos:', roles);
    console.log('');

    // 2. Crear un nuevo rol
    console.log('➕ Test 2: Crear un nuevo rol');
    const nuevoRol = {
      nombre: 'Rol de Prueba',
      descripcion: 'Este es un rol creado para pruebas',
      permisos: ['LEER', 'ESCRIBIR']
    };
    const rolCreado = await rolService.createRol(nuevoRol);
    console.log('✅ Rol creado:', rolCreado);
    console.log('');

    // Guardar el ID del rol creado para las siguientes pruebas
    const rolId = rolCreado.id;

    // 3. Obtener rol por ID
    console.log('🔍 Test 3: Obtener rol por ID');
    const rolObtenido = await rolService.getRolById(rolId);
    console.log('✅ Rol obtenido por ID:', rolObtenido);
    console.log('');

    // 4. Buscar roles por nombre
    console.log('🔎 Test 4: Buscar roles por nombre');
    const rolesEncontrados = await rolService.searchRoles('Prueba');
    console.log('✅ Roles encontrados:', rolesEncontrados);
    console.log('');

    // 5. Actualizar rol
    console.log('✏️ Test 5: Actualizar rol');
    const rolActualizado = await rolService.updateRol(rolId, {
      nombre: 'Rol de Prueba Actualizado',
      descripcion: 'Descripción actualizada',
      permisos: ['LEER', 'ESCRIBIR', 'ELIMINAR']
    });
    console.log('✅ Rol actualizado:', rolActualizado);
    console.log('');

    // 6. Actualización parcial (PATCH)
    console.log('🔧 Test 6: Actualización parcial del rol');
    const rolParcial = await rolService.patchRol(rolId, {
      descripcion: 'Solo actualizamos la descripción'
    });
    console.log('✅ Rol actualizado parcialmente:', rolParcial);
    console.log('');

    // 7. Eliminar rol (soft delete)
    console.log('🗑️ Test 7: Eliminar rol (soft delete)');
    await rolService.deleteRol(rolId);
    console.log('✅ Rol eliminado correctamente');
    console.log('');

    // 8. Listar roles eliminados
    console.log('📋 Test 8: Obtener roles eliminados');
    const rolesEliminados = await rolService.getAllDeletedRoles();
    console.log('✅ Roles eliminados:', rolesEliminados);
    console.log('');

    // 9. Restaurar rol
    console.log('♻️ Test 9: Restaurar rol eliminado');
    const rolRestaurado = await rolService.restoreRol(rolId);
    console.log('✅ Rol restaurado:', rolRestaurado);
    console.log('');

    // 10. Eliminar permanentemente
    console.log('💥 Test 10: Eliminar rol permanentemente');
    await rolService.hardDeleteRol(rolId);
    console.log('✅ Rol eliminado permanentemente');
    console.log('');

    console.log('✅ ¡TODAS LAS PRUEBAS DE ROL SERVICE COMPLETADAS!\n');
  } catch (error) {
    console.error('❌ Error en pruebas de Rol Service:', error.message);
    console.log('');
  }
}

// ============================================
// PRUEBAS DE USUARIO SERVICE
// ============================================

async function testUsuarioService() {
  console.log('🟢 PRUEBAS DE USUARIO SERVICE\n');
  
  try {
    // 1. Listar todos los usuarios sin paginación
    console.log('📋 Test 1: Obtener todos los usuarios sin paginación');
    const usuariosSinPaginar = await usuarioService.getAllUsuarios(0, 10, false);
    console.log('✅ Usuarios obtenidos (sin paginar):', usuariosSinPaginar);
    console.log('Total de usuarios:', usuariosSinPaginar.length);
    console.log('');

    // 2. Listar usuarios con paginación
    console.log('📄 Test 2: Obtener usuarios con paginación');
    const usuariosPaginados = await usuarioService.getAllUsuarios(0, 5, true);
    console.log('✅ Usuarios paginados:', usuariosPaginados);
    console.log('Total elementos:', usuariosPaginados.totalElements);
    console.log('');

    // 3. Listar usuarios activos
    console.log('✅ Test 3: Obtener usuarios activos');
    const usuariosActivos = await usuarioService.getUsuariosActivos();
    console.log('✅ Usuarios activos:', usuariosActivos);
    console.log('Total usuarios activos:', usuariosActivos.length);
    console.log('');

    // 4. Obtener usuarios eliminados
    console.log('📋 Test 4: Obtener usuarios eliminados');
    const usuariosEliminados = await usuarioService.getAllDeletedUsuarios();
    console.log('✅ Usuarios eliminados:', usuariosEliminados);
    console.log('Total usuarios eliminados:', usuariosEliminados.length);
    console.log('');

    // Si hay usuarios, probar búsqueda con el primero
    if (usuariosSinPaginar.length > 0) {
      const primerUsuario = usuariosSinPaginar[0];
      
      console.log('🔍 Test 5: Obtener usuario por ID');
      const usuarioObtenido = await usuarioService.getUsuarioById(primerUsuario.id);
      console.log('✅ Usuario obtenido por ID:', usuarioObtenido);
      console.log('');

      console.log('🔎 Test 6: Buscar usuario por username');
      const usuarioPorUsername = await usuarioService.getUsuarioByUsername(primerUsuario.username);
      console.log('✅ Usuario encontrado por username:', usuarioPorUsername);
      console.log('');

      console.log('📧 Test 7: Buscar usuario por email');
      const usuarioPorEmail = await usuarioService.getUsuarioByEmail(primerUsuario.email);
      console.log('✅ Usuario encontrado por email:', usuarioPorEmail);
      console.log('');

      if (primerUsuario.rolId) {
        console.log('👥 Test 8: Obtener usuarios por rol');
        const usuariosPorRol = await usuarioService.getUsuariosByRol(primerUsuario.rolId);
        console.log('✅ Usuarios con ese rol:', usuariosPorRol);
        console.log('Total usuarios con rol:', usuariosPorRol.length);
        console.log('');
      }
    } else {
      console.log('⚠️ No hay usuarios en la base de datos para probar búsquedas específicas');
      console.log('');
    }

    console.log('✅ ¡TODAS LAS PRUEBAS DE USUARIO SERVICE COMPLETADAS!\n');
  } catch (error) {
    console.error('❌ Error en pruebas de Usuario Service:', error.message);
    console.log('');
  }
}

// ============================================
// PRUEBAS DE ESTUDIANTE SERVICE
// ============================================

async function testEstudianteService() {
  console.log('🟡 PRUEBAS DE ESTUDIANTE SERVICE\n');
  
  try {
    // 1. Listar todos los estudiantes con paginación
    console.log('📋 Test 1: Obtener todos los estudiantes con paginación');
    const estudiantesPaginados = await estudianteService.getAllEstudiantes(0, 5);
    console.log('✅ Estudiantes paginados:', estudiantesPaginados);
    console.log('Total elementos:', estudiantesPaginados.totalElements || 'N/A');
    console.log('');

    // 2. Listar estudiantes activos
    console.log('✅ Test 2: Obtener estudiantes activos');
    const estudiantesActivos = await estudianteService.getEstudiantesActivos();
    console.log('✅ Estudiantes activos:', estudiantesActivos);
    console.log('Total estudiantes activos:', estudiantesActivos.length);
    console.log('');

    // 3. Obtener estudiantes por género
    console.log('👥 Test 3: Obtener estudiantes masculinos');
    const estudiantesMasculinos = await estudianteService.getEstudiantesByGenero('M');
    console.log('✅ Estudiantes masculinos:', estudiantesMasculinos);
    console.log('Total:', estudiantesMasculinos.length);
    console.log('');

    console.log('� Test 4: Obtener estudiantes femeninos');
    const estudiantesFemeninos = await estudianteService.getEstudiantesByGenero('F');
    console.log('✅ Estudiantes femeninos:', estudiantesFemeninos);
    console.log('Total:', estudiantesFemeninos.length);
    console.log('');

    // Si hay estudiantes, probar búsqueda con el primero
    if (estudiantesActivos.length > 0) {
      const primerEstudiante = estudiantesActivos[0];
      
      console.log('� Test 5: Obtener estudiante por ID');
      const estudianteObtenido = await estudianteService.getEstudianteById(primerEstudiante.id);
      console.log('✅ Estudiante obtenido por ID:', estudianteObtenido);
      console.log('');

      console.log('🔎 Test 6: Buscar estudiante por código');
      const estudiantePorCodigo = await estudianteService.getEstudianteByCodigo(primerEstudiante.codigoEstudiante);
      console.log('✅ Estudiante encontrado por código:', estudiantePorCodigo);
      console.log('');
    } else {
      console.log('⚠️ No hay estudiantes en la base de datos para probar búsquedas específicas');
      console.log('');
    }

    console.log('✅ ¡TODAS LAS PRUEBAS DE ESTUDIANTE SERVICE COMPLETADAS!\n');
  } catch (error) {
    console.error('❌ Error en pruebas de Estudiante Service:', error.message);
    console.log('');
  }
}

// ============================================
// EJECUTAR TODAS LAS PRUEBAS
// ============================================

async function ejecutarPruebas() {
  console.log('🚀 Iniciando pruebas...\n');
  
  // Primero probar los roles
  await testRolService();
  
  // Luego probar los usuarios
  await testUsuarioService();
  
  // Finalmente probar los estudiantes
  await testEstudianteService();
  
  console.log('🎉 ¡TODAS LAS PRUEBAS FINALIZADAS!\n');
}

// Ejecutar las pruebas
ejecutarPruebas();