# Prueba-Tecnica-Cachalot

# Prueba Técnica Cachalot - CRM Dashboard

Aplicación web tipo CRM construida con **React, TypeScript y Vite**.

Incluye navegación por módulos, gestión de contactos, visualizaciones de actividad y pipeline, modo oscuro y diseño responsive para desktop y móvil.

---

## Tecnologías

* React 19
* TypeScript
* Vite
* React Router
* Vitest + Testing Library
* Oxlint

---

## Requisitos

* Node.js 18+ (recomendado 20+)
* npm

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Toastad/Prueba-Tecnica-Cachalot.git
cd Prueba-Tecnica-Cachalot
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Levantar el entorno de desarrollo

```bash
npm run dev
```

### 4. Abrir en el navegador

La aplicación estará disponible en:

http://localhost:5173

---

## Scripts disponibles

```bash
npm run dev
npm run build
npm run test
npm run lint
```

---

## Funcionalidades implementadas

* Dashboard principal con métricas de CRM.
* Navegación por secciones:

  * Overview
  * Contacts
  * Transactions
  * Accounts
  * Reports
  * Settings
* Gestión de contactos:

  * Crear contacto
  * Editar contacto
  * Eliminar contacto
* Búsqueda rápida de secciones.
* Visualización de actividad semanal mediante barras interactivas.
* Visualización de pipeline mediante gráfico donut interactivo por etapa.
* Modo oscuro y modo claro.
* Preferencias persistidas en `localStorage`.
* Diseño responsive para dispositivos móviles.
* Correcciones de overflow y spacing para pantallas pequeñas.
* Prueba de componente para la sección Contacts.

---

## Estructura general del proyecto

```text
src/
├── layout/       # Estructura principal y navegación
├── pages/        # Vistas de cada sección
├── components/   # Componentes reutilizables
├── styles/       # Estilos globales y responsive
├── data/         # Datos mock del CRM
├── lib/          # Utilidades y persistencia de preferencias
└── test/         # Configuración y pruebas
```

---

## Cómo probar la aplicación

### 1. Ejecutar el proyecto

```bash
npm run dev
```

### 2. Recorrer los módulos

Utilizar el sidebar en desktop o la barra de navegación inferior en móvil para acceder a:

* Overview
* Contacts
* Transactions
* Accounts
* Reports
* Settings

### 3. Probar el flujo de contactos

1. Ir a **Contacts**.
2. Crear un contacto nuevo.
3. Editar sus datos.
4. Eliminar el contacto.

### 4. Probar Settings

1. Cambiar entre tema **Light** y **Dark**.
2. Activar o desactivar **Compact Cards**.
3. Recargar la página y comprobar que las preferencias se mantienen.

### 5. Validar calidad técnica

Ejecutar:

```bash
npm run lint
npm run test
npm run build
```

---

## Capturas de pantalla

Agregar aquí evidencias del funcionamiento de la aplicación.

### Desktop

* Overview
* Contacts
* Accounts / Donut
* Settings

### Mobile

* Overview
* Transactions
* Settings en modo compacto

Ejemplo:

```markdown
![Overview Desktop](./screenshots/overview-desktop.png)

![Contacts Desktop](./screenshots/contacts-desktop.png)

![Accounts Desktop](./screenshots/accounts-desktop.png)

![Settings Desktop](./screenshots/settings-desktop.png)

![Overview Mobile](./screenshots/overview-mobile.png)

![Transactions Mobile](./screenshots/transactions-mobile.png)

![Settings Mobile](./screenshots/settings-mobile.png)
```

---

## Decisiones de diseño

* Separación por páginas para facilitar la escalabilidad y el mantenimiento.
* Layout único reutilizable para mantener consistencia visual.
* Enfoque mobile-first en interacciones clave.
* Navegación inferior para dispositivos móviles.
* Densidad de cards adaptada a pantallas pequeñas.
* Sistema visual con tema claro y oscuro.
* Estados interactivos consistentes.
* Persistencia local de preferencias para mejorar la experiencia de usuario.
* Estilos centralizados para controlar fácilmente el comportamiento responsive.

---

## Accesibilidad y validaciones

* Estructura semántica por secciones.
* Soporte de foco visible en elementos interactivos.
* Labels y estados claros en formularios.
* Validaciones básicas en la creación y edición de contactos.
* Validación de campos y formato de datos.

---

## Mejoras futuras

* Mayor cobertura de pruebas unitarias.
* Pruebas de integración.
* Flujos end-to-end.
* Estados avanzados por módulo:

  * Loading
  * Empty
  * Error
* Feedback visual específico para diferentes estados.
* Internacionalización.
* Mejoras adicionales de accesibilidad.
* Conexión a una API real para persistencia remota.

---

## Uso de IA

Se utilizaron herramientas de IA como **GitHub Copilot y ChatGPT** para acelerar diferentes etapas del desarrollo:

* Propuestas de estructura inicial.
* Refinamiento de estilos responsive.
* Iteraciones visuales.
* Ajustes de UX.
* Revisión rápida de alternativas de implementación.
* Apoyo durante la resolución de problemas técnicos.

Todo el código generado o sugerido mediante IA fue **revisado, comprendido y ajustado manualmente** antes de ser incorporado al proyecto.

Se validó el funcionamiento final mediante:

* Lint
* Tests
* Build
* Pruebas manuales de los principales flujos

---

## Entrega

### Repositorio

https://github.com/Toastad/Prueba-Tecnica-Cachalot

### Pull Request

Agregar aquí el enlace al Pull Request abierto hacia `main`.

---

## Estado del proyecto

**Completado y listo para revisión técnica.**
