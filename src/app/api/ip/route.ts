import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryIp = searchParams.get('ip');

  const cfIp = request.headers.get('cf-connecting-ip');
  const realIp = request.headers.get('x-real-ip');
  const forwarded = request.headers.get('x-forwarded-for');
  
  let clientIp = cfIp || realIp || (forwarded ? forwarded.split(',')[0].trim() : '');
  let ipToLookup = queryIp || clientIp;
  
  const isLocal = !ipToLookup || 
                  ipToLookup === '::1' || 
                  ipToLookup === '127.0.0.1' || 
                  ipToLookup.includes('::ffff:127.0.0.1');

  const apiKey = process.env.IP2LOCATION_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'IP2Location API key is missing' }, { status: 500 });
  }

  try {
    // API endpoint for ip2location.io (Professional lookup)
    const url = isLocal
      ? `https://api.ip2location.io?key=${apiKey}&format=json`
      : `https://api.ip2location.io?ip=${ipToLookup}&key=${apiKey}&format=json`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.error_message || 'API Error');
    }

    // Use REAL data from IP2Location
    // is_proxy and threat categories are provided by the API
    const isProxy = data.is_proxy === true || !!data.proxy;
    
    // Calculate a more realistic Risk Score based on threat data if available, 
    // otherwise fallback to proxy status
    let riskScore = 0;
    if (isProxy) riskScore += 50;
    if (data.is_vpn) riskScore += 20;
    if (data.is_tor) riskScore += 30;
    if (data.is_data_center) riskScore += 10;
    if (riskScore > 100) riskScore = 100;
    
    // If no specific threat data, just use 10 for clean residential
    if (riskScore === 0) riskScore = data.is_residential ? 5 : 15;

    // Currency mapping from API or fallback
    const currency = data.time_zone_info?.currency?.name || "Unknown";
    const currencySymbol = data.time_zone_info?.currency?.symbol || "";

    // ASN extraction
    let displayAsn = data.asn || "";
    let displayOrg = data.as || data.asn || "Unknown";
    
    if (displayOrg.startsWith('AS')) {
      const parts = displayOrg.split(' ');
      displayAsn = parts[0];
      displayOrg = parts.slice(1).join(' ');
    }

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
      currency: currency,
      currency_symbol: currencySymbol,
      asn: displayAsn,
      asn_org: displayOrg,
      // Map usage type directly from API if available
      org: data.usage_type || (isProxy ? "Data Center / Hosting" : "Residential"),
      isp: data.isp || displayOrg,
      riskScore: riskScore,
      is_proxy: isProxy,
      // Pass raw threat data for high-fidelity detection
      threat: {
        is_vpn: data.is_vpn || false,
        is_tor: data.is_tor || false,
        is_data_center: data.is_data_center || false,
        is_public_proxy: data.is_public_proxy || false,
        is_web_proxy: data.is_web_proxy || false,
        is_residential: data.is_residential || false
      },
      timestamp: new Date().toISOString(),
      source: "ip2location.io (Official API)"
    });

  } catch (error: any) {
    console.error('IP2Location Primary API Failed:', error.message);
    
    // Final Fallback to IP-API (Ensuring it's only used if the primary fails)
    try {
      const fallbackUrl = isLocal 
        ? `http://ip-api.com/json/?fields=66846719` 
        : `http://ip-api.com/json/${ipToLookup}?fields=66846719`;
      
      const fallbackRes = await fetch(fallbackUrl);
      const fb = await fallbackRes.json();

      return NextResponse.json({
        ip: fb.query,
        country_name: fb.country,
        country_code: fb.countryCode,
        region: fb.regionName,
        city: fb.city,
        zip: fb.zip,
        latitude: fb.lat,
        longitude: fb.lon,
        timezone: fb.timezone,
        currency: "Unknown",
        asn: fb.as ? fb.as.split(' ')[0] : "",
        asn_org: fb.as ? fb.as.split(' ').slice(1).join(' ') : fb.org,
        org: fb.hosting ? "Hosting" : "Residential",
        isp: fb.isp,
        riskScore: fb.proxy || fb.hosting ? 80 : 10,
        is_proxy: fb.proxy || fb.hosting,
        source: "ip-api fallback (verification required)"
      });
    } catch (e) {
      return NextResponse.json({ error: 'Data Fetch Error' }, { status: 500 });
    }
  }
}

