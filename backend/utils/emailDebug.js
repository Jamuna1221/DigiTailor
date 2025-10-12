// Email debugging utilities

export const logEmailConfig = () => {
  console.log('\n🔧 ======= EMAIL CONFIG DEBUG =======');
  console.log(`📧 EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set' : '❌ Not Set'}`);
  console.log(`🔐 EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not Set'}`);
  console.log(`🌐 BACKEND_URL: ${process.env.BACKEND_URL || 'http://localhost:5000'}`);
  console.log(`🌐 FRONTEND_URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log('==================================\n');
};

export const validateEmailSetup = () => {
  const issues = [];
  
  if (!process.env.EMAIL_USER) {
    issues.push('❌ EMAIL_USER not set in environment');
  }
  
  if (!process.env.EMAIL_PASSWORD) {
    issues.push('❌ EMAIL_PASSWORD not set in environment');
  }
  
  if (process.env.EMAIL_USER && !process.env.EMAIL_USER.includes('@gmail.com')) {
    issues.push('⚠️ EMAIL_USER should be a Gmail address');
  }
  
  if (issues.length > 0) {
    console.log('\n⚠️ ======= EMAIL SETUP ISSUES =======');
    issues.forEach(issue => console.log(issue));
    console.log('===================================\n');
    return false;
  }
  
  console.log('\n✅ ======= EMAIL SETUP VALID =======');
  console.log('All email configuration looks good!');
  console.log('=================================\n');
  return true;
};

export const debugDeliveryUrl = (token) => {
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  const fullUrl = `${baseUrl}/api/orders/confirm-delivery/${token}`;
  
  console.log('\n🔗 ======= DELIVERY URL DEBUG =======');
  console.log(`🏠 Base URL: ${baseUrl}`);
  console.log(`🔑 Token: ${token}`);
  console.log(`🌐 Full URL: ${fullUrl}`);
  console.log(`📋 URL Length: ${fullUrl.length} characters`);
  console.log('==================================\n');
  
  return fullUrl;
};

export const logOrderEmailData = (order) => {
  console.log('\n📊 ======= ORDER EMAIL DATA =======');
  console.log(`🆔 Order ID: ${order.orderId || order._id || 'N/A'}`);
  console.log(`📋 Order Number: ${order.orderNumber || 'N/A'}`);
  console.log(`📅 Created: ${order.createdAt || 'N/A'}`);
  console.log(`📦 Status: ${order.status || 'N/A'}`);
  console.log(`🔑 Has Token: ${!!order.deliveryToken}`);
  console.log(`🔑 Token: ${order.deliveryToken || 'N/A'}`);
  console.log(`👤 User ID: ${order.userId?._id || order.userId || 'N/A'}`);
  console.log(`📧 Email: ${order.userId?.email || 'N/A'}`);
  console.log(`👨‍👩‍👧‍👦 Name: ${order.userId?.firstName || 'N/A'} ${order.userId?.lastName || 'N/A'}`);
  console.log(`🛍️ Items: ${order.items ? order.items.length : 0}`);
  console.log(`📅 Est. Delivery: ${order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'N/A'}`);
  console.log('=================================\n');
};