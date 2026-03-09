export function shipmentSodiumTemplate(order: any, trackingNumber: string, shippingCompany: string = "Post Canada"): string {
    const currencyPrefix = order.currency_code?.toLowerCase() === 'usd' ? 'US$' : 'CA$';

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your order is on the way!</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #020617; color: #f8fafc; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #020617;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #020617;">
          <!-- Header -->
          <tr>
            <td style="padding-bottom: 32px;">
              <h1 style="font-size: 32px; font-weight: 700; color: #f8fafc; margin: 0 0 16px 0;">Your order is on the way!</h1>
              <p style="font-size: 16px; color: #94a3b8; margin: 0;">Great news! Your order #${order.display_id || order.id} has been shipped and is heading to you.</p>
            </td>
          </tr>

          <!-- Tracking Info -->
          <tr>
            <td style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 24px;">
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 16px;">SHIPPING UPDATES</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding-bottom: 20px;">
                    <div style="font-size: 14px; color: #94a3b8; margin-bottom: 4px;">Tracking Number</div>
                    <div style="font-size: 20px; font-weight: 700; color: #38bdf8; font-family: 'JetBrains Mono', monospace;">${trackingNumber}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style="font-size: 14px; color: #94a3b8; margin-bottom: 4px;">Carrier</div>
                    <div style="font-size: 18px; font-weight: 600; color: #f8fafc;">${shippingCompany}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Ship to -->
          <tr>
            <td style="padding-top: 48px;">
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 20px;">SHIPPING ADDRESS</div>
              <div style="font-size: 16px; font-weight: 600; color: #f8fafc; margin-bottom: 8px;">${order.shipping_address?.first_name} ${order.shipping_address?.last_name}</div>
              <div style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
                ${order.shipping_address?.address_1}<br>
                ${order.shipping_address?.city}, ${order.shipping_address?.province} ${order.shipping_address?.postal_code}<br>
                ${order.shipping_address?.country_code?.toUpperCase()}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top: 60px; border-top: 1px solid #1e293b; text-align: center;">
              <p style="font-size: 14px; color: #64748b; margin: 0;">If you have any questions, reply to this email or contact us at info@pardpro.ca</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
