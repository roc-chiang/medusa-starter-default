export function shipmentPardproTemplate(order: any, trackingNumber: string, shippingCompany: string = "Post Canada"): string {
    const currencyPrefix = order.currency_code?.toLowerCase() === 'usd' ? 'US$' : 'CA$';

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your order has shipped!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; color: #1e293b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
          <tr>
            <td style="padding: 40px;">
              <h1 style="font-size: 24px; font-weight: 700; color: #020617; margin: 0 0 16px 0;">Your order has shipped!</h1>
              <p style="font-size: 16px; line-height: 1.5; color: #475569; margin: 0 0 24px 0;">Your order #${order.display_id || order.id} is on its way to you.</p>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; border-radius: 6px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Tracking Number</div>
                    <div style="font-size: 18px; font-weight: 700; color: #0f172a;">${trackingNumber}</div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 12px; text-transform: uppercase;">Carrier: ${shippingCompany}</div>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 32px;">
                <h3 style="font-size: 14px; font-weight: 600; color: #020617; text-transform: uppercase; margin-bottom: 12px;">Shipping to:</h3>
                <p style="font-size: 16px; color: #475569; margin: 0;">
                  ${order.shipping_address?.first_name} ${order.shipping_address?.last_name}<br>
                  ${order.shipping_address?.address_1}<br>
                  ${order.shipping_address?.city}, ${order.shipping_address?.province} ${order.shipping_address?.postal_code}<br>
                  ${order.shipping_address?.country_code?.toUpperCase()}
                </p>
              </div>

              <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 24px; text-align: center;">
                <p style="font-size: 14px; color: #94a3b8; margin: 0;">Thanks for shopping with PardPro!</p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
