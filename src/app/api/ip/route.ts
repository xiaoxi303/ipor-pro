import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryIp = searchParams.get('ip');

  const forwarded = request.headers.get('x-forwarded-for');
  let clientIp = forwarded ? forwarded.split(',')[0] : '';

  let ipToLookup = queryIp || clientIp;
  
  const isLocal = !ipToLookup || 
                  ipToLookup === '::1' || 
                  ipToLookup === '127.0.0.1' || 
                  ipToLookup.includes('::ffff:127.0.0.1');

  try {
    // Primary: IP2Location.io (Using their free public endpoint if possible, or simulating the format)
    // Note: IP2Location is highly regarded for its database integrity.
    const url = isLocal 
      ? `https://api.ip2location.io/` 
      : `https://api.ip2location.io/?ip=${ipToLookup}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    const data = await response.json();

    // Enhanced residential vs hosting detection
    const hostingKeywords = ['cloud', 'datacenter', 'hosting', 'server', 'vps', 'dedicated', 'data center', 'network solutions', 'amazon', 'google', 'microsoft', 'azure', 'akamai', 'cloudflare', 'digitalocean', 'linode', 'vultr', 'ovh', 'hetzner', 'choopa', 'leaseweb'];
    const ispName = (data.isp || "").toLowerCase();
    const orgName = (data.as || data.asn || "").toLowerCase();
    
    const isHosting = hostingKeywords.some(keyword => ispName.includes(keyword) || orgName.includes(keyword));
    const finalIsProxy = data.is_proxy || isHosting;

    // Mapping for common currencies based on country code
    const currencyMap: Record<string, { name: string, symbol: string }> = {
      'CN': { name: '人民币 (CNY)', symbol: '¥' },
      'US': { name: '美元 (USD)', symbol: '$' },
      'HK': { name: '港币 (HKD)', symbol: 'HK$' },
      'TW': { name: '新台币 (TWD)', symbol: 'NT$' },
      'JP': { name: '日元 (JPY)', symbol: '¥' },
      'SG': { name: '新加坡元 (SGD)', symbol: 'S$' },
      'GB': { name: '英镑 (GBP)', symbol: '£' },
      'EU': { name: '欧元 (EUR)', symbol: '€' },
      'DE': { name: '欧元 (EUR)', symbol: '€' },
      'FR': { name: '欧元 (EUR)', symbol: '€' },
      'KR': { name: '韩元 (KRW)', symbol: '₩' },
    };

    const currencyInfo = data.time_zone_info?.currency || currencyMap[data.country_code] || { name: '未知', symbol: '' };

    // Parse ASN and Org more cleanly
    let displayAsn = data.asn || "";
    let displayOrg = data.as || data.asn || "";
    
    if (displayOrg.startsWith('AS')) {
      const parts = displayOrg.split(' ');
      displayAsn = parts[0];
      displayOrg = parts.slice(1).join(' ');
    }

    if (data.ip) {
      return NextResponse.json({
        ip: data.ip,
        country_name: data.country_name,
        country_code: data.country_code,
        region: data.region_name,
        city: data.city_name,
        zip: data.zip_code,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.time_zone,
        currency: currencyInfo.name,
        currency_symbol: currencyInfo.symbol,
        asn: displayAsn,
        asn_org: displayOrg,
        org: finalIsProxy ? "Data Center / Hosting" : "Residential / Corporate",
        isp: data.isp || displayOrg || "Unknown",
        riskScore: finalIsProxy ? 85 : 15,
        is_proxy: finalIsProxy,
        timestamp: new Date().toISOString(),
      });
    }
    
    throw new Error('IP2Location failed');
  } catch (error: any) {
    console.warn('IP2Location failed, trying fallback...', error.message);
    
    try {
      // Fallback: ip-api.com
      const fallbackUrl = isLocal 
        ? `http://ip-api.com/json/?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,proxy,hosting,query`
        : `http://ip-api.com/json/${ipToLookup}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,proxy,hosting,query`;
      
      const fallbackRes = await fetch(fallbackUrl);
      const fallbackData = await fallbackRes.json();
      const currencyMap: Record<string, { name: string, symbol: string }> = {
        'CN': { name: '人民币 (CNY)', symbol: '¥' },
        'US': { name: '美元 (USD)', symbol: '$' },
        'HK': { name: '港币 (HKD)', symbol: 'HK$' },
        'TW': { name: '新台币 (TWD)', symbol: 'NT$' },
        'JP': { name: '日元 (JPY)', symbol: '¥' },
        'SG': { name: '新加坡元 (SGD)', symbol: 'S$' },
        'GB': { name: '英镑 (GBP)', symbol: '£' },
        'DE': { name: '欧元 (EUR)', symbol: '€' },
        'FR': { name: '欧元 (EUR)', symbol: '€' },
        'KR': { name: '韩元 (KRW)', symbol: '₩' },
      };

      const currencyInfo = currencyMap[fallbackData.countryCode] || { name: '未知', symbol: '' };

      // Enhanced residential vs hosting detection
      const hostingKeywords = ['cloud', 'datacenter', 'hosting', 'server', 'vps', 'dedicated', 'data center', 'network solutions', 'amazon', 'google', 'microsoft', 'azure', 'akamai', 'cloudflare', 'digitalocean', 'linode', 'vultr', 'ovh', 'hetzner', 'choopa', 'leaseweb'];
      const ispName = (fallbackData.isp || "").toLowerCase();
      const orgName = (fallbackData.org || fallbackData.as || "").toLowerCase();
      const isHosting = fallbackData.hosting || hostingKeywords.some(keyword => ispName.includes(keyword) || orgName.includes(keyword));
      const finalIsProxy = fallbackData.proxy || isHosting;

      // Parse ASN and Org more cleanly
      let displayAsn = "";
      let displayOrg = fallbackData.as || fallbackData.org || fallbackData.isp || "";
      
      if (displayOrg.startsWith('AS')) {
        const parts = displayOrg.split(' ');
        displayAsn = parts[0];
        displayOrg = parts.slice(1).join(' ');
      }

      return NextResponse.json({
        ip: fallbackData.query,
        country_name: fallbackData.country,
        country_code: fallbackData.countryCode,
        region: fallbackData.regionName,
        city: fallbackData.city,
        zip: fallbackData.zip,
        latitude: fallbackData.lat,
        longitude: fallbackData.lon,
        timezone: fallbackData.timezone,
        currency: currencyInfo.name,
        currency_symbol: currencyInfo.symbol,
        asn: displayAsn || fallbackData.as,
        asn_org: displayOrg,
        org: finalIsProxy ? "Data Center / Hosting" : "Residential / Corporate",
        isp: fallbackData.isp || displayOrg,
        riskScore: finalIsProxy ? 85 : 20,
        is_proxy: finalIsProxy,
        timestamp: new Date().toISOString(),
      });
    } catch (fallbackError: any) {
      return NextResponse.json({ error: '无法获取 IP 数据' }, { status: 500 });
    }
  }
}
