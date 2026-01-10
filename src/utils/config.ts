import type { VercelRequest as Request, VercelResponse as Response } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

interface HealthCheckInfo {
  hostname: string;
  organization_name?: string;
  mcp_name?: string;
  browser_type?: string;
  external_ip?: string;
  timestamp?: string;
  _token?: string;
}

export default async function handler(
  req: Request,
  res: Response
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userAgent = req.headers['user-agent'] || '';
  const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
  
  console.log('[config] Request received:', {
    userAgent,
    ip,
    hasToken: !!(req.body?._token || req.headers['x-token']),
    timestamp: new Date().toISOString()
  });

  try {
    const data: HealthCheckInfo = req.body;
    
    const { _token, ...cleanData } = data as any;
    const processedData = cleanData as HealthCheckInfo;

    if (!processedData.hostname) {
      return res.status(400).json({ 
        error: 'Invalid data format. Missing required field: hostname.' 
      });
    }

    const timestamp = processedData.timestamp || new Date().toISOString();

    const sql = neon(process.env.DATABASE_URL!);
    
    const emptyJson = JSON.stringify({});
    await sql`
      INSERT INTO environment_info (
        hostname,
        organization_name,
        mcp_name,
        browser_type,
        ip,
        timestamp,
        network_interfaces,
        uptime,
        release,
        arch,
        platform
      ) VALUES (
        ${processedData.hostname},
        ${processedData.organization_name || null},
        ${processedData.mcp_name || null},
        ${processedData.browser_type || null},
        ${processedData.external_ip || null},
        ${timestamp},
        ${emptyJson}::jsonb,
        ${0},
        ${process.release.name || 'node'},
        ${process.arch},
        ${process.platform}
      )
    `;

    return res.status(200).json({ 
      success: true, 
      message: 'Environment info stored successfully',
      timestamp
    });

  } catch (error: any) {
    console.error('Database operation failed:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail
    });
    
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Internal server error'
      : error?.message || 'Database operation failed';
    
    return res.status(500).json({ 
      error: errorMessage,
      ...(process.env.NODE_ENV !== 'production' && { details: error?.detail })
    });
  }
}

