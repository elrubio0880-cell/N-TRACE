# NØTRACE 3.0 — CURRENCY DESIGN SPECIFICATION

## 1. NØBYTE (`NBT`) — Unidad de Utilidad Interna
- **Geometría**: Emblema hexagonal técnico con borde de precisión, circuito perimetral discreto y símbolo central de doble bloque binario con corte diagonal.
- **Paleta Monocromática**:
  - Fondo interno: `#111111`
  - Superficie secundaria: `#242424`
  - Borde principal: `#626262`
  - Brillo técnico: `#B3B3B3`
  - Símbolo central: `#E5E5E5`
- **Componente React**: `<ByteIcon />` en `src/components/CurrencyIcons.tsx`.

## 2. NØCORE (`NCR`) — Unidad de Valor Superior
- **Geometría**: Octágono facetado de alta precisión inspirado en un núcleo energético y procesador criptográfico con símbolo central `Ø` luminoso.
- **Paleta Monocromática**:
  - Núcleo exterior: `#141414`
  - Facetas: `#303030`
  - Aro interno: `#BFBFBF`
  - Símbolo central: `#FFFFFF`
  - Brillo sutil: `rgba(255, 255, 255, 0.18)`
- **Componente React**: `<CoreIcon />` en `src/components/CurrencyIcons.tsx`.

## 3. Escalas Soportadas
Ambos vectores SVG son independientes de resolución y se renderizan en `16px`, `20px`, `24px`, `32px`, `48px`, `64px` y `128px`.
