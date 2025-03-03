addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Please send a POST request', { status: 405 })
  }

  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  const message = formData.get('message')

  // 使用QQ邮箱SMTP发送邮件
  const emailData = {
    to: '2216921192@qq.com',
    subject: `来自网站的新消息 - ${name}`,
    text: `发件人: ${name}\n邮箱: ${email}\n\n${message}`
  }

  try {
    // 发送邮件逻辑
    await sendEmail(emailData)
    
    return new Response('Message sent successfully!', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    return new Response('Failed to send message', { status: 500 })
  }
}
