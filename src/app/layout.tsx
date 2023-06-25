import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Tools by AI',
  description: '这是一个开源的在线工具，主要由 ChatGPT 完成编程。我将把之前的本地应用处理工具在线化，并分享在这里。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-Hans">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
