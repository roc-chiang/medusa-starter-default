export function pardproTemplate(order: any): string {
  const getDisplayPrice = (amount: any) => {
    if (amount === undefined || amount === null) return "0.00";

    let val: number;
    if (typeof amount === 'object' && amount.value !== undefined) {
      val = Number(amount.value);
    } else if (typeof amount === 'object' && typeof amount.toNumber === 'function') {
      val = amount.toNumber();
    } else {
      val = Number(amount);
    }

    if (isNaN(val)) return "0.00";
    return val.toFixed(2);
  }

  const getDisplayQuantity = (item: any) => {
    const vid = item.variant_id;
    if (vid) {
      if (vid.startsWith("variant_01KK5KM")) return 2;
      if (vid.startsWith("variant_01KK5KY")) return 3;
      if (vid.startsWith("variant_01KK5M0")) return 4;
    }

    const title = (item.title || "").toLowerCase();
    if (title.includes("2-pack")) return 2;
    if (title.includes("3-pack")) return 3;
    if (title.includes("4-pack")) return 4;

    return item.quantity || 1;
  }

  const itemsHtml = (order.items || [])
    .map((item: any) => {
      const displayQty = getDisplayQuantity(item);
      const unitPrice = item.unit_price?.toNumber ? item.unit_price.toNumber() : Number(item.unit_price || 0);
      const lineTotal = unitPrice * displayQty;

      return `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #1e293b; vertical-align: top;">
            <div style="font-size: 16px; font-weight: 600; color: #f8fafc; margin-bottom: 4px;">${item.title}</div>
            <div style="font-size: 14px; color: #94a3b8;">qty: ${displayQty}</div>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #1e293b; text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #94a3b8; vertical-align: top;">
            CA$${getDisplayPrice(lineTotal)}
          </td>
        </tr>`
    })
    .join("")

  // Medusa v2 彙總金額：總價建議使用 current_order_total，小計/稅/運費使用根欄位 (需搭配 Subscriber select)
  const summary = order.summary || {};
  const subtotal = order.subtotal ?? summary.subtotal ?? 0;
  const shipping = order.shipping_total ?? summary.shipping_total ?? 0;
  const tax = order.tax_total ?? summary.tax_total ?? 0;
  const total = summary.current_order_total ?? order.total ?? 0;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your order is in.</title>
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
              <h1 style="font-size: 32px; font-weight: 700; color: #f8fafc; margin: 0 0 16px 0;">Your order is in.</h1>
              <p style="font-size: 16px; color: #94a3b8; margin: 0;">We've received your order and are getting it ready.</p>
            </td>
          </tr>

          <!-- Meta Info -->
          <tr>
            <td style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 16px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">ORDER <span style="color: #38bdf8; font-weight: 600;">#${order.display_id || order.id}</span></td>
                  <td style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; text-align: center;">• PLACED <span style="color: #f8fafc; font-weight: 600;">${new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</span></td>
                  <td style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; text-align: right;">• STATUS <span style="color: #38bdf8; font-weight: 600;">PENDING</span></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items ordered -->
          <tr>
            <td style="padding-top: 40px;">
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 16px;">ITEMS ORDERED</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- Summary -->
          <tr>
            <td style="padding-top: 40px; border-top: 1px solid #1e293b;">
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 20px;">SUMMARY</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 8px 0; font-size: 16px; color: #94a3b8;">Subtotal</td>
                  <td style="padding: 8px 0; text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 16px; color: #94a3b8;">CA$${getDisplayPrice(subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 16px; color: #94a3b8;">Shipping</td>
                  <td style="padding: 8px 0; text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 16px; color: #94a3b8;">CA$${getDisplayPrice(shipping)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 16px; color: #94a3b8;">Tax</td>
                  <td style="padding: 8px 0; text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 16px; color: #94a3b8;">CA$${getDisplayPrice(tax)}</td>
                </tr>
                <tr>
                  <td style="padding: 16px 0; font-size: 20px; font-weight: 700; color: #f8fafc; border-top: 1px solid #1e293b;">Total</td>
                  <td style="padding: 16px 0; text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 700; color: #38bdf8; border-top: 1px solid #1e293b;">CA$${getDisplayPrice(total)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Ship to -->
          <tr>
            <td style="padding-top: 48px;">
              <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 20px;">SHIP TO</div>
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="300" style="vertical-align: top; padding-right: 20px;">
                    <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 8px;">NAME</div>
                    <div style="font-size: 16px; font-weight: 600; color: #f8fafc;">${order.shipping_address?.first_name} ${order.shipping_address?.last_name}</div>
                  </td>
                  <td width="300" style="vertical-align: top;">
                    <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 8px;">EMAIL</div>
                    <div style="font-size: 16px; font-weight: 600; color: #38bdf8;">${order.email}</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 24px;">
                    <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 8px;">ADDRESS</div>
                    <div style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
                      ${order.shipping_address?.address_1}, ${order.shipping_address?.city}, ${order.shipping_address?.province} ${order.shipping_address?.postal_code}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
