export function sodiumTemplate(order: any): string {
    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        })
    }

    const itemsHtml = order.items
        .map(
            (item: any) => `
        <div class="item">
          <div class="item-info">
            <span class="item-name">${item.title}</span>
            <span class="item-qty">qty: ${item.quantity}</span>
          </div>
          <span class="item-price">CA$${(item.unit_price).toFixed(2)}</span>
        </div>`
        )
        .join("")

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@300;400;500;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #0a0a0f; color: #e2e8f0; font-family: 'Inter', sans-serif; padding: 40px 20px; }
    .wrapper { max-width: 600px; margin: 0 auto; }
    .header { border: 1px solid #1e293b; border-bottom: none; background: linear-gradient(135deg, #0f172a 0%, #0a0a0f 100%); padding: 32px 36px; position: relative; overflow: hidden; }
    .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6); }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .brand { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #06b6d4; letter-spacing: 0.1em; text-transform: uppercase; }
    .status-badge { font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 4px 10px; background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); color: #06b6d4; border-radius: 2px; letter-spacing: 0.05em; }
    .header h1 { font-size: 28px; font-weight: 600; color: #f8fafc; letter-spacing: -0.02em; margin-bottom: 8px; }
    .header p { font-size: 14px; color: #64748b; font-weight: 300; }
    .order-id-block { background: #0f172a; border: 1px solid #1e293b; border-top: none; border-bottom: none; padding: 16px 36px; display: flex; align-items: center; gap: 12px; }
    .order-id-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569; text-transform: uppercase; letter-spacing: 0.1em; }
    .order-id-value { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #38bdf8; }
    .divider-dot { width: 3px; height: 3px; background: #334155; border-radius: 50%; }
    .content { border: 1px solid #1e293b; border-top: none; background: #0d1117; }
    .section { padding: 28px 36px; border-bottom: 1px solid #1e293b; }
    .section-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #475569; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .section-label::after { content: ''; flex: 1; height: 1px; background: #1e293b; }
    .item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px dashed #1e293b; }
    .item-info { display: flex; flex-direction: column; gap: 3px; }
    .item-name { font-size: 14px; font-weight: 500; color: #cbd5e1; }
    .item-qty { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569; }
    .item-price { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #94a3b8; }
    .totals { display: flex; flex-direction: column; gap: 10px; }
    .total-row { display: flex; justify-content: space-between; font-size: 13px; color: #64748b; }
    .total-row.grand { padding-top: 14px; border-top: 1px solid #1e293b; font-size: 16px; font-weight: 600; color: #f8fafc; }
    .total-row.grand .amount { font-family: 'JetBrains Mono', monospace; color: #06b6d4; font-size: 18px; }
    .total-row .amount { font-family: 'JetBrains Mono', monospace; }
    .address-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .address-field { display: flex; flex-direction: column; gap: 3px; }
    .field-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #475569; text-transform: uppercase; letter-spacing: 0.1em; }
    .field-value { font-size: 13px; color: #94a3b8; }
    .next-steps { display: flex; flex-direction: column; gap: 14px; }
    .step { display: flex; align-items: flex-start; gap: 14px; }
    .step-num { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #06b6d4; background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.2); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 2px; flex-shrink: 0; }
    .step-text { font-size: 13px; color: #64748b; line-height: 1.6; }
    .footer { border: 1px solid #1e293b; border-top: none; padding: 24px 36px; background: #0a0a0f; display: flex; justify-content: space-between; align-items: center; }
    .footer-brand { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #334155; }
    .footer-links { display: flex; gap: 20px; }
    .footer-link { font-size: 12px; color: #475569; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-top">
        <span class="brand">// SodiumFrostGlow</span>
        <span class="status-badge">ORDER_CONFIRMED</span>
      </div>
      <h1>Your order is in.</h1>
      <p>We've received your order and are getting it ready.</p>
    </div>
    <div class="order-id-block">
      <span class="order-id-label">Order</span>
      <span class="order-id-value">#${order.display_id}</span>
      <span class="divider-dot"></span>
      <span class="order-id-label">Placed</span>
      <span class="order-id-value">${formatDate(order.created_at)}</span>
      <span class="divider-dot"></span>
      <span class="order-id-label">Status</span>
      <span class="order-id-value">pending</span>
    </div>
    <div class="content">
      <div class="section">
        <div class="section-label">Items Ordered</div>
        ${itemsHtml}
      </div>
      <div class="section">
        <div class="section-label">Summary</div>
        <div class="totals">
          <div class="total-row"><span>Subtotal</span><span class="amount">CA$${(order.subtotal).toFixed(2)}</span></div>
          <div class="total-row"><span>Shipping</span><span class="amount">CA$${(order.shipping_total).toFixed(2)}</span></div>
          <div class="total-row"><span>Tax</span><span class="amount">CA$${(order.tax_total).toFixed(2)}</span></div>
          <div class="total-row grand"><span>Total</span><span class="amount">CA$${(order.total).toFixed(2)}</span></div>
        </div>
      </div>
      <div class="section">
        <div class="section-label">Ship To</div>
        <div class="address-grid">
          <div class="address-field">
            <span class="field-label">Name</span>
            <span class="field-value">${order.shipping_address?.first_name} ${order.shipping_address?.last_name}</span>
          </div>
          <div class="address-field">
            <span class="field-label">Email</span>
            <span class="field-value">${order.email}</span>
          </div>
          <div class="address-field" style="grid-column: 1 / -1">
            <span class="field-label">Address</span>
            <span class="field-value">${order.shipping_address?.address_1}, ${order.shipping_address?.city}, ${order.shipping_address?.province} ${order.shipping_address?.postal_code}</span>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-label">What Happens Next</div>
        <div class="next-steps">
          <div class="step"><span class="step-num">01</span><span class="step-text"><strong>Processing</strong> — We're preparing your order.</span></div>
          <div class="step"><span class="step-num">02</span><span class="step-text"><strong>Shipped</strong> — You'll receive a tracking number soon.</span></div>
        </div>
      </div>
    </div>
    <div class="footer">
      <span class="footer-brand">sodiumfrostglow.com</span>
      <div class="footer-links">
        <a href="mailto:support@sodiumfrostglow.com" class="footer-link">support@sodiumfrostglow.com</a>
        <a href="https://sodiumfrostglow.com" class="footer-link">visit store</a>
      </div>
    </div>
  </div>
</body>
</html>`
}
