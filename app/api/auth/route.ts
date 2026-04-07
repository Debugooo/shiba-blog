import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, signToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // 验证密码
    if (!verifyPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // 生成 JWT token
    const token = await signToken({
      userId: 'admin',
      role: 'admin'
    })

    // 设置 cookie
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('auth-token')
    
    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
