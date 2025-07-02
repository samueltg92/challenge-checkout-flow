# 🛍️ WooCommerce Integration Setup

Este proyecto está preparado para integrarse perfectamente con WooCommerce. Sigue esta guía para completar la configuración.

## 📋 Requisitos Previos

1. **WooCommerce instalado** en tu sitio WordPress
2. **WooCommerce Blocks** plugin activado (para Store API)
3. **Productos creados** en WooCommerce para cada combinación de challenge

## 🔧 Configuración Paso a Paso

### 1. Crear Productos en WooCommerce

Crea productos simples para cada combinación:

#### Challenges One-Step:
- **One-Step Challenge $10,000** (ID: 101) - Precio: $82
- **One-Step Challenge $25,000** (ID: 102) - Precio: $149  
- **One-Step Challenge $50,000** (ID: 103) - Precio: $299
- **One-Step Challenge $100,000** (ID: 104) - Precio: $549

#### Challenges Two-Step:
- **Two-Step Challenge $10,000** (ID: 105) - Precio: $85
- **Two-Step Challenge $25,000** (ID: 106) - Precio: $159
- **Two-Step Challenge $50,000** (ID: 107) - Precio: $319
- **Two-Step Challenge $100,000** (ID: 108) - Precio: $579

#### Add-ons:
- **Expert Advisor Support** (ID: 201) - Precio: $25
- **Weekend Holding** (ID: 202) - Precio: $15
- **One-Time Reset** (ID: 203) - Precio: $35

### 2. Actualizar IDs de Productos

Edita `/src/config/woocommerce.config.ts` con los IDs reales de tus productos:

```typescript
PRODUCT_IDS: {
  challenges: {
    'one-step': {
      '10k': 123,   // Reemplaza con el ID real
      '25k': 124,   // Reemplaza con el ID real
      // ... más productos
    }
  }
}
```

### 3. Configurar URL del Sitio

Actualiza la URL de tu sitio en `/src/lib/woocommerce.ts`:

```typescript
baseUrl: 'https://tu-sitio.com'
```

### 4. Añadir Endpoint Personalizado (PHP)

Copia este código en el `functions.php` de tu tema o crea un plugin:

```php
// Register custom REST API endpoint for challenge rules
add_action('rest_api_init', function () {
  register_rest_route('custom/v1', '/challenge-rules/(?P<rules_key>[a-zA-Z0-9_-]+)', array(
    'methods' => 'GET',
    'callback' => 'get_challenge_rules',
    'permission_callback' => '__return_true',
  ));
});

function get_challenge_rules($request) {
  $rules_key = $request['rules_key'];
  
  $rules_map = array(
    'one_step_10k' => array(
      'accountSize' => '$10,000',
      'profitTarget' => '$800 (8%)',
      'maxDrawdown' => '$1,000 (10%)',
      'dailyDrawdown' => '$500 (5%)',
      'tradingPeriod' => 'Unlimited',
      'minTradingDays' => '5 days'
    ),
    // Añade más reglas según necesites
  );
  
  if (isset($rules_map[$rules_key])) {
    return rest_ensure_response($rules_map[$rules_key]);
  } else {
    return new WP_Error('no_rules', 'Challenge rules not found', array('status' => 404));
  }
}
```

### 5. Configurar Pasarelas de Pago

En WooCommerce > Pagos, activa las pasarelas que necesites:
- **Stripe** para tarjetas de crédito
- **PayPal** para pagos con PayPal
- **Transferencia bancaria** para pagos directos

## 🚀 Funcionalidades Implementadas

### ✅ Cart Management
- ✅ Añadir productos al carrito automáticamente
- ✅ Actualizar carrito cuando cambia la selección
- ✅ Limpiar carrito antes de nuevas selecciones

### ✅ Coupon System
- ✅ Aplicar cupones de descuento
- ✅ Remover cupones aplicados
- ✅ Mostrar descuentos en tiempo real

### ✅ Checkout Process
- ✅ Recopilar información de facturación
- ✅ Seleccionar método de pago
- ✅ Procesar checkout con WooCommerce
- ✅ Redirección a pasarela de pago

### ✅ Dynamic Content
- ✅ Actualizar condiciones según selección
- ✅ Cargar reglas desde API personalizada
- ✅ Cálculos de precio en tiempo real

## 🔒 Seguridad

- **CORS habilitado** para comunicación frontend-backend
- **Sesiones de WooCommerce** para manejo seguro del carrito
- **Validación del lado del servidor** en WooCommerce
- **Tokens de seguridad** para operaciones sensibles

## 🛠️ Personalización

### Añadir Nuevos Productos
1. Crea el producto en WooCommerce
2. Anota el ID del producto  
3. Actualiza la configuración en `/src/config/woocommerce.config.ts`
4. Añade las reglas en el endpoint PHP personalizado

### Modificar Pasarelas de Pago
Edita el array `PAYMENT_GATEWAYS` en `/src/config/woocommerce.config.ts`:

```typescript
PAYMENT_GATEWAYS: {
  nueva_pasarela: {
    id: 'nueva_pasarela',
    title: 'Nueva Pasarela',
    description: 'Descripción de la pasarela',
    icon: '💳'
  }
}
```

## 🐛 Troubleshooting

### Problema: CORS Errors
**Solución:** Añade tu dominio a los headers CORS permitidos en WordPress.

### Problema: Cart no se actualiza
**Solución:** Verifica que WooCommerce Blocks esté activado y que los IDs de productos sean correctos.

### Problema: Cupones no funcionan
**Solución:** Asegúrate de que los cupones estén creados en WooCommerce y sean válidos.

### Problema: Challenge Rules no cargan
**Solución:** Verifica que el endpoint personalizado esté añadido correctamente en `functions.php`.

## 📚 Recursos Adicionales

- [WooCommerce Store API Docs](https://github.com/woocommerce/woocommerce-gutenberg-products-block/tree/trunk/docs/third-party-developers/extensibility/rest-api)
- [WooCommerce REST API](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

---

¡Tu checkout está listo para integrarse con WooCommerce! 🎉