# SmartLogix

Plataforma inteligente para la gestión logística de eCommerce (Desarrollo Fullstack III).

## Estructura prevista


## Configuración local


## Estrategia de ramas

El proyecto usa un flujo de trabajo ambientado en multiples entornos:

### Ramas principales

- `main`: Producción (codigo éstable)
- `develop`: Desarrollo

### Ramas de trabajo

Todas las ramas de trabajo se crearan desde `develop`:
- `feature/nombre-feature`: nuevas funcionalidades
- `fix/nombre-bug`: corrección de errores
- `chore/nombre-tarea`: tareas técnicas

#### Ejemplos:

- `feature/login`
- `fix/register-error`
- `chore/update-deps`

## Flujo de Trabajo

### 1. Desarrollo
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nueva-funcionalidad
```
### 2. Integración
- Pull Request: `feature/*` -> `develop`
- Revisión obligatoria

### 3. Producción
- Pull Request: `develop` -> `main`
- Código estable listo para deploy

## Convención de Commits

Se utilizaran **Conventional Commits** para estructurar los mensajes de Commit en Git. Esto permitira que sean faciles de leer para el Desarrollador.

### Formato
```bash
tipo: descripción
```

### Tipos
- `feat`: nueva funcionalidad
- `fix`: corrección de bug
- `chore`: tareas internas
- `docs`: documentación
- `refactor`: mejora de código

#### Ejemplos:
- `feat: add login form`
- `fix: resolve authentication error`
- `docs: update git workflow`

## 🔒 Protección de ramas
### `main`
- Pull Request obligatorio
- mínimo 1 aprobación
- sin push directo
  
### `develop`
- Pull Request obligatorio (recomendado)
  
## 📋 Checklist de Pull Request
- Código probado
- No rompe funcionalidades existentes
- Sigue convención de commits
- PR revisado por al menos 1 integrante
- Rama actualizada con la base
  
## 🎯 Buenas prácticas
- No trabajar directamente en ramas principales
- Mantener PR pequeños y claros
- Hacer commits descriptivos
- Eliminar ramas después del merge

