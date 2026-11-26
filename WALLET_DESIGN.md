# NØTRACE 3.0 — NØTRACE VAULT (WALLET DESIGN)

## 1. Estructura de NØTRACE Vault
Ubicada en las rutas dedicadas `/billetera`, `/billetera/recargar` y `/billetera/historial`:
1. **Tarjetas Principales de Saldo**:
   - Tarjeta `NØBYTE` (Saldo conceptual disponible, origen por misiones y utilidad).
   - Tarjeta `NØCORE` (Saldo conceptual disponible, acceso a Métodos avanzados y paquetes).
2. **Acciones Rápidas**:
   - Recargar saldo (prototipo de 5 pasos), Ver historial, Canjear recompensas, Explorar Métodos, Explorar Herramientas.
3. **Centro de Recarga (`/billetera/recargar`)**:
   - Flujo conceptual de 5 pasos: Selección de unidad → Selección de paquete (`STARTER`, `OPERATOR`, `ADVANCED`, `ELITE`, `BYTE PACK`, `DATA PACK`, `SYSTEM PACK`) → Método futuro → Resumen → Estado informativo.
4. **Historial de Movimientos (`/billetera/historial`)**:
   - Registro tabular con filtros por moneda (`NØBYTE`, `NØCORE`) y estado (`Demostración`, `Completado`, `Pendiente`).
