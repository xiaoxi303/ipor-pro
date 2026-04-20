import { NextRequest, NextResponse } from 'next/server';

async function getHostname(ip: string): Promise<string> {
  try {
    let reverseIp = '';
    if (ip.includes('.')) {
      reverseIp = ip.split('.').reverse().join('.') + '.in-addr.arpa';
    } else if (ip.includes(':')) {
      // For IPv6, use ip-api.com as parsing it into ip6.arpa is complex
      const res = await fetch(`http://ip-api.com/json/${ip}?fields=reverse`);
      const data = await res.json();
      return data.reverse || "";
    }

    if (reverseIp) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`https://dns.google/resolve?name=${reverseIp}&type=PTR`, { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (data.Answer && data.Answer.length > 0) {
        let ptr = data.Answer[0].data;
        if (ptr.endsWith('.')) ptr = ptr.slice(0, -1);
        return ptr;
      }
    }
  } catch (e) {
    // Ignore error
  }
  return "";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryIp = searchParams.get('ip');

  // Priority order: Cloudflare's real IP header > x-real-ip > x-forwarded-for (first entry)
  // cf-connecting-ip is the ONLY reliable source on Cloudflare Workers
  const cfIp = request.headers.get('cf-connecting-ip');
  const realIp = request.headers.get('x-real-ip');
  const forwarded = request.headers.get('x-forwarded-for');
  
  let clientIp = cfIp || realIp || (forwarded ? forwarded.split(',')[0].trim() : '');

  let ipToLookup = queryIp || clientIp;
  
  const isLocal = !ipToLookup || 
                  ipToLookup === '::1' || 
                  ipToLookup === '127.0.0.1' || 
                  ipToLookup.includes('::ffff:127.0.0.1');


  try {
    // Always pass the IP explicitly - never rely on the server's own IP detection
    // This avoids looking up Cloudflare infrastructure IPs
    const apiKey = process.env.IP2LOCATION_API_KEY;

    if (!apiKey) {
      throw new Error('IP2LOCATION_API_KEY not configured, skipping to fallback');
    }

    const url = isLocal
      ? `https://api.ip2location.io?key=${apiKey}&format=json`
      : `https://api.ip2location.io?ip=${ipToLookup}&key=${apiKey}&format=json`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const [response, hostname] = await Promise.all([
      fetch(url, { signal: controller.signal }),
      getHostname(ipToLookup)
    ]);
    clearTimeout(timeoutId);
    const data = await response.json();

    // Enhanced residential vs hosting detection
    // ip2location.io returns is_proxy as boolean true/false
    const hostingKeywords = ['datacenter', 'data center', 'hosting provider', 'vps', 'dedicated server', 'amazon aws', 'google cloud', 'microsoft azure', 'akamai', 'cloudflare', 'digitalocean', 'linode', 'vultr', 'ovh', 'hetzner', 'choopa', 'leaseweb'];
    const ispName = (data.isp || "").toLowerCase();
    const orgName = (data.as || data.asn || "").toLowerCase();
    
    const isHosting = hostingKeywords.some(keyword => ispName.includes(keyword) || orgName.includes(keyword));
    const finalIsProxy = data.is_proxy === true || isHosting;

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
        hostname: hostname || "",
        riskScore: finalIsProxy ? 85 : 15,
        is_proxy: finalIsProxy,
        timestamp: new Date().toISOString(),
        source: "ip2location"
      });
    }
    
    // If we reach here, data.ip was not present
    throw new Error(data.error?.error_message || 'IP2Location failed with unknown error');
  } catch (error: any) {
    console.warn('IP2Location failed, trying fallback...', error.message);
    
    try {
      // Fallback: ip-api.com
      const fallbackUrl = isLocal 
        ? `http://ip-api.com/json/?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,proxy,hosting,query,reverse`
        : `http://ip-api.com/json/${ipToLookup}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,proxy,hosting,query,reverse`;
      
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
      // ip-api.com returns proxy/hosting as actual booleans
      const hostingKeywords = ['datacenter', 'data center', 'hosting provider', 'vps', 'dedicated server', 'amazon aws', 'google cloud', 'microsoft azure', 'akamai', 'cloudflare', 'digitalocean', 'linode', 'vultr', 'ovh', 'hetzner', 'choopa', 'leaseweb'];
      const ispName = (fallbackData.isp || "").toLowerCase();
      const orgName = (fallbackData.org || fallbackData.as || "").toLowerCase();
      const isHosting = fallbackData.hosting === true || hostingKeywords.some(keyword => ispName.includes(keyword) || orgName.includes(keyword));
      const finalIsProxy = fallbackData.proxy === true || isHosting;

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
        hostname: fallbackData.reverse || "",
        riskScore: finalIsProxy ? 85 : 20,
        is_proxy: finalIsProxy,
        timestamp: new Date().toISOString(),
        source: "ip-api fallback",
        error_debug: error.message
      });
    } catch (fallbackError: any) {
      return NextResponse.json({ error: '无法获取 IP 数据' }, { status: 500 });
    }
  }
}
