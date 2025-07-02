// WooCommerce Configuration File
// Update these settings according to your WooCommerce setup

export const WOOCOMMERCE_CONFIG = {
  // Your WooCommerce site URL
  SITE_URL: 'https://your-site.com',
  
  // WooCommerce Store API endpoints (no authentication required for frontend)
  API_ENDPOINTS: {
    cart: '/wp-json/wc/store/cart',
    addToCart: '/wp-json/wc/store/cart/add-item',
    updateCart: '/wp-json/wc/store/cart/update-item',
    removeFromCart: '/wp-json/wc/store/cart/remove-item',
    applyCoupon: '/wp-json/wc/store/cart/apply-coupon',
    removeCoupon: '/wp-json/wc/store/cart/remove-coupon',
    checkout: '/wp-json/wc/store/checkout',
    
    // Custom endpoint for challenge rules (you'll need to create this)
    challengeRules: '/wp-json/custom/v1/challenge-rules'
  },

  // Payment gateway configurations
  PAYMENT_GATEWAYS: {
    stripe: {
      id: 'stripe',
      title: 'Credit Card',
      description: 'Pay securely with your credit card',
      icon: '💳'
    },
    paypal: {
      id: 'paypal',
      title: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: '🅿️'
    },
    razorpay: {
      id: 'razorpay',
      title: 'Razorpay',
      description: 'Credit/Debit Cards, UPI, Wallets',
      icon: '💰'
    },
    bacs: {
      id: 'bacs',
      title: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: '🏦'
    }
  },

  // Product mapping - Update with your actual WooCommerce Product IDs
  PRODUCT_IDS: {
    challenges: {
      'one-step': {
        '10k': 101,   // Replace with actual Product ID
        '25k': 102,   // Replace with actual Product ID
        '50k': 103,   // Replace with actual Product ID
        '100k': 104   // Replace with actual Product ID
      },
      'two-step': {
        '10k': 105,   // Replace with actual Product ID
        '25k': 106,   // Replace with actual Product ID
        '50k': 107,   // Replace with actual Product ID
        '100k': 108   // Replace with actual Product ID
      }
    },
    addons: {
      'ea-support': 201,     // Replace with actual Product ID
      'weekend-hold': 202,   // Replace with actual Product ID
      'reset-option': 203    // Replace with actual Product ID
    }
  },

  // Default settings
  DEFAULTS: {
    currency: 'USD',
    locale: 'en_US',
    guestCheckout: true,
    redirectAfterPayment: '/thank-you'
  }
}

/**
 * WordPress PHP Code Required for Custom Challenge Rules Endpoint
 * 
 * Add this to your theme's functions.php file or create a custom plugin:
 * 
 * ```php
 * // Register custom REST API endpoint for challenge rules
 * add_action('rest_api_init', function () {
 *   register_rest_route('custom/v1', '/challenge-rules/(?P<rules_key>[a-zA-Z0-9_-]+)', array(
 *     'methods' => 'GET',
 *     'callback' => 'get_challenge_rules',
 *     'permission_callback' => '__return_true', // Make it public
 *   ));
 * });
 * 
 * function get_challenge_rules($request) {
 *   $rules_key = $request['rules_key'];
 *   
 *   // Define challenge rules based on the rules_key
 *   $rules_map = array(
 *     'one_step_10k' => array(
 *       'accountSize' => '$10,000',
 *       'profitTarget' => '$800 (8%)',
 *       'maxDrawdown' => '$1,000 (10%)',
 *       'dailyDrawdown' => '$500 (5%)',
 *       'tradingPeriod' => 'Unlimited',
 *       'minTradingDays' => '5 days'
 *     ),
 *     'one_step_25k' => array(
 *       'accountSize' => '$25,000',
 *       'profitTarget' => '$2,000 (8%)',
 *       'maxDrawdown' => '$2,500 (10%)',
 *       'dailyDrawdown' => '$1,250 (5%)',
 *       'tradingPeriod' => 'Unlimited',
 *       'minTradingDays' => '5 days'
 *     ),
 *     // Add more rules as needed
 *   );
 *   
 *   if (isset($rules_map[$rules_key])) {
 *     return rest_ensure_response($rules_map[$rules_key]);
 *   } else {
 *     return new WP_Error('no_rules', 'Challenge rules not found', array('status' => 404));
 *   }
 * }
 * ```
 * 
 */