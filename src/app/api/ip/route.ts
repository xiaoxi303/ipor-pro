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
    const isProxy = data.is_proxy === true || !!data.proxy;
    
    // Comprehensive Risk Score Calculation
    let riskScore = 0;
    if (data.is_vpn) riskScore += 35;
    if (data.is_tor) riskScore += 45;
    if (data.is_data_center) riskScore += 20;
    if (data.is_public_proxy) riskScore += 30;
    if (data.is_web_proxy) riskScore += 25;
    if (data.is_spam) riskScore += 30;
    
    // Caps risk score at 100
    riskScore = Math.min(riskScore, 100);
    
    // If no major threats, use usage_type for baseline
    if (riskScore === 0) {
      if (data.is_residential) riskScore = 5;
      else if (data.usage_type === 'EDU') riskScore = 10;
      else if (data.usage_type === 'GOV') riskScore = 8;
      else riskScore = 15;
    }

    // ASN extraction
    let displayAsn = data.asn || "";
    let displayOrg = data.as || data.asn || "Unknown";
    if (displayOrg.startsWith('AS')) {
      const parts = displayOrg.split(' ');
      displayAsn = parts[0];
      displayOrg = parts.slice(1).join(' ');
    }

    return NextResponse.json({
      // Core Geolocation
      ip: data.ip,
      country_name: data.country_name,
      country_code: data.country_code,
      region: data.region_name,
      city: data.city_name,
      zip: data.zip_code,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.time_zone,
      
      // Network & Infrastructure
      asn: displayAsn,
      asn_org: displayOrg,
      isp: data.isp || displayOrg,
      org: data.usage_type || (isProxy ? "Data Center" : "ISP"),
      domain: data.domain || "Unknown",
      net_speed: data.net_speed || "Unknown",
      
      // Telephony & Weather (Advanced)
      idd_code: data.idd_code,
      area_code: data.area_code,
      weather_station_code: data.weather_station_code,
      weather_station_name: data.weather_station_name,
      
      // Mobile Data (Advanced)
      mcc: data.mcc,
      mnc: data.mnc,
      mobile_brand: data.mobile_brand,
      
      // Physical & Environment
      elevation: data.elevation,
      usage_type: data.usage_type,
      
      // Security & Risk
      riskScore: riskScore,
      is_proxy: isProxy,
      threat: {
        is_vpn: data.is_vpn || false,
        is_tor: data.is_tor || false,
        is_data_center: data.is_data_center || false,
        is_public_proxy: data.is_public_proxy || false,
        is_web_proxy: data.is_web_proxy || false,
        is_residential: data.is_residential || false,
        is_spam: data.is_spam || false,
        is_bot: data.is_bot || false,
        is_scanner: data.is_scanner || false
      },
      
      // Currency Info
      currency: data.time_zone_info?.currency?.name || "Unknown",
      currency_symbol: data.time_zone_info?.currency?.symbol || "",
      
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
        asn: fb.as ? fb.as.split(' ')[0] : "",
        asn_org: fb.as ? fb.as.split(' ').slice(1).join(' ') : fb.org,
        org: fb.hosting ? "Hosting" : "ISP",
        isp: fb.isp,
        riskScore: fb.proxy || fb.hosting ? 80 : 10,
        is_proxy: fb.proxy || fb.hosting,
        source: "ip-api fallback"
      });
    } catch (e) {
      return NextResponse.json({ error: 'Data Fetch Error' }, { status: 500 });
    }
  }
}
