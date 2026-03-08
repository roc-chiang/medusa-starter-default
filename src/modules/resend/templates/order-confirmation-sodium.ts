export function sodiumTemplate(order: any): string {
  const getDisplayPrice = (amount: any) => {
    if (amount === undefined || amount === null) return "0.00";
    // 根據用戶反饋，金額不需要除以 100
    const val = typeof amount === 'object' && amount.toNumber ? amount.toNumber() : Number(amount);
    return val.toFixed(2);
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // 套裝數量映射邏輯 (基於 Variant ID)
  const getDisplayQuantity = (item: any) => {
    const vid = item.variant_id;
    if (vid) {
      if (vid.startsWith("variant_01KK5KM")) return 2;
      if (vid.startsWith("variant_01KK5KY")) return 3;
      if (vid.startsWith("variant_01KK5M0")) return 4;
    }

    // 如果沒有匹配到特定 Variant，則備選使用 title 判斷，最後才用原始 quantity
    const title = (item.title || "").toLowerCase();
    if (title.includes("2-pack") || title.includes("2 pack")) return 2;
    if (title.includes("3-pack") || title.includes("3 pack")) return 3;
    if (title.includes("4-pack") || title.includes("4 pack")) return 4;

    return item.quantity || 1;
  }

  const itemsHtml = (order.items || [])
    .map(
      (item: any) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1e293b;">
            <div style="font-size: 14px; font-weight: 500; color: #cbd5e1;">${item.title}</div>
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569;">qty: ${getDisplayQuantity(item)}</div>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #1e293b; text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #94a3b8; vertical-align: top;">
            CA$${getDisplayPrice(item.unit_price)}
          </td>
        </tr>`
    )
    .join("")

  // 根據 Medusa v2 根路徑欄位讀取金額
  const subtotal = order.subtotal;
  const shipping = order.shipping_total;
  const tax = order.tax_total;
  const total = order.total;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmed</title>
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@300;400;500;600&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #0a0a0f; color: #e2e8f0; font-family: 'Inter', Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="background-color: #0a0a0f; color: #e2e8f0; font-family: 'Inter', Arial, sans-serif; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #0a0a0f 100%); padding: 32px 36px; border-bottom: none; position: relative;">
      <div style="height: 2px; background: linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6); width: 100%; margin: -32px auto 24px auto;"></div>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #06b6d4; letter-spacing: 0.1em; text-transform: uppercase;">// SodiumFrostGlow</td>
          <td align="right">
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 4px 10px; background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); color: #06b6d4; border-radius: 2px; letter-spacing: 0.05em;">ORDER_CONFIRMED</span>
          </td>
        </tr>
      </table>
      <h1 style="font-size: 28px; font-weight: 600; color: #f8fafc; letter-spacing: -0.02em; margin: 24px 0 8px 0;">Your order is in.</h1>
      <p style="font-size: 14px; color: #64748b; font-weight: 300; margin: 0;">We've received your order and are getting it ready.</p>
    </div>

    <!-- Order Info Block -->
    <div style="background: #0f172a; border-left: 1px solid #1e293b; border-right: 1px solid #1e293b; padding: 16px 36px;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569; text-transform: uppercase; letter-spacing: 0.1em;">Order <span style="color: #38bdf8; margin-left: 4px;">#${order.display_id}</span></td>
          <td align="center" style="width: 10px;"><div style="width: 3px; height: 3px; background: #334155; border-radius: 50%;"></div></td>
          <td style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569; text-transform: uppercase; letter-spacing: 0.1em;">Placed <span style="color: #38bdf8; margin-left: 4px;">${formatDate(order.created_at)}</span></td>
          <td align="center" style="width: 10px;"><div style="width: 3px; height: 3px; background: #334155; border-radius: 50%;"></div></td>
          <td style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569; text-transform: uppercase; letter-spacing: 0.1em;">Status <span style="color: #38bdf8; margin-left: 4px;">pending</span></td>
        </tr>
      </table>
    </div>

    <!-- Content Area -->
    <div style="background: #0d1117; border: 1px solid #1e293b; border-top: none;">
      <!-- Items Section -->
      <div style="padding: 28px 36px; border-bottom: 1px solid #1e293b;">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #475569; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 16px; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">Items Ordered</div>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          ${itemsHtml}
        </table>
      </div>

      <!-- Summary Section -->
      <div style="padding: 28px 36px; border-bottom: 1px solid #1e293b;">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #475569; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 16px; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">Summary</div>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="color: #64748b; font-size: 13px;">
          <tr>
            <td style="padding: 4px 0;">Subtotal</td>
            <td align="right" style="padding: 4px 0; font-family: 'JetBrains Mono', monospace;">CA$${getDisplayPrice(subtotal)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">Shipping</td>
            <td align="right" style="padding: 4px 0; font-family: 'JetBrains Mono', monospace;">CA$${getDisplayPrice(shipping)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">Tax</td>
            <td align="right" style="padding: 4px 0; font-family: 'JetBrains Mono', monospace;">CA$${getDisplayPrice(tax)}</td>
          </tr>
          <tr>
            <td style="padding: 14px 0 0 0; border-top: 1px solid #1e293b; font-size: 16px; font-weight: 600; color: #f8fafc;">Total</td>
            <td align="right" style="padding: 14px 0 0 0; border-top: 1px solid #1e293b; font-family: 'JetBrains Mono', monospace; color: #06b6d4; font-size: 18px;">CA$${getDisplayPrice(total)}</td>
          </tr>
        </table>
      </div>

      <!-- Shipping Address -->
      <div style="padding: 28px 36px; border-bottom: 1px solid #1e293b;">
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #475569; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 16px; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">Ship To</div>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td width="50%" style="vertical-align: top; padding-right: 10px;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #475569; text-transform: uppercase; margin-bottom: 4px;">Name</div>
              <div style="font-size: 13px; color: #94a3b8;">${order.shipping_address?.first_name} ${order.shipping_address?.last_name}</div>
            </td>
            <td width="50%" style="vertical-align: top;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #475569; text-transform: uppercase; margin-bottom: 4px;">Email</div>
              <div style="font-size: 13px; color: #94a3b8;">${order.email}</div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top: 16px;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #475569; text-transform: uppercase; margin-bottom: 4px;">Address</div>
              <div style="font-size: 13px; color: #94a3b8;">
                ${order.shipping_address?.address_1}, ${order.shipping_address?.city}, ${order.shipping_address?.province} ${order.shipping_address?.postal_code}
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 24px 36px; background: #0a0a0f;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #334155;">sodiumfrostglow.com</td>
          <td align="right">
            <a href="mailto:support@sodiumfrostglow.com" style="font-size: 12px; color: #475569; text-decoration: none; margin-right: 16px;">support</a>
            <a href="https://sodiumfrostglow.com" style="font-size: 12px; color: #475569; text-decoration: none;">store</a>
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`
}
