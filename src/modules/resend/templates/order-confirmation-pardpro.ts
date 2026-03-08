export function pardproTemplate(order: any): string {
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

    // 備選判斷標題
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
          <td style="padding: 15px 0; border-bottom: 1px solid #f9f9f9;">
            <div style="font-weight: 500; font-size: 15px; color: #1a1a1a;">${item.title}</div>
            <div style="font-size: 12px; color: #999; margin-top: 4px;">qty: ${getDisplayQuantity(item)}</div>
          </td>
          <td style="padding: 15px 0; border-bottom: 1px solid #f9f9f9; text-align: right; font-size: 14px; color: #1a1a1a; vertical-align: top;">
            CA$${getDisplayPrice(item.unit_price)}
          </td>
        </tr>`
    )
    .join("")

  // 取得金額數值（多重回退確保讀取到數據）
  const subtotal = order.subtotal ?? order.summary?.subtotal ?? 0;
  const shipping = order.shipping_total ?? order.summary?.shipping_total ?? 0;
  const tax = order.tax_total ?? order.summary?.tax_total ?? 0;
  const total = order.total ?? order.summary?.total ?? 0;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmed</title>
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #ffffff; color: #1a1a1a; font-family: 'Inter', Helvetica, Arial, sans-serif; }
  </style>
</head>
<body style="background-color: #ffffff; color: #1a1a1a; font-family: 'Inter', Arial, sans-serif; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5;">
    <!-- Header -->
    <div style="background-color: #000000; color: #ffffff; padding: 40px 36px; text-align: center;">
      <span style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 15px; display: block;">Pardpro</span>
      <h1 style="font-size: 24px; font-weight: 500; margin: 0;">Order Confirmation</h1>
    </div>

    <!-- Content -->
    <div style="padding: 36px;">
      <div style="margin-bottom: 30px; font-size: 14px; color: #666;">
        Order #${order.display_id} • ${formatDate(order.created_at)}
      </div>

      <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Your Selection</div>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        ${itemsHtml}
      </table>

      <!-- Totals -->
      <div style="margin-top: 30px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; color: #1a1a1a;">
          <tr>
            <td style="padding: 5px 0;">Subtotal</td>
            <td align="right" style="padding: 5px 0;">CA$${getDisplayPrice(subtotal)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;">Shipping</td>
            <td align="right" style="padding: 5px 0;">CA$${getDisplayPrice(shipping)}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;">Tax</td>
            <td align="right" style="padding: 5px 0;">CA$${getDisplayPrice(tax)}</td>
          </tr>
          <tr>
            <td style="padding: 20px 0 0 0; border-top: 2px solid #000; font-weight: 600; font-size: 18px;">Total</td>
            <td align="right" style="padding: 20px 0 0 0; border-top: 2px solid #000; font-weight: 600; font-size: 18px;">CA$${getDisplayPrice(total)}</td>
          </tr>
        </table>
      </div>

      <!-- Shipping -->
      <div style="margin-top: 40px;">
        <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Shipping To</div>
        <p style="font-size: 14px; line-height: 1.6; color: #1a1a1a; margin: 0;">
          ${order.shipping_address?.first_name} ${order.shipping_address?.last_name}<br />
          ${order.shipping_address?.address_1}<br />
          ${order.shipping_address?.city}, ${order.shipping_address?.province} ${order.shipping_address?.postal_code}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 40px 36px; background-color: #f9f9f9; text-align: center; font-size: 12px; color: #999;">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} Pardpro. All rights reserved.</p>
      <div style="margin-top: 15px;">
        <a href="https://pardpro.ca" style="color: #000; text-decoration: none; margin: 0 10px;">Store</a>
        <a href="mailto:info@pardpro.ca" style="color: #000; text-decoration: none; margin: 0 10px;">Contact</a>
      </div>
    </div>
  </div>
</body>
</html>`
}
