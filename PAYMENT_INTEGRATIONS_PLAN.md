# NØTRACE 3.0 — PAYMENT INTEGRATIONS PLAN (FUTURE PHASE)

## 1. Estado Actual
Todas las pasarelas externas se muestran exclusivamente como **tarjetas informativas en estado "Próximamente"** dentro de `/billetera/recargar`. No existen claves privadas, webhooks activos ni generación de direcciones de depósito en Fase 3.0.

## 2. Métodos Planificados para Fases Futuras con Backend Transaccional
- **USDT / USDC**: Confirmación multi-red mediante proveedor custodio o pasarela cripto regulada con webhooks firmados.
- **Bitcoin (BTC) / Ethereum (ETH)**: Liquidación automatizada mediante facturas efímeras verificadas en servidor.
- **Binance Pay**: Integración merchant API con validación de firma HMAC-SHA512.
- **PayPal & Tarjetas (Visa / Mastercard)**: Procesamiento mediante Checkout hospedado compatible con PCI-DSS.
- **Telegram Flow**: Flujo asistido verificado por bot oficial con tokens de sesión de un solo uso.

## 3. Invariantes de Seguridad Requeridos Antes de Activar Pagos
- Libro mayor (`ledger`) inmutable en base de datos transaccional.
- Claves de idempotencia obligatorias por orden y webhook.
- Prohibición absoluta de acreditar saldos desde el cliente.
