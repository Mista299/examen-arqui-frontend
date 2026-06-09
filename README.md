# Parcial Final — Arquitectura de Software (Frontend)

Aplicación web en **React 19 + TypeScript + Vite** para la gestión de **estudiantes, materias y notas** de un colegio. Consume la API REST del backend en Spring Boot y ofrece un panel con dashboard, registro de notas y consulta por estudiante.

> **Repositorio del backend (Spring Boot):** [https://github.com/Isa-Bedoya-UdeA/ParcialFinal-Arquitectura](https://github.com/Isa-Bedoya-UdeA/ParcialFinal-Arquitectura)

---

## Integrantes

| # | Nombre completo | Documento | Correo institucional |
| - | --- | --- | --- |
| 1 | Maria Fernanda Atencia | C.C. | [mariaf.atencia@udea.edu.co](mailto:mariaf.atencia@udea.edu.co) |
| 2 | Michael Stiven Tabares | C.C. | [michael.tabares@udea.edu.co](mailto:michael.tabares@udea.edu.co) |
| 3 | Isabela Bedoya | C.C. 1020106520 | [isabela.bedoya@udea.edu.co](mailto:isabela.bedoya@udea.edu.co) |

**Asignatura:** Arquitectura de Software — Semestre 7
**Programa:** Ingeniería de Sistemas — Universidad de Antioquia (UdeA)

---

## Stack y versiones

| Componente | Versión |
| --- | --- |
| Node.js | 20+ (recomendado 22 LTS) |
| React | 19.2.6 |
| TypeScript | ~6.0.2 |
| Vite | 8.0.12 |
| Tailwind CSS | 4.3.0 |
| Radix UI (primitives) | dialog, dropdown-menu, label, progress, select, separator, slot, tabs, toast, tooltip |
| React Router DOM | 7.17.0 |
| Axios | 1.17.0 |
| lucide-react | 1.17.0 |
| class-variance-authority | 0.7.1 |
| clsx / tailwind-merge | 2.1.1 / 3.6.0 |
| ESLint | 10.3.0 |

---

## Estructura del proyecto

```plain text
.                                              # raíz del repositorio (examen-arqui-frontend)
├── public/
│   └── favicon.svg
├── src/
│   ├── App.tsx                                # Define el BrowserRouter y las rutas
│   ├── main.tsx                               # Punto de entrada de React (monta <App /> en #root)
│   ├── index.css                              # Estilos base de Tailwind
│   ├── components/
│   │   ├── layout/                            # AppLayout, Header, Sidebar
│   │   └── ui/                                # Primitivas reutilizables (Button, Card, Dialog, Input, Table, Toast, etc.)
│   ├── features/                              # Páginas agrupadas por dominio
│   │   ├── dashboard/                         # Vista principal con estadísticas
│   │   ├── students/                          # Gestión de estudiantes
│   │   ├── subjects/                          # Gestión de materias
│   │   └── grades/                            # Registro y consulta de notas
│   ├── hooks/                                 # Hooks personalizados (use-data.ts)
│   ├── lib/                                   # Utilidades (api.ts con Axios, utils.ts con cn())
│   ├── providers/                             # Proveedores de contexto (theme-provider)
│   └── types/                                 # Tipos TypeScript de la API
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## Dependencias clave de `package.json`

| Dependencia | Tipo | Propósito en el proyecto |
| --- | --- | --- |
| `react`, `react-dom` (19) | dependencia | Framework de UI |
| `react-router-dom` (7) | dependencia | Enrutamiento cliente (`/`, `/students`, `/subjects`, `/grades/...`) |
| `axios` | dependencia | Cliente HTTP para consumir el backend en `/api/v1` |
| `tailwindcss` (4) + `@tailwindcss/vite` | devDep | Estilos utility-first; cargado como plugin de Vite |
| `@radix-ui/*` (dialog, dropdown-menu, label, progress, select, separator, slot, tabs, toast, tooltip) | dependencia | Primitivas accesibles sobre las que se construyen los componentes de `components/ui/` |
| `lucide-react` | dependencia | Set de íconos SVG |
| `class-variance-authority`, `clsx`, `tailwind-merge` | dependencia | Variantes y composición de clases utilitarias (`cn()` en `lib/utils.ts`) |
| `@vitejs/plugin-react` | devDep | Soporte de React + HMR en Vite |
| `vite` (8) | devDep | Empaquetador y servidor de desarrollo |
| `typescript` (~6) | devDep | Tipado estático (modo estricto activado en `tsconfig.app.json`) |
| `eslint` + `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` | devDep | Linter configurado en `eslint.config.js` |

---

## Cómo usar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/Mista299/examen-arqui-frontend.git
cd examen-arqui-frontend
```

> Al clonar, los archivos del proyecto Vite/React (`package.json`, `src/`, `index.html`, etc.) están en la **raíz** de la carpeta, así que `npm` se puede ejecutar directamente sin hacer más `cd`.

### 2. Verificar requisitos

- **Node.js 20+** (`node -v` debe reportar `v20.x` o superior; recomendado `v22 LTS`).
- **npm 10+** incluido con Node (`npm -v`).

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar la URL del backend (opcional)

El cliente HTTP usa por defecto la ruta relativa `/api/v1`, lo cual funciona si el frontend se sirve detrás del mismo origen que el backend. Para apuntar a otro origen — por ejemplo, en desarrollo con el backend corriendo en `localhost:8080` — crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

> Cualquier variable que empiece por `VITE_` es expuesta al código por Vite a través de `import.meta.env`. El archivo `.env.local` está cubierto por `.gitignore`, por lo que no se sube al repositorio.

### 5. Levantar el servidor de desarrollo

```bash
npm run dev
```

Por defecto Vite expone la app en [http://localhost:5173](http://localhost:5173) con HMR activado.

### 6. Build de producción

```bash
npm run build      # corre tsc -b y genera el bundle optimizado en /dist
npm run preview    # sirve el build localmente para verificarlo
npm run lint       # corre ESLint sobre el proyecto
```

---

## Rutas disponibles

El enrutamiento se define en `src/App.tsx` con `react-router-dom`. Todas las vistas se renderizan dentro de `AppLayout` (header + sidebar):

| Ruta | Página | Descripción |
| --- | --- | --- |
| `/` | `DashboardPage` (`features/dashboard`) | Resumen con estadísticas (estudiantes, materias, promedio general, % de aprobación) y actividad reciente. |
| `/students` | `StudentsPage` (`features/students`) | Listado y gestión de estudiantes. |
| `/subjects` | `SubjectsPage` (`features/subjects`) | Listado y gestión de materias. |
| `/grades/register` | `RegisterGradesPage` (`features/grades`) | Formulario para registrar una nueva nota (consume `POST /api/v1/notas`). |
| `/grades/query` | `StudentGradesPage` (`features/grades`) | Consulta las notas de un estudiante por cédula (consume `GET /api/v1/estudiantes/{cedula}/notas`). |

---

## Comunicación con el backend

La instancia compartida de Axios vive en `src/lib/api.ts`:

```ts
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  headers: { "Content-Type": "application/json" },
})
```

- `VITE_API_URL` (opcional) sobreescribe el `baseURL` por defecto.
- El interceptor de respuesta normaliza los errores extrayendo `error.response.data.message` para que las pantallas fallen con un mensaje legible.
- Los tipos de la API están declarados en `src/types/index.ts`:
  `Estudiante`, `Materia`, `MateriaSimple`, `Nota`, `NotaRequest`, `NotaResponse`,
  `EstudianteConNotas`, `PromedioMateria`, `DashboardStats`, `Actividad`.

Consulta el README del backend para ver el contrato REST completo y los códigos de error.

---

## Alias de imports

`vite.config.ts` define el alias `@` → `./src`, así que en cualquier archivo del proyecto se puede escribir:

```ts
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import type { EstudianteConNotas } from "@/types"
```

en lugar de rutas relativas largas como `../../../lib/api`.

---

## Scripts disponibles

| Script | Comando | Función |
| --- | --- | --- |
| `dev` | `vite` | Inicia el servidor de desarrollo con HMR en `http://localhost:5173`. |
| `build` | `tsc -b && vite build` | Compila TypeScript y genera el bundle de producción en `dist/`. |
| `preview` | `vite preview` | Sirve localmente el contenido de `dist/` para verificar el build. |
| `lint` | `eslint .` | Corre ESLint sobre todo el código del proyecto. |

---

## Repositorio relacionado

- **Backend (Spring Boot, PostgreSQL, Swagger):** [https://github.com/Isa-Bedoya-UdeA/ParcialFinal-Arquitectura](https://github.com/Isa-Bedoya-UdeA/ParcialFinal-Arquitectura)

---

## Licencia

Proyecto académico — Universidad de Antioquia, 2026.
