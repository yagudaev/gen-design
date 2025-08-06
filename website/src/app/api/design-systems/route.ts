import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // For now, return mock data - in production this would query the database
    const designSystems = [
      {
        id: 'material-ui',
        name: 'Material UI',
        componentCount: 45,
        components: []
      },
      {
        id: 'ant-design',
        name: 'Ant Design',
        componentCount: 62,
        components: []
      },
      {
        id: 'bootstrap',
        name: 'Bootstrap',
        componentCount: 38,
        components: []
      }
    ]

    return NextResponse.json({
      success: true,
      designSystems
    })
  } catch (error: any) {
    console.error('Failed to fetch design systems:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch design systems' 
      },
      { status: 500 }
    )
  }
}