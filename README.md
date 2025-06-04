# Gestor de Horarios

Esta aplicación permite gestionar horarios de manera sencilla directamente desde el navegador.

## Abrir la aplicación

1. Clona o descarga este repositorio.
2. Abre el archivo `index.html` en tu navegador preferido. No se requiere servidor.

## Uso de `localStorage`

Los horarios se guardan automáticamente en `localStorage`, por lo que al recargar la página la información permanece disponible. Puedes eliminar todos los datos con el botón **Limpiar Todo**.

## Instrucciones básicas

1. Completa el formulario de "Agregar Horario" indicando día, hora de inicio, hora de fin y la tarea a realizar. Opcionalmente puedes añadir prioridad y notas.
2. Pulsa **Agregar Horario** para guardar el registro. Los horarios se mostrarán debajo y podrás editarlos o eliminarlos.
3. Usa los filtros por día o por tarea para encontrar rápidamente un horario.
4. Puedes **Exportar** los horarios a un archivo JSON o **Importar** desde un archivo previamente exportado.

## Importar/Exportar

- **Exportar** genera un archivo `horarios.json` con todos los registros actuales.
- **Importar** permite cargar un archivo JSON con el formato generado por la exportación. Los horarios importados se añaden a los existentes.

